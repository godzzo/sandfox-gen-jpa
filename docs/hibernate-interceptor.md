# Record Audit - Spring Data

Egy érdekes példa arra hogyan lehet Record Audit -ot végezni (vagyis mező szintű változás követést) Spring JPA -val, ha **Hibernate** -et használunk.

[Példa Projekt - GitHub](https://github.com/McLuck/user-crud)

## Folyamat

-   Hibernate menti a Domain -t
    -   _TrackingUserActivity_ annotálás
-   Hibernate Interceptor az előző és aktuális állapot alapján
    -   _EmptyInterceptor.onFlushDirty_ - implementálása
    -   betolja ThreadLocal -ba a változást (UserActivity)
    -   akkor ha megvan annotálva (TrackingUserActivity)
-   a Request lefutása után
    -   _HandlerInterceptor.afterCompletion_ implementálása
    -   ellenőrzi, hogy a ThreadLocal -ban van -e változás
    -   ha igen, akkor menti a változáskövetés Repository -ába

```plantuml
package "Dispatcher Request\nSpring Data Rest API" {
	component Req [
		**Web Request**
		__[ Rest API ]__

		- Call Save Entities
	]

	component SRest [
		**JPARepository**
		__[ using Hibernate ]__

		- Save Entity
	]
	Req -> SRest

	component HInt [
		**EmptyInterceptor**
		__[ Hibernate ]__

		- check Annotation
		- collect Changes
		  - to ThreadLocal
	]
	SRest --> HInt

	component MvcHnd [
		**HandlerInterceptor**
		__[ Spring Dispatcher ]__

		- check ThreadLocal
		- save Changes
		  - by JpaRepositories
	]
	Req --> MvcHnd
}
```

## Rendszer elemek

### Hibernate Configuration

Hibernate felé regisztrálni kell az interceptor -t, itt @Configuration és hibernateProperties -en keresztül történik.
[Session Event Interceptor](https://docs.jboss.org/hibernate/orm/5.5/userguide/html_single/Hibernate_User_Guide.html#configurations-session-events)

-   _Deprecated setting. Use `hibernate.session_factory.session_scoped_interceptor` instead._

```java
@Configuration
public class UserChangesHibernatePropertyCustomizer implements HibernatePropertiesCustomizer {
    @Autowired UserChangesInterceptor userInterceptor;

    public void customize ( final Map < String , Object > hibernateProperties ) {
        hibernateProperties.put( "hibernate.session_factory.interceptor" , userInterceptor );
    }
}
```

### Hibernate Interceptor

-   [ApiDoc](https://docs.jboss.org/hibernate/orm/5.5/javadocs/org/hibernate/EmptyInterceptor.html)

```java
import org.hibernate.EmptyInterceptor;

@Component
public class UserChangesInterceptor extends EmptyInterceptor {
    @Autowired
    @Qualifier ( "userActivity" )
    private ThreadLocal < UserActivity > userActivity;
```

### onFlushDirty - Interceptop esemény

Az `onFlushDirty` -t használja az előző (prevVal) és a aktuális érték (currVal) eléréséhez:
_Called when an object is detected to be dirty, during a flush._

-   [onFlushDirty vs onSave](https://stackoverflow.com/questions/25155868/hibernate-interceptors-why-is-onflushdirty-called-after-onsave)

```java
    public boolean onFlushDirty ( final Object entity , final Serializable id , final Object[] currentState , final Object[] previousState , final String[] propertyNames , final Type[] types ) {
        if ( entity.getClass().isAnnotationPresent( TrackingUserActivity.class ) ) {
            for ( int i = 0 ; i < propertyNames.length ; i++ ) {
                final Object current = currentState[ i ];
                final Object previous = previousState[ i ];
                final boolean changed = current != null && ! current.equals( previous );

                if ( changed ) {
                    final ChangedData changedData = new ChangedData();
                    changedData.setAttribute( entity.getSimpleName() +"."+ propertyNames[ i ] ) );
                    changedData.setNewValue( String.valueOf( current ) );
                    changedData.setOldValue( String.valueOf( previous ) );
                    userActivity.get().addChanges( changedData );
                }
            }
        }
        return super.onFlushDirty( entity , id , currentState , previousState , propertyNames , types );
    }
```

### Változás követés mentése - MVC Interceptor

Minde lefutott MVC Request után, megnézzük, hogy van -e mentett UserActivity.
Ha van akkor mentjük a UserActivityRepository és ChangedDataRepository -ba.

-   Spring MVC **HandlerInterceptor** `afterCompletion` használata
-   [**DispatcherServlet** uses the HandlerAdapter to actually invoke the method](https://www.baeldung.com/spring-mvc-handlerinterceptor)

```java
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class UserActivityHandlerInterceptor implements HandlerInterceptor {
    @Autowired @Lazy ChangedDataRepository changedDataRepository;
    @Autowired @Lazy UserActivityRepository userActivityRepository;
    @Autowired @Lazy ThreadLocal <UserActivity> userActivity;

    public void afterCompletion ( final HttpServletRequest request , final HttpServletResponse response , final Object handler , final Exception ex ) throws Exception {
        HandlerInterceptor.super.afterCompletion( request , response , handler , ex );
        if ( userActivity.get() != null ) {
            UserActivity activity = userActivity.get();
            activity = userActivityRepository.save( activity );
            if ( ! activity.isEmpty() ) {
                activity.getChanges().forEach( c -> changedDataRepository.save( c ) );
            }
        }
    }
}
```

### Domain megjejlőlés Annotation -el

Amelyik domain `TrackingUserActivity` -el van annotálva, azoknak a mező szintű változásai fognak mentésre kerülni a `@Autowired ThreadLocal<UserActivity>` userActivity -n keresztül.

```java
@java.lang.annotation.Documented
@java.lang.annotation.Target(value={java.lang.annotation.ElementType.TYPE})
@java.lang.annotation.Retention(value=java.lang.annotation.RetentionPolicy.RUNTIME)
public @interface TrackingUserActivity {}
```

```java
@TrackingUserActivity
@Entity ( name = "registereduser" )
public class User extends DomainEntity {
```

## Kell vmihez?

```java
spring.main.allow-bean-definition-overriding=true

management.endpoints.web.exposure.include=*
management.endpoint.shutdown.enabled=true
management.health.db.enabled=true
management.health.defaults.enabled=true
management.health.diskspace.enabled=true

spring.jackson.serialization.write_dates_as_timestamps=false
```

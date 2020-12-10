# SandFox Generator

## Running

Installing:
```
git clone https://github.com/godzzo/sandfox-gen-jpa.git
cd sandfox-gen-jpa

# Install dependent packages
npm i

# Compile
tsc
```

Configure Your GDrive access on ./credentials/gd-drive-access.json:
```
{
  "type": "service_account",
  "project_id": "gd-drive-access",
  "private_key_id": "a9...2a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nM...w=\n-----END PRIVATE KEY-----\n",
  "client_email": "gd-drive-access-reader@gd-drive-access.iam.gserviceaccount.com",
  "client_id": "1...6",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/gd-drive-access-reader%40gd-drive-access.iam.gserviceaccount.com"
}
```

Save the Google Spreadsheet to JSON (**save** action):
```
node dist/index.js save     -s 1yUZ2cHkYdEC3twB6bNimEORO7ZJohJ3PgX4D74KC_lY -d ./out/simple -q ../sandfox-in/simple -k -p simple -k org.godzzo.simple
```

Generate to the FULL project to the ./out/simple folder (**generate** action):
```
node dist/index.js generate -s 1yUZ2cHkYdEC3twB6bNimEORO7ZJohJ3PgX4D74KC_lY -d ./out/simple -q ../sandfox-in/simple -k -p simple -k org.godzzo.simple
```

✋**Copy the project!** (./out/simple) to an another directory (for example: ../sandfox-in/simple), and you NOW can run it (do not forget to setup your database on src/main/resources/application.properties)
```
./gradlew bootRun
```
After working / editing the project and make some configuration changes (like more column config...), you can override your project (need to **save** and **generate** and after that run the **custom** action)

The **custom** step only override your existing project (**respecting** Your /*FOXB-???*/ ...Your Code.. /*FOXE-???*/) blocks.

```
node dist/index.js custom   -s 1yUZ2cHkYdEC3twB6bNimEORO7ZJohJ3PgX4D74KC_lY -d ./out/simple -q ../sandfox-in/simple -k -p simple -k org.godzzo.simple
```

## Output - Generated class files
Application level:
- Application (for running application)
- RepositoryRestCustomization 
  - add projections 
  - exposeIds
  - add validators (BeanValidation, GroupValidators)
- SpelAwareProxyProjectionFactory (using expression in Projections)
- AppController (with minimal Upload handling)

Group level (set of columns, for sharing between tables - like SystemGroup (id, creator, created...))
- Group interface
- GroupValidator (handling all tables who has this Group)

Every table has the afollowing classes:
- Entity
- Projection (+BaseProjection - without relations)
- JpaRepository
- FilterController 
  - MVC RepositoryRestController - URL f.e.: /api/users/filterUsers
  - with dynamic filtering using Criteria API)
  - name convention to handle filters on properties of entity (_equal, _like...)
  - isAnd=true to joining filter expression with AND
- EntityListener
- RepositoryEventHandler
- TestFilterController - with MockMvc
- TestRepository - with PageRequest and Specification

## Table and Column configuration with GoogleSpreadsheet
*You can skip this step if You create somewhere else the config JSON.*

- Using Google Spreadsheet [like this **ONE**👀](https://docs.google.com/spreadsheets/d/1yUZ2cHkYdEC3twB6bNimEORO7ZJohJ3PgX4D74KC_lY/edit#gid=0)
- 2 types of sheet (first - tables, second - columns)
- important is the ID of GSheet - like this one 1yUZ2cHkYdEC3twB6bNimEORO7ZJohJ3PgX4D74KC_lY

## Customization - Setup Ignore RegExp masks
SandFox creating a minimal config for ignores, like:
```
{
    "ignore": {
        "copyAsCustom": true,
        "masks": [
            ".*application.properties$",
            ".*build.gradle.kts$",
            "^AppController.kt$"
        ]
    }
}
```

This means, only once will generate the application.properties, build.gradle.kts and the AppController.kt.

You can setup more ignore masks and the **"copyAsCustom": true** setting means to copy the ignored files with .custom extension, so You can examine what changed, for example AppController.kt.custom (*the .custom in .gitignore already*).

## Template folder
SandFox can use multiple template folders, now using only [this one👀](https://github.com/godzzo/sandfox-gen-jpa/tree/master/templates/project).

Some templates ([using EJS](https://ejs.co/)):
- [src/main/kotlin/demo/domain/**Entity.kt.ejs**](https://github.com/godzzo/sandfox-gen-jpa/blob/master/templates/project/src/main/kotlin/demo/domain/Entity.kt.ejs)
- [src/main/kotlin/demo/controller/**FilterController.kt.ejs**](https://github.com/godzzo/sandfox-gen-jpa/blob/master/templates/project/src/main/kotlin/demo/controller/FilterController.kt.ejs)

*A bit messy without syntax coloring, I like to find a nice ONE, or changing extension* 🧐

## Customization - Custom blocks FOXB...FOXE
The template engine handle the **FOXB...FOXE** comment tags, so it can easily extendable in any template which the SandFox using, like this:

Setup column values of the SystemGroup (all Entities have SystemGroup this example):
```
@Component
class SystemGroupCreate(
/*FOXB-CARG-CREATE*/
    @Autowired val session: HttpSession,
    @Autowired val users: LpUserRepository
/*FOXE-CARG-CREATE*/
): Validator {
    init {
        println("SystemGroupCreate - INIT")
    }

    override fun supports(clazz: Class<*>): Boolean {
        val support =  SystemGroup::class.java.isAssignableFrom(clazz)

        println("SystemGroupCreate - Supports - ${support} - ${clazz}")

        return support
    }

    override fun validate(target: Any, errors: Errors) {
        val entity = target as SystemGroup

/*FOXB-CREATE*/
        println("SystemGroupCreate - Supports - Session: ${session}")
        val userId: String = session.getAttribute("user_id") as String

        println("SystemGroupCreate - Supports - UserId: ${userId}")

        val user = users.findById(userId.toLong())

        entity.user = user.get()
        entity.lastModifier = user.get()

        entity.created = ZonedDateTime.now()
        entity.lastModified = ZonedDateTime.now()
        entity.logicRemove = 0
/*FOXE-CREATE*/
    }
}
```

## Hints

SandFox use hints to add optional features.

### Generating auditing with Hibernate Envers - "envers"

Adding Hibernate and Spring Data Envers (Entity Versioning / Record Audit / Revisions).

- build.gradle.kts
- Application.kt
- Modify: **{Entity}**.kt
- Modify: **{Entity}** Repository.kt
- Modify: **{Entity}** FilterController.kt

### Authentication and Authorization - "auth"

Using Basic Authentication and creating privileges (**C**reate-**R**ead-**U**pdate-**D**elete +**F**ilter) for generated JpaRepositories.

In AuthUserDetails handling to assign privileges to the User by the roles of the User. For example: 
```
ADMIN:CRUDF
EDITOR:RUF
GUEST:F
```

Generating :
- Create: SecurityConfiguration.kt
- Create: UserDetailsServiceImpl.kt
- Create: AuthUserDetails.kt

## Json Config

Sample config:
```
{
	"sheetId": "1vI...mKY",
	"directory": "./out/{project-name}",
	"customDir": "../WORK/{project-name}",
	"project": "{project-name}",
	"package": "org.godzzo.sakila",
	"credential": "credentials/gd-drive-access.json",
	"hint": "auth,envers",
	"showLogo": "yes",
	"showArgs": "yes"
}
```

Project generating and customizing sample bash script:
```
#!/bin/bash

SANDFOX="{sandfox-directory-location}";
CFG="{project-directory}/config/sandfox-config.json";

cd $SANDFOX;

# tsc;

node dist/index.js --config $CFG save;

sleep 1;
node dist/index.js --config $CFG generate;

sleep 1;
node dist/index.js --config $CFG custom;

cd -;
```

## Test with Jest

- [Tutorial](https://medium.com/@RupaniChirag/writing-unit-tests-in-typescript-d4719b8a0a40)
- [GitHub](https://github.com/ChiragRupani/TSUnitTestsSetup/tree/master/HelloJest)

### Debugging

- launch.json contains configuration
- set breakpoint
- run : open package.json file, hover on scripts "debug" will pop in

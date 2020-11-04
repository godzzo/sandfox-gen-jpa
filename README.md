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
After working / editing the project and make some configuration changes (like more column config...), you can override your project (need to save and generate and after that run the custom action)

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

- Using Google Spreadsheet [like this](https://docs.google.com/spreadsheets/d/1yUZ2cHkYdEC3twB6bNimEORO7ZJohJ3PgX4D74KC_lY/edit#gid=0)
- 2 types of sheet (first - tables, second - columns)
- important is the ID of GSheet - like this one 1yUZ2cHkYdEC3twB6bNimEORO7ZJohJ3PgX4D74KC_lY

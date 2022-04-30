# Hint: `postgis` - Hibernate Spatial with GeoLatte and PostGIS

## Configuration

### google-spreadsheet

| table | name         | type     | ktType     | definition           |
| ----- | ------------ | -------- | ---------- | -------------------- |
| user  | geo_position | geometry | Point<G2D> | geometry(Point,4326) |

### sandfox.json

```json
{
	...
	"hint": "postgis",
}
```

## Generated files

### Modifies

#### application.properties

-   PostgisDialect
-   JDBC: postgresql.Driver

#### build.gradle.kts

**Dependencies** :

-   hibernate-spatial
-   postgresql
-   geojson

#### Domain files

> **Files:** Entity, Map, Group, Projection

### New

#### JsonBuilderConfig.kt

> For geometry JSON serialization on Rest API results.

## Result

### Rest API : `http://localhost:6004/api/users`

```json
{
	"_embedded": {
		"users": [
			{
				"geoPosition": {
					"type": "Point",
					"crs": {
						"type": "name",
						"properties": {
							"name": "EPSG:4326"
						}
					},
					"coordinates": [47.666304, 19.063834]
				}
			}
		]
	}
}
```

### Enitity.kt

```kotlin
class User {
	@Column(name="geo_position", columnDefinition="geometry(Point,4326)", nullable=true)
	var geoPosition: Point<G2D>? = null
}
```

# TypeScript Regenerate

-   Template + Hook Style - Ugly Comment Hooks - Do not touch this!!!
-   AST - locate own blocks and insert and modify your own stuff without messing with the customization code
    -   Thas is easier in Markup DOM (like HTML templates)

```plantuml
	a --> b
```

## Template Regen

-   NEW: Component type templates (with reference of Config Model)
    -   EJS Templates?
-   MODIFY: DOM Insertion
    -   generated template and customized template diff
        -   could use data-sf-id tags...
        -   could use the last diff - what changed - last time when apply config changes
    -   locate needed node (possible locators XPath, byId, CSS...)
-   call Prettier formatter

## BaseComponents

FormComponent - DataEntry

-   FormGroup - **SF config**
    -   FormControls
    -   Validation
-   Functions
    -   CRUD - New,Modify,Delete
    -   Publicate, EditLayout...
-   Main
    -   Routed,
    -   _Called for New in Dialog_ - Maybe routed too
        -   Depend on CallerSate
-   Sub
    -   _maybe_ in Dialog, in SubTable, or routed...

TableComponent - DataEntry

-   UITableComponent - **SF config**
    -   columns (Orderable, Display)
    -   pagination
-   RowButtons
-   FilterForm
-   NavButtons
    -   PublicateAll...

### FormComponent

```plantuml
	package FormComponent {
		component Navigation #afc [
			Navigation
			//<Prev | Next>//
		]
		component Buttons #afc [
			Buttons
			//Save//
		]
		component FormHandler [
			FormHandler
			//use DataHandler//
		]

		Buttons --> FormHandler
		Navigation --> FormHandler

		package "FormGroup\n//<&cog>SF fields//" as FormGroup #afc {
			component Validation
			component FormControls #adf [
				FormControls
			]
			Validation --> FormControls
		}

		package "Other" #eee {
			component breadcrumb #afc
			component routing [
				routing
				**ngrx**
			]

			routing -->breadcrumb
		}
	}
```

## TableComponent

-   Optional: FilterComponent
-   Editable Table

```plantuml
	package TableComponent {
		component Pagination #afc [
			Pagination
			//Size,Prev,Next//
		]
		component Filters #afc [
			Filters
			//- FormControls//
			//- Column//
		]
		component RowButtons #afc [
			**RowButtons**
			//- Modify//
			//- Delete//
			//- Publicate...//
		]
		component Columns #afc [
			**Columns**
			//<&cog>SF fields//
			//- SortOrder//
		]
		Columns --> RowButtons
		Columns --> Filters
		component TableHandler [
			**TableHandler**
			//use DataHandler//
		]
		component NavButtons #afc [
			**NavButtons**
			//- Refresh//
			//- Publicate//
		]
	}
```

## Variations of SubRecords

-   Editable :: SubTable
-   Dialog (SubForm) :: SubTable
-   SubForm - List handling (+ New / Delete)
-   SubTable Linked - Navigate TO SubForm

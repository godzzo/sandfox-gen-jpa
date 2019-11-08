import { ReadJsonFile, Log } from "../lib/common";

const types: any = {};
types.smallint = ['number', 'Short'];
types.varchar = ['string', 'String'];
types.timestamp = ['Date', 'ZonedDateTime'];
types.tinyint = ['number', 'Short'];
types.datetime = ['Date', 'ZonedDateTime'];
types.text = ['string', 'String'];
types.year = ['number', 'Short'];
types.decimal = ['number', 'Double'];
types.enum = ['string', 'String'];
types.set = ['string', 'String'];
types.mediumint = ['number', 'Int'];
types.char = ['string', 'Char'];
types.int = ['number', 'Int'];
types.blob = ['string', 'String'];

/*
node dist/index.js \
save \
-p sakila \
-d ./out/sakila \
-k org.mysql.sakila \
-s 1Zt3ff5GsxVW9VVsRwdWoG66TawIQ0fWCxU4VCoq-ROA

node dist/index.js \
generate \
-p sakila \
-d ./out/sakila \
-k org.mysql.sakila 

*/

(async () => {
    // await PrintColTypes();
    // await PrintColRows();
    await PrintTables();
})();

async function PrintColTypes() {
    const types: any = {};
    const cols = await ReadJsonFile('./config/sakila/columns_w_keys.json');
    
    cols.forEach((col:any) => {
        types[col.data_type] = col.data_type;
    });

    Object.keys(types).forEach((key: string) => Log(key) );
}

async function PrintTables() {
    const tables = await ReadJsonFile('./config/sakila/tables.json');
    
    tables.forEach((el:any) => Log(el.table_name));
}

async function PrintColRows() {
    const cols = await ReadJsonFile('./config/sakila/columns_w_keys.json');
    const tables = await ReadJsonFile('./config/sakila/tables.json');
    
    tables.forEach((tbl: any) => {
        
        Log(`${tbl.table_name}`);

        Log(`name	caption	type	ktType	columnType	length	edit	needed	resultType`);

        cols
            .filter((col: any) => col.table_name == tbl.table_name )
            .forEach((col:any) => {
                const row: any = {};
                row.name = col.column_name;
                row.caption = col.column_name;
                row.type = types[col.data_type][0];
                row.ktType = types[col.data_type][1];
                row.columnType = col.data_type;
                row.length = col.character_maximum_length;
                row.edit = 'text';
                row.needed = col.is_nullable == 'YES'? 'no': 'yes';
                row.resultType = 'text';

                if (col.referenced_table_name != null) {
                    row.type = `relation.one.${col.referenced_table_name}`;
                } else {
                    // const relation = cols.find((el: any) => el.referenced_table_name);
                }

                if (col.column_key = "PRI") {
                    row.type = 'primary';
                }

                Log(`${row.name}	${row.caption}	${row.type}	${row.ktType}	${row.columnType}	${row.length}	${row.edit}	${row.needed}	${row.resultType}`);
            });

    });
}

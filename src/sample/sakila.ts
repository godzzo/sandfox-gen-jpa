#!/usr/bin/env node

import { ReadJsonFile, Log, Warn } from "../lib/common";
const CliArgs = require('command-line-args');


// https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md
const optDef = [
    { name: 'command', defaultOption: true, type: String, defaultValue: 'cols' },
];

const options = CliArgs(optDef);

//  node dist/sample/sakila.js > config/sakila/config.csv 

(async () => {
    if (options.command == "cols") {
        await PrintColRows();
    } else if (options.command == "tables") {
        await PrintTables();
    } else if (options.command == "types") {
        await PrintColTypes();
    }
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
    const types = GetTypes();
    
    Log(`table	name	caption	type	ktType	columnType	length	edit	needed	resultType`);

    tables.forEach((tbl: any) => {
        
        // Log(`${tbl.table_name}`);

        cols
            .filter((col: any) => col.table_name == tbl.table_name )
            .forEach((col:any) => {
                const row: any = {};
                row.table = col.table_name;
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

                if (col.column_key == "PRI") {
                    row.type = 'primary';
                }

                Log(`${row.table}	${row.name}	${row.caption}	${row.type}	${row.ktType}	${row.columnType}	${row.length}	${row.edit}	${row.needed}	${row.resultType}`);
            });

    });
}

function GetTypes() {
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
    
    return types;     
}

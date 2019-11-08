
-- Grab Columns
SELECT 
		c.TABLE_NAME, c.COLUMN_NAME, c.DATA_TYPE, 
		c.IS_NULLABLE, c.COLUMN_KEY, c.COLUMN_TYPE 
	FROM 
		information_schema.TABLES t
			JOIN information_schema.COLUMNS c 
				ON c.TABLE_NAME = t.TABLE_NAME AND c.TABLE_SCHEMA='sakila'  
	WHERE 
		t.TABLE_SCHEMA='sakila' AND t.TABLE_TYPE='BASE TABLE'
;

-- Grab Foreign Keys
SELECT 
		CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, 
		REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
	FROM 
		information_schema.KEY_COLUMN_USAGE 
	WHERE 
		TABLE_SCHEMA='sakila' AND 
		REFERENCED_TABLE_NAME IS NOT NULL
;

SELECT 
		c.table_name, c.column_name, c.data_type, c.is_nullable,
		c.character_maximum_length, c.numeric_scale, c.numeric_precision,
		c.column_key, c.column_type,
		k.referenced_table_name, k.referenced_column_name
	FROM 
		information_schema.columns c 
		JOIN
			information_schema.tables t
		ON
			c.TABLE_NAME = t.TABLE_NAME AND c.TABLE_SCHEMA = t.TABLE_SCHEMA
		LEFT OUTER JOIN
			information_schema.KEY_COLUMN_USAGE k
		ON
			c.COLUMN_NAME = k.COLUMN_NAME AND c.TABLE_NAME = k.TABLE_NAME
			AND k.CONSTRAINT_SCHEMA='sakila' AND k.CONSTRAINT_NAME!='PRIMARY'
	WHERE 
		t.table_schema='sakila' AND t.table_type = 'BASE TABLE' 
	ORDER BY
		c.TABLE_NAME, c.ORDINAL_POSITION
;

SELECT table_name FROM information_schema.tables WHERE table_schema='sakila' AND table_type='BASE TABLE';


MariaDB [(none)]> CREATE DATABASE sakila1 CHARACTER SET utf8;
MariaDB [(none)]> CREATE DATABASE sakila2 CHARACTER SET utf8;
MariaDB [(none)]> CREATE DATABASE sakila3 CHARACTER SET utf8;
MariaDB [(none)]> CREATE DATABASE sakila4 CHARACTER SET utf8;
MariaDB [(none)]> CREATE DATABASE sakila5 CHARACTER SET utf8;

godzzo@godtpyoga1:~/Test/MySQL/sakila-db$ cat sakila-schema.sql | mysql -uuser -pabc123 sakila1
godzzo@godtpyoga1:~/Test/MySQL/sakila-db$ cat sakila-schema.sql | mysql -uuser -pabc123 sakila2
godzzo@godtpyoga1:~/Test/MySQL/sakila-db$ cat sakila-schema.sql | mysql -uuser -pabc123 sakila3

godzzo@godtpyoga1:~/Test/MySQL/sakila-db$ cat sakila-data.sql | mysql -uuser -pabc123 sakila1
godzzo@godtpyoga1:~/Test/MySQL/sakila-db$ cat sakila-data.sql | mysql -uuser -pabc123 sakila2
godzzo@godtpyoga1:~/Test/MySQL/sakila-db$ cat sakila-data.sql | mysql -uuser -pabc123 sakila3

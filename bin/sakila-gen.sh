#!/bin/bash

node dist/index.js \
generate \
-p sakila \
-d ./out/sakila \
-k org.mysql.sakila 

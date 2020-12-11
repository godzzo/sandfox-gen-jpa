#!/bin/bash

cygwin=false
case "`uname`" in
	CYGWIN*) cygwin=true;;
esac

# SANDFOX="/home/tester/Projects/sandfox-gen-jpa";
CDIR=`pwd`;
CFG="$CDIR/config/sandfox-config.json";
CUSTDIR="$CDIR";

if [ -z "$SANDFOX" ]; then
	echo 'SANDFOX home not found (environment var needed)!';

	exit 1;
else
	echo "SandFox home: $SANDFOX";
fi

if $cygwin; then
	CFG=$(cygpath --windows "$CFG");
	CUSTDIR=$(cygpath --windows "$CDIR");

fi

echo "Config: $CFG";
echo "Custom dir: $CUSTDIR";

cd "$SANDFOX";

# tsc;

node dist/index.js --config "$CFG" save;

sleep 1;
node dist/index.js --config "$CFG" generate;

sleep 1;
node dist/index.js --customDir "$CUSTDIR" --config "$CFG" custom;

cd -;

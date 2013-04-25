#!/bin/sh

rm app/css/*.css
rm -r .sass-cache/
git checkout master
if [ $? -ne 0 ] ; then
	echo "You must commit before going to prod"
	exit 1
fi
rm -r app/*
cp -r build/app/* app/
cp build/package.json .
git add .
git commit
#!/bin/sh

git submodule update --init
mkdir app/css
sass app/sass/styles.scss:app/css/styles.css

#!/bin/bash

set -e # Exit if any command fails

rm -f animations-for-blocks.zip

zip -r animations-for-blocks.zip \
	index.php \
	animations-for-blocks.php \
	readme.txt \
	build/* \
	includes/* \
	src/*

unzip animations-for-blocks.zip -d animations-for-blocks
rm animations-for-blocks.zip
zip -r animations-for-blocks.zip animations-for-blocks
rm -rf ./animations-for-blocks

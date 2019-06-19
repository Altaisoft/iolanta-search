#!/bin/bash

echo "Virtual environment found at $VIRTUAL_ENV, copying libraries..."

rm -rf build/*

cp -rf "$VIRTUAL_ENV/lib/python3.7/site-packages/*" build/
cp -rf status_check/* build/

zip status_check/* build/build.zip

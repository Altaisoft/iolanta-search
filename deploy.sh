#!/bin/bash

set -e

# Collect dependencies and code
rm -rf build/*
pip install -r requirements.txt -t build/
cp -rf status_check/* build/

cd build

# Remove garbage
rm -rf `tree -if | grep __pycache__`
rm -rf *.dist-info

# Prepare archive, upload it to S3 and update function code
rm ../build.zip
zip -r9 ../build.zip .

aws s3 cp ../build.zip s3://homo-yetiensis/

aws lambda update-function-code --function-name status-check --region us-east-1 --s3-bucket homo-yetiensis --s3-key build.zip

#!/bin/sh

echo "Building production application"
nx run-many --target=build --projects=smarthomes-app,database,api --prod --extractLicenses --generatePackageJson
if [ $? -ne 0 ]; then
    echo "Build failed - aborting"
    exit 1
fi

echo "Running Tests"
nx run-many --target=test --projects=smarthomes-app,database,api --prod
if [ $? -ne 0 ]; then
    echo "Tests failed - aborting"
    exit 1
fi

if [ -z "${NX_SKIP_DEPLOY}" ]; then
    echo "Automatic frontend deployment not yet supported - build artifacts are located in ./dist/apps/smarthomes-app"
    export NODE_ENV=production
    cd ./dist/apps/api
    node -r dotenv/config main.js
    if [ $? -ne 0 ]; then
        echo "Failed to deploy to production"
        exit 1
    fi
fi

#!/bin/sh
start=$SECONDS
echo "Starting production build..."
nx run-many --target=build --projects=smarthomes-app,database,api --prod --extractLicenses --generatePackageJson --parallel
if [ $? -ne 0 ]; then
    echo "Build failed - aborting"
    exit 1
fi

echo "Running Tests"
nx run-many --target=test --projects=smarthomes-app,database,api
if [ $? -ne 0 ]; then
    echo "Tests failed - aborting"
    exit 1
fi

echo "Build finished in $(($SECONDS - $start))s"
echo "Build artifacts can be found in the dist folder"

#!/bin/bash

# echo "Rebuilding web"
# cd ../packages/web
# yarn build
# echo ""
# cd ../../examples
# echo ""
# echo "Rebuilding examples"

echo "Re-linking packages"
yarn remove @viiksetjs/web
rm -rf node_modules
yarn add file:../packages/web
cd node_modules/@viiksetjs/web/node_modules
rm -rf react react-dom styled-components
echo "Example can be rebuilt now."

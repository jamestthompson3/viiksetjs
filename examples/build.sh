yarn remove @viiksetjs/web && rm -rf node_modules
yarn add file:../packages/web
cd node_modules/@viiksetjs/web/node_modules
rm -rf react react-dom styled-components
cd ~/code/viiksetjs/examples
yarn build

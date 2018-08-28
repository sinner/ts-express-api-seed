ts-node ./node_modules/.bin/typeorm migration:run -t false
ts-node ./node_modules/.bin/typeorm migration:generate -n User
ts-node ./node_modules/.bin/typeorm migration:create -n DataFixture

https://www.npmjs.com/package/bcrypt
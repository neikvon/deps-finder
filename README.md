# deps-finder
Find all dependencies of a file

```js
// demo.js
import fs from 'fs'
import pm2 from 'pm2'

const Koa = require('koa')
const config = require('../../config.js')

const app = new Koa()

```

```js
// test.js
const fs = require('fs')
const depsFinder = require('deps-finder')

const code = fs.readFileSync('./demo.js', 'utf8')

const deps = new depsFinder(code)

deps.getDeps()
// [ '../../config.js', 'koa', 'pm2', 'fs' ]

deps.splitDeps()
// { local: [ '../../config.js' ], thirdparty: [ 'koa', 'pm2', 'fs' ] }


```
const fs = require('fs')
const depsFinder = require('../dst')

const code = fs.readFileSync('./demo.js', 'utf8')

const deps = new depsFinder(code)

console.log(code)
console.log(deps.getDeps())
console.log(deps.splitDeps())


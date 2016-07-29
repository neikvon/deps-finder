import acorn from 'acorn'
import { walk } from 'estree-walker'

export default class Parser {

  constructor(source, options) {
    this.dependencies = []
    this.localDependencies = []
    this.globalDependencies = []
    this.options = merge({ sourceType: 'module' }, options || {})

    this.ast = acorn.parse(source, this.options)
  }

  getDeps() {
    walk(this.ast, {
      enter: (node, parent) => {
        // import
        if (node.type === 'ImportDeclaration') {
          this.dependencies.push(node.source.value)
        }

        // require
        if (node.type === 'CallExpression' && node.callee.name === 'require') {
          this.dependencies.push(node.arguments[0].value)
        }
      }
    })

    return this.dependencies
  }

  splitDeps() {
    if (!this.dependencies.length) {
      this.getDependencies()
    }

    this.dependencies.map(item => {
      if (/^\.?\.\//.test(item)) { // local
        this.localDependencies.push(item)
      } else {
        this.globalDependencies.push(item)
      }
    })

    return {
      local: this.localDependencies,
      thirdparty: this.globalDependencies
    }
  }

}

function merge(target) {
  var sources = [].slice.call(arguments, 1)
  sources.forEach(function (source) {
    for (var p in source)
      if (typeof source[p] === 'object') {
        target[p] = target[p] || (Array.isArray(source[p]) ? [] : {})
        merge(target[p], source[p])
      } else {
        target[p] = source[p]
      }
  })
  return target
}
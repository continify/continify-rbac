const intersection = require('lodash.intersection')
const ContinifyPlugin = require('continify-plugin')

const { kRBACStore } = require('./symbols')

function MemoryStore () {
  this.cache = {}
}

MemoryStore.prototype.get = async function (id) {
  return this.cache[id]
}

MemoryStore.prototype.set = async function (id, permissions) {
  this.cache[id] = permissions
}

function RBACWrap (store) {
  this[kRBACStore] = store
}

Object.defineProperties(RBACWrap.prototype, {
  store: {
    get () {
      return this[kRBACStore]
    }
  }
})

RBACWrap.prototype.set = function (id, pers = []) {
  const iPers = Array.isArray(pers) ? pers : [pers]
  return this.store.set(id, iPers)
}

RBACWrap.prototype.has = async function (id, pers = []) {
  const iPers = Array.isArray(pers) ? pers : [pers]
  const sPers = (await this.store.get(id)) || []
  const inPers = intersection(iPers, sPers)
  return inPers.length > 0
}

module.exports = ContinifyPlugin(
  async function (ins, options) {
    const rbac = new RBACWrap(options.store)

    ins.decorate('$rbac', rbac)
  },
  {
    store: new MemoryStore()
  }
)

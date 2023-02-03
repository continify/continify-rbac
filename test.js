const Continify = require('continify')
const ContinifyHTTP = require('continify-http')
const ContinifyRBAC = require('.')

async function init () {
  const ins = Continify()
  ins.register(ContinifyHTTP)
  ins.register(ContinifyRBAC)

  await ins.ready()

  await ins.close()
}

init()

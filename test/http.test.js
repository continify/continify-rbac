const tap = require('tap')
const Continify = require('continify')
const ContinifyHTTP = require('continify-http')
const ContinifyRBAC = require('..')

tap.test('rbac', async t => {
  const ins = Continify()
  ins.register(ContinifyHTTP)
  ins.register(ContinifyRBAC)

  const id = '789798798'
  const permissions = ['a', 'b', 'c']

  ins.addHook('onRequest', async function (req, rep) {
    req.id = id
    req.$permissions = await this.$rbac.store.get(id)
  })

  ins.addHook('beforeHandler', async function (req, rep) {
    if (!req.$route.permissions) return

    const hasPer = await this.$rbac.has(req.id, req.$route.permissions)
    if (!hasPer) {
      const err = new Error('permission error')
      err.code = 401
      throw err
    }
  })

  await ins.ready()

  ins.route({
    url: '/rbac/pass',
    permissions: ['b'],
    handler (req, rep) {
      rep.send('pass')
    }
  })

  ins.route({
    url: '/rbac/fail',
    permissions: ['d'],
    handler (req, rep) {
      rep.send('fail')
    }
  })

  ins.route({
    url: '/rbac/none',
    handler (req, rep) {
      rep.send('none')
    }
  })

  t.plan(6)
  await ins.$rbac.set(id, permissions)

  const r1 = await ins.inject({
    url: '/rbac/pass'
  })
  t.equal(r1.statusCode, 200)
  t.equal(r1.payload, 'pass')

  const r2 = await ins.inject({
    url: '/rbac/fail'
  })
  t.equal(r2.statusCode, 401)
  t.equal(r2.payload, 'permission error')

  const r3 = await ins.inject({
    url: '/rbac/none'
  })
  t.equal(r3.statusCode, 200)
  t.equal(r3.payload, 'none')

  await ins.close()
})

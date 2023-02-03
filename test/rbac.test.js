const tap = require('tap')
const Continify = require('continify')
const ContinifyRBAC = require('..')

tap.test('rbac', async t => {
  const ins = Continify()
  ins.register(ContinifyRBAC)

  t.plan(1)
  await ins.ready()
  t.ok(ins.hasDecorator('$rbac'))
  await ins.close()
})

tap.test('rbac: check', async t => {
  const ins = Continify()
  ins.register(ContinifyRBAC)

  const id = '77777'
  const pers = ['a', 'b', 'c']

  t.plan(5)
  await ins.ready()
  await ins.$rbac.set(id, pers)
  await ins.$rbac.set('str0')
  await ins.$rbac.set('str', 'pers')
  t.equal(await ins.$rbac.has(id, 'a'), true)
  t.equal(await ins.$rbac.has(id, ['d']), false)
  t.equal(await ins.$rbac.has('id', ['b']), false)
  t.equal(await ins.$rbac.has(id), false)
  t.equal(await ins.$rbac.has('str', 'pers'), true)
  await ins.close()
})

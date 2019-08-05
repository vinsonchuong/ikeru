/* @flow */
import test from 'ava'
import greeting from 'ikeru'

test('exporting "Hello World!"', t => {
  t.is(greeting, 'Hello World!')
})

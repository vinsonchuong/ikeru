/* @flow */
import test from 'ava'
import { BinarySearchTree } from 'ikeru'

test('getting and setting values', t => {
  const tree = new BinarySearchTree<{ title: string }>()
  t.is(tree.get(42), null)
  t.deepEqual([...tree], [])

  tree.set(5, { title: 'Five' })
  t.deepEqual(tree.get(5), { title: 'Five' })
  t.deepEqual([...tree], [[5, { title: 'Five' }]])

  tree.set(3, { title: 'Three' })
  t.deepEqual(tree.get(3), { title: 'Three' })
  t.deepEqual([...tree], [[3, { title: 'Three' }], [5, { title: 'Five' }]])

  tree.set(7, { title: 'Seven' })
  t.deepEqual(tree.get(7), { title: 'Seven' })
  t.deepEqual(
    [...tree],
    [[3, { title: 'Three' }], [5, { title: 'Five' }], [7, { title: 'Seven' }]]
  )

  tree.set(1, { title: 'One' })
  t.deepEqual(tree.get(1), { title: 'One' })
  t.deepEqual(
    [...tree],
    [
      [1, { title: 'One' }],
      [3, { title: 'Three' }],
      [5, { title: 'Five' }],
      [7, { title: 'Seven' }]
    ]
  )

  tree.set(9, { title: 'Nine' })
  t.deepEqual(tree.get(9), { title: 'Nine' })
  t.deepEqual(
    [...tree],
    [
      [1, { title: 'One' }],
      [3, { title: 'Three' }],
      [5, { title: 'Five' }],
      [7, { title: 'Seven' }],
      [9, { title: 'Nine' }]
    ]
  )

  t.deepEqual(JSON.parse(JSON.stringify(tree)), {
    key: 5,
    value: { title: 'Five' },
    left: {
      key: 3,
      value: { title: 'Three' },
      left: {
        key: 1,
        value: { title: 'One' },
        left: null,
        right: null
      },
      right: null
    },
    right: {
      key: 7,
      value: { title: 'Seven' },
      left: null,
      right: {
        key: 9,
        value: { title: 'Nine' },
        left: null,
        right: null
      }
    }
  })

  tree.delete(5)
  t.deepEqual(tree.get(5), null)
  t.deepEqual(
    [...tree],
    [
      [1, { title: 'One' }],
      [3, { title: 'Three' }],
      [7, { title: 'Seven' }],
      [9, { title: 'Nine' }]
    ]
  )
  t.deepEqual(JSON.parse(JSON.stringify(tree)), {
    key: 7,
    value: { title: 'Seven' },
    left: {
      key: 3,
      value: { title: 'Three' },
      left: {
        key: 1,
        value: { title: 'One' },
        left: null,
        right: null
      },
      right: null
    },
    right: {
      key: 9,
      value: { title: 'Nine' },
      left: null,
      right: null
    }
  })

  tree.delete(9)
  t.deepEqual(tree.get(9), null)
  t.deepEqual(
    [...tree],
    [[1, { title: 'One' }], [3, { title: 'Three' }], [7, { title: 'Seven' }]]
  )
  t.deepEqual(JSON.parse(JSON.stringify(tree)), {
    key: 7,
    value: { title: 'Seven' },
    left: {
      key: 3,
      value: { title: 'Three' },
      left: {
        key: 1,
        value: { title: 'One' },
        left: null,
        right: null
      },
      right: null
    },
    right: null
  })

  tree.delete(3)
  t.deepEqual(tree.get(3), null)
  t.deepEqual([...tree], [[1, { title: 'One' }], [7, { title: 'Seven' }]])
  t.deepEqual(JSON.parse(JSON.stringify(tree)), {
    key: 7,
    value: { title: 'Seven' },
    left: {
      key: 1,
      value: { title: 'One' },
      left: null,
      right: null
    },
    right: null
  })

  tree.delete(1)
  t.deepEqual(tree.get(1), null)
  t.deepEqual([...tree], [[7, { title: 'Seven' }]])
  t.deepEqual(JSON.parse(JSON.stringify(tree)), {
    key: 7,
    value: { title: 'Seven' },
    left: null,
    right: null
  })

  tree.delete(7)
  t.deepEqual(tree.get(7), null)
  t.deepEqual([...tree], [])
  t.deepEqual(JSON.parse(JSON.stringify(tree)), null)
})

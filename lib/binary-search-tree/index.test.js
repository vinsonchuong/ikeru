/* @flow */
import test from 'ava'
import { BinarySearchTree } from 'ikeru'

test('getting and setting values', t => {
  let tree: ?BinarySearchTree<{ title: string }>

  tree = new BinarySearchTree<{ title: string }>(5, { title: 'Five' })
  t.is(tree.key, 5)
  t.deepEqual(tree.value, { title: 'Five' })
  t.is(tree.get(5), tree)
  t.is(tree.get(42), null)
  t.deepEqual([...tree], [tree])
  t.deepEqual([...tree].map(tree => tree.key), [5])

  tree = tree.set(3, { title: 'Three' })
  t.is(tree.left?.key, 3)
  t.deepEqual(tree.left?.value, { title: 'Three' })
  t.is(tree.get(3), tree.left)
  t.deepEqual([...tree], [tree.left, tree])
  t.deepEqual([...tree].map(tree => tree.key), [3, 5])

  tree = tree.set(7, { title: 'Seven' })
  t.is(tree.right?.key, 7)
  t.deepEqual(tree.right?.value, { title: 'Seven' })
  t.is(tree.get(7), tree.right)
  t.deepEqual([...tree], [tree.left, tree, tree.right])
  t.deepEqual([...tree].map(tree => tree.key), [3, 5, 7])

  tree = tree.set(1, { title: 'One' })
  t.is(tree.left?.left?.key, 1)
  t.deepEqual(tree.left?.left?.value, { title: 'One' })
  t.is(tree.get(1), tree.left?.left)
  t.deepEqual([...tree], [tree.left?.left, tree.left, tree, tree.right])
  t.deepEqual([...tree].map(tree => tree.key), [1, 3, 5, 7])

  tree = tree.set(9, { title: 'Nine' })
  t.is(tree.right?.right?.key, 9)
  t.deepEqual(tree.right?.right?.value, { title: 'Nine' })
  t.is(tree.get(9), tree.right?.right)
  t.deepEqual(
    [...tree],
    [tree.left?.left, tree.left, tree, tree.right, tree.right?.right]
  )
  t.deepEqual([...tree].map(tree => tree.key), [1, 3, 5, 7, 9])

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

  tree = tree.delete(5)
  if (!tree) throw new Error()
  t.is(tree.get(5), null)
  t.deepEqual([...tree], [tree.left?.left, tree.left, tree, tree.right])
  t.deepEqual([...tree].map(tree => tree.key), [1, 3, 7, 9])

  tree = tree.delete(9)
  if (!tree) throw new Error()
  t.is(tree.get(9), null)
  t.deepEqual([...tree], [tree.left?.left, tree.left, tree])
  t.deepEqual([...tree].map(tree => tree.key), [1, 3, 7])

  tree = tree.delete(3)
  if (!tree) throw new Error()
  t.is(tree.get(3), null)
  t.deepEqual([...tree], [tree.left, tree])
  t.deepEqual([...tree].map(tree => tree.key), [1, 7])

  tree = tree.delete(1)
  if (!tree) throw new Error()
  t.is(tree.get(1), null)
  t.deepEqual([...tree], [tree])
  t.deepEqual([...tree].map(tree => tree.key), [7])

  tree = tree.delete(7)
  t.is(tree, null)
})

test('re-constructing from serialized object', t => {
  const data = {
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
  }

  const tree = BinarySearchTree.fromObject(data)
  t.deepEqual(
    [...tree],
    [tree.left?.left, tree.left, tree, tree.right, tree.right?.right]
  )
  t.deepEqual([...tree].map(tree => tree.key), [1, 3, 5, 7, 9])
})

/* @flow */
import test from 'ava'
import type { BinarySearchTree } from 'ikeru/binary-search-tree'
import {
  get,
  set,
  remove,
  entries,
  traces,
  rotateLeft,
  rotateRight
} from 'ikeru/binary-search-tree'

test('getting and setting values', t => {
  let tree: ?BinarySearchTree<{ title: string }>

  tree = set(tree, 5, { title: 'Five' })
  t.is(tree.key, 5)
  t.is(tree.title, 'Five')
  t.is(get(tree, 5), tree)
  t.is(get(tree, 42), null)
  t.deepEqual([...entries(tree)], [tree])

  tree = set(tree, 5, { title: 'FIVE' })
  t.is(tree.title, 'FIVE')

  tree = set(tree, 3, { title: 'Three' })
  t.is(tree.key, 5)
  t.is(tree.left?.key, 3)
  t.is(tree.left?.title, 'Three')
  t.is(get(tree, 3), tree.left)
  t.deepEqual([...entries(tree)], [tree.left, tree])

  tree = set(tree, 7, { title: 'Seven' })
  t.is(tree.right?.key, 7)
  t.is(tree.right?.title, 'Seven')
  t.is(get(tree, 7), tree.right)
  t.deepEqual([...entries(tree)], [tree.left, tree, tree.right])
  t.deepEqual([...entries(tree)].map(tree => tree.key), [3, 5, 7])

  tree = set(tree, 1, { title: 'One' })
  t.is(tree.left?.left?.key, 1)
  t.is(tree.left?.left?.title, 'One')
  t.is(get(tree, 1), tree.left?.left)
  t.deepEqual(
    [...entries(tree)],
    [tree.left?.left, tree.left, tree, tree.right]
  )
  t.deepEqual([...entries(tree)].map(tree => tree.key), [1, 3, 5, 7])

  tree = set(tree, 9, { title: 'Nine' })
  t.is(tree.right?.right?.key, 9)
  t.is(tree.right?.right?.title, 'Nine')
  t.is(get(tree, 9), tree.right?.right)
  t.deepEqual(
    [...entries(tree)],
    [tree.left?.left, tree.left, tree, tree.right, tree.right?.right]
  )
  t.deepEqual([...entries(tree)].map(tree => tree.key), [1, 3, 5, 7, 9])

  t.deepEqual(JSON.parse(JSON.stringify(tree)), {
    key: 5,
    title: 'FIVE',
    left: {
      key: 3,
      title: 'Three',
      left: {
        key: 1,
        title: 'One',
        left: null,
        right: null
      },
      right: null
    },
    right: {
      key: 7,
      title: 'Seven',
      left: null,
      right: {
        key: 9,
        title: 'Nine',
        left: null,
        right: null
      }
    }
  })

  tree = remove(tree, 5)
  if (!tree) return t.fail()
  t.is(get(tree, 5), null)
  t.deepEqual(
    [...entries(tree)],
    [tree.left?.left, tree.left, tree, tree.right]
  )
  t.deepEqual([...entries(tree)].map(tree => tree.key), [1, 3, 7, 9])

  tree = remove(tree, 9)
  if (!tree) return t.fail()
  t.is(get(tree, 9), null)
  t.deepEqual([...entries(tree)], [tree.left?.left, tree.left, tree])
  t.deepEqual([...entries(tree)].map(tree => tree.key), [1, 3, 7])

  tree = remove(tree, 3)
  if (!tree) return t.fail()
  t.is(get(tree, 3), null)
  t.deepEqual([...entries(tree)], [tree.left, tree])
  t.deepEqual([...entries(tree)].map(tree => tree.key), [1, 7])

  tree = remove(tree, 1)
  t.is(get(tree, 1), null)
  t.deepEqual([...entries(tree)], [tree])
  t.deepEqual([...entries(tree)].map(tree => tree.key), [7])

  tree = remove(tree, 7)
  t.is(tree, null)
})

test('rotating left', t => {
  const tree = {
    key: 3,
    value: 'P',
    left: { key: 1, value: 'A', left: null, right: null },
    right: {
      key: 5,
      value: 'Q',
      left: { key: 4, value: 'B', left: null, right: null },
      right: { key: 6, value: 'C', left: null, right: null }
    }
  }

  t.deepEqual(rotateLeft(tree), {
    key: 5,
    value: 'Q',
    left: {
      key: 3,
      value: 'P',
      left: { key: 1, value: 'A', left: null, right: null },
      right: { key: 4, value: 'B', left: null, right: null }
    },
    right: { key: 6, value: 'C', left: null, right: null }
  })
})

test('rotating right', t => {
  const tree = {
    key: 5,
    value: 'Q',
    left: {
      key: 3,
      value: 'P',
      left: { key: 1, value: 'A', left: null, right: null },
      right: { key: 4, value: 'B', left: null, right: null }
    },
    right: { key: 6, value: 'C', left: null, right: null }
  }

  t.deepEqual(rotateRight(tree), {
    key: 3,
    value: 'P',
    left: { key: 1, value: 'A', left: null, right: null },
    right: {
      key: 5,
      value: 'Q',
      left: { key: 4, value: 'B', left: null, right: null },
      right: { key: 6, value: 'C', left: null, right: null }
    }
  })
})

test('tracing paths through the tree', t => {
  let tree
  tree = set(tree, 5, { title: 'Five' })
  tree = set(tree, 3, { title: 'Three' })
  tree = set(tree, 7, { title: 'Seven' })
  tree = set(tree, 2, { title: 'Two' })
  tree = set(tree, 4, { title: 'Four' })
  tree = set(tree, 6, { title: 'Six' })
  tree = set(tree, 8, { title: 'Eight' })

  t.deepEqual(
    [...traces(tree)],
    [
      [tree, tree.left, tree.left?.left],
      [tree, tree.left, tree.left?.right],
      [tree, tree.right, tree.right?.left],
      [tree, tree.right, tree.right?.right]
    ]
  )
})

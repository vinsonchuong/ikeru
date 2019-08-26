/* @flow */
import test from 'ava'
import { get, set, remove, entries, traces } from 'ikeru/red-black-tree'
import { countBy, size, range, times, random, shuffle } from 'lodash'

test('creating the first node', t => {
  // B
  const tree = set(null, 5, { title: 'five' })
  t.deepEqual([...entries(tree)], [tree])
  t.is(get(tree, 5), tree)
  t.is(tree.key, 5)
  t.true(tree.color === 'black')
})

test('changing the value of an existing node', t => {
  // B
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 5, { title: 'FIVE' })

  t.deepEqual([...entries(tree)], [tree])
  t.is(tree.key, 5)
  t.is(tree.title, 'FIVE')
  t.true(tree.color === 'black')
})

test('adding a second node to the left', t => {
  //   B
  //  /
  // R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 3, { title: 'three' })

  t.deepEqual([...entries(tree)], [tree.left, tree])
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'red')
})

test('adding a second node to the right', t => {
  // B
  //  \
  //   R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 7, { title: 'seven' })

  t.deepEqual([...entries(tree)], [tree, tree.right])
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'red')
})

test('adding a third node at depth 2 (left then right)', t => {
  // If a black node has two red children, all three can be recolored
  // The root can always be recolored black
  //   B          R          B
  //  / \   =>   / \   =>   / \
  // R   R      B   B      B   B
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 7, { title: 'seven' })

  t.deepEqual([...entries(tree)], [tree.left, tree, tree.right])
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
})

test('adding a third node at depth 2 (right then left)', t => {
  // If a black node has two red children, all three can be recolored
  // The root can always be recolored black
  //   B          R          B
  //  / \   =>   / \   =>   / \
  // R   R      B   B      B   B
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 3, { title: 'three' })

  t.deepEqual([...entries(tree)], [tree.left, tree, tree.right])
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
})

test('adding a third node at depth 3 (left then left, left)', t => {
  // Can't have two consecutive red nodes
  // If a black node has two red children, all three can be recolored
  // Root can always be recolored black
  //     B        B          R          B
  //    /        / \        / \        / \
  //   R    =>  R   R  =>  B   B  =>  B   B
  //  /
  // R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 1, { title: 'one' })

  t.deepEqual([...entries(tree)], [tree.left, tree, tree.right])
  t.is(tree.key, 3)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 1)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 5)
  t.is(tree.right?.color, 'black')
})

test('adding a third node at depth 3 (left then left, right)', t => {
  // Can't have two consecutive red nodes
  // If a black node has two red children, all three can be recolored
  // Root can always be recolored black
  //   B         B       B          R          B
  //  /         /       / \        / \        / \
  // R    =>   R    => R   R  =>  B   B  =>  B   B
  //  \       /
  //   R     R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 4, { title: 'four' })

  t.deepEqual([...entries(tree)], [tree.left, tree, tree.right])
  t.is(tree.key, 4)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 5)
  t.is(tree.right?.color, 'black')
})

test('adding a third node at depth 3 (right then right, left)', t => {
  // Can't have two consecutive red nodes
  // If a black node has two red children, all three can be recolored
  // Root can always be recolored black
  // B        B            B          R          B
  //  \        \          / \        / \        / \
  //   R  =>    R    =>  R   R  =>  B   B  =>  B   B
  //  /          \
  // R            R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 6, { title: 'six' })

  t.deepEqual([...entries(tree)], [tree.left, tree, tree.right])
  t.is(tree.key, 6)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 5)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
})

test('adding a third node at depth 3 (right then right, right)', t => {
  // Can't have two consecutive red nodes
  // If a black node has two red children, all three can be recolored
  // Root can always be recolored black
  // B            B          R          B
  //  \          / \        / \        / \
  //   R    =>  R   R  =>  B   B  =>  B   B
  //    \
  //     R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 9, { title: 'nine' })

  t.deepEqual([...entries(tree)], [tree.left, tree, tree.right])
  t.is(tree.key, 7)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 5)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 9)
  t.is(tree.right?.color, 'black')
})

test('adding a fourth node (left, left)', t => {
  //     B
  //    / \
  //   B   B
  //  /
  // R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 1, { title: 'one' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
  t.is(tree.left?.left?.key, 1)
  t.is(tree.left?.left?.color, 'red')
})

test('adding a fourth node (left, right)', t => {
  //   B
  //  / \
  // B   B
  //  \
  //   R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 4, { title: 'four' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
  t.is(tree.left?.right?.key, 4)
  t.is(tree.left?.right?.color, 'red')
})

test('adding a fourth node (right, left)', t => {
  //   B
  //  / \
  // B   B
  //    /
  //   R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 6, { title: 'six' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
  t.is(tree.right?.left?.key, 6)
  t.is(tree.right?.left?.color, 'red')
})

test('adding a fourth node (right, right)', t => {
  //   B
  //  / \
  // B   B
  //      \
  //       R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 8, { title: 'eight' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
  t.is(tree.right?.right?.key, 8)
  t.is(tree.right?.right?.color, 'red')
})

test('adding a fifth node (left, left then left, right)', t => {
  // If a black node has two red children, all three can be recolored
  //     B            B
  //    / \          / \
  //   B   B  =>    R   B
  //  / \          / \
  // R   R        B   B
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 9, { title: 'nine' })
  tree = set(tree, 4, { title: 'four' })
  tree = set(tree, 6, { title: 'six' })

  t.is(tree.key, 7)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 5)
  t.is(tree.left?.color, 'red')
  t.is(tree.right?.key, 9)
  t.is(tree.right?.color, 'black')
  t.is(tree.left?.left?.key, 4)
  t.is(tree.left?.left?.color, 'black')
  t.is(tree.left?.right?.key, 6)
  t.is(tree.left?.right?.color, 'black')
})

test('adding a fifth node (left, right then left, left)', t => {
  // If a black node has two red children, all three can be recolored
  //     B            B
  //    / \          / \
  //   B   B  =>    R   B
  //  / \          / \
  // R   R        B   B
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 9, { title: 'nine' })
  tree = set(tree, 6, { title: 'six' })
  tree = set(tree, 4, { title: 'four' })

  t.is(tree.key, 7)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 5)
  t.is(tree.left?.color, 'red')
  t.is(tree.right?.key, 9)
  t.is(tree.right?.color, 'black')
  t.is(tree.left?.left?.key, 4)
  t.is(tree.left?.left?.color, 'black')
  t.is(tree.left?.right?.key, 6)
  t.is(tree.left?.right?.color, 'black')
})

test('adding a fifth node (right, right then right, left)', t => {
  // If a black node has two red children, all three can be recolored
  //   B            B
  //  / \          / \
  // B   B    =>  B   R
  //    / \          / \
  //   R   R        B   B
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 8, { title: 'eight' })
  tree = set(tree, 6, { title: 'six' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'red')
  t.is(tree.right?.left?.key, 6)
  t.is(tree.right?.left?.color, 'black')
  t.is(tree.right?.right?.key, 8)
  t.is(tree.right?.right?.color, 'black')
})

test('adding a fifth node (right, left then right, right)', t => {
  // If a black node has two red children, all three can be recolored
  //   B            B
  //  / \          / \
  // B   B    =>  B   R
  //    / \          / \
  //   R   R        B   B
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 6, { title: 'six' })
  tree = set(tree, 8, { title: 'eight' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'red')
  t.is(tree.right?.left?.key, 6)
  t.is(tree.right?.left?.color, 'black')
  t.is(tree.right?.right?.key, 8)
  t.is(tree.right?.right?.color, 'black')
})

test('adding a fifth node (left, left then right, right)', t => {
  //     B
  //    / \
  //   B   B
  //  /     \
  // R       R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 2, { title: 'two' })
  tree = set(tree, 8, { title: 'eight' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
  t.is(tree.left?.left?.key, 2)
  t.is(tree.left?.left?.color, 'red')
  t.is(tree.right?.right?.key, 8)
  t.is(tree.right?.right?.color, 'red')
})

test('adding a fifth node (right, right then left, left)', t => {
  //     B
  //    / \
  //   B   B
  //  /     \
  // R       R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 8, { title: 'eight' })
  tree = set(tree, 2, { title: 'two' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
  t.is(tree.left?.left?.key, 2)
  t.is(tree.left?.left?.color, 'red')
  t.is(tree.right?.right?.key, 8)
  t.is(tree.right?.right?.color, 'red')
})

test('adding a fifth node (left, left then right, left)', t => {
  //     B
  //    / \
  //   B   B
  //  /   /
  // R   R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 2, { title: 'two' })
  tree = set(tree, 6, { title: 'six' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
  t.is(tree.left?.left?.key, 2)
  t.is(tree.left?.left?.color, 'red')
  t.is(tree.right?.left?.key, 6)
  t.is(tree.right?.left?.color, 'red')
})

test('adding a fifth node (right, left then left, left)', t => {
  //     B
  //    / \
  //   B   B
  //  /   /
  // R   R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 6, { title: 'six' })
  tree = set(tree, 2, { title: 'two' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
  t.is(tree.left?.left?.key, 2)
  t.is(tree.left?.left?.color, 'red')
  t.is(tree.right?.left?.key, 6)
  t.is(tree.right?.left?.color, 'red')
})

test('adding a fifth node (right, right then left, right)', t => {
  //   B
  //  / \
  // B   B
  //  \   \
  //   R   R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 9, { title: 'nine' })
  tree = set(tree, 4, { title: 'four' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
  t.is(tree.left?.right?.key, 4)
  t.is(tree.left?.right?.color, 'red')
  t.is(tree.right?.right?.key, 9)
  t.is(tree.right?.right?.color, 'red')
})

test('adding a fifth node (left, right then right, right)', t => {
  //   B
  //  / \
  // B   B
  //  \   \
  //   R   R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 4, { title: 'four' })
  tree = set(tree, 9, { title: 'nine' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
  t.is(tree.left?.right?.key, 4)
  t.is(tree.left?.right?.color, 'red')
  t.is(tree.right?.right?.key, 9)
  t.is(tree.right?.right?.color, 'red')
})

test('adding a fifth node (left, right then right, left)', t => {
  //    B
  //  /   \
  // B     B
  //  \   /
  //   R R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 4, { title: 'four' })
  tree = set(tree, 6, { title: 'six' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
  t.is(tree.left?.right?.key, 4)
  t.is(tree.left?.right?.color, 'red')
  t.is(tree.right?.left?.key, 6)
  t.is(tree.right?.left?.color, 'red')
})

test('adding a fifth node (left, left then left, left)', t => {
  // Can't have two consecutive red nodes
  // If a black node has two red children, all three can be recolored
  //       B            B            B
  //      / \          / \          / \
  //     B   B        B   B        R   B
  //    /       =>   / \     =>   / \
  //   R            R   R        B   B
  //  /
  // R
  let tree
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 2, { title: 'two' })
  tree = set(tree, 1, { title: 'one' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left?.key, 2)
  t.is(tree.left?.color, 'red')
  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')
  t.is(tree.left?.left?.key, 1)
  t.is(tree.left?.left?.color, 'black')
  t.is(tree.left?.right?.key, 3)
  t.is(tree.left?.right?.color, 'black')
})

test('adding a 7th node and forcing two rotations', t => {
  // Can't have two consecutive red nodes
  // If a black node has two red children, all three can be recolored
  // Root can always be recolored black
  //         B              B              B              B              B                  B
  //        / \            / \            / \            / \          /     \            /     \
  //       R   B          R   B          R   B          R   B        R       R    =>    B       B
  //      / \            / \            / \            / \          / \     / \        / \     / \
  //     B   B    =>    B   B    =>    R   B    =>    R   B    =>  B   B   B   B      B   B   B   B
  //    /              / \            / \            / \
  //   R              R   R          B   B          B   B
  //  /
  // R
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 9, { title: 'nine' })
  tree = set(tree, 4, { title: 'four' })
  tree = set(tree, 6, { title: 'six' })
  tree = set(tree, 3, { title: 'three' })
  tree = set(tree, 2, { title: 'two' })

  t.is(tree.key, 5)
  t.is(tree.color, 'black')

  t.is(tree.left?.key, 3)
  t.is(tree.left?.color, 'black')

  t.is(tree.right?.key, 7)
  t.is(tree.right?.color, 'black')

  t.is(tree.left?.left?.key, 2)
  t.is(tree.left?.left?.color, 'black')

  t.is(tree.left?.right?.key, 4)
  t.is(tree.left?.right?.color, 'black')

  t.is(tree.right?.left?.key, 6)
  t.is(tree.right?.left?.color, 'black')

  t.is(tree.right?.right?.key, 9)
  t.is(tree.right?.right?.color, 'black')
})

test('deleting the root', t => {
  // B  =>
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = remove(tree, 7)

  t.is(tree, null)
})

test('deleting a root having only a left child', t => {
  //   B      B
  //  /   =>
  // R
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 5, { title: 'five' })
  tree = remove(tree, 7)

  t.deepEqual([...entries(tree)], [tree])
  t.is(tree?.key, 5)
  t.is(tree?.color, 'black')
})

test('deleting a root having only a right child', t => {
  // B        B
  //  \   =>
  //   R
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 9, { title: 'nine' })
  tree = remove(tree, 7)

  t.deepEqual([...entries(tree)], [tree])
  t.is(tree?.key, 9)
  t.is(tree?.color, 'black')
})

test('deleting the second node (left)', t => {
  //   B      B
  //  /   =>
  // R
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 5, { title: 'five' })
  tree = remove(tree, 5)

  t.deepEqual([...entries(tree)], [tree])
  t.is(tree?.key, 7)
  t.is(tree?.color, 'black')
})

test('deleting the second node (right)', t => {
  // B        B
  //  \   =>
  //   R
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 9, { title: 'nine' })
  tree = remove(tree, 9)

  t.deepEqual([...entries(tree)], [tree])
  t.is(tree?.key, 7)
  t.is(tree?.color, 'black')
})

test('deleting the root of a 3 node tree', t => {
  //   B          B
  //  / \   =>   /
  // B   B      R
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 9, { title: 'nine' })
  tree = remove(tree, 7)

  t.deepEqual([...entries(tree)], [tree?.left, tree])
  t.is(tree?.key, 9)
  t.is(tree?.color, 'black')
  t.is(tree?.left?.key, 5)
  t.is(tree?.left?.color, 'red')
})

test('deleting the third node (left)', t => {
  //   B        B
  //  / \   =>   \
  // B   B        R
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 9, { title: 'nine' })
  tree = remove(tree, 5)

  t.deepEqual([...entries(tree)], [tree, tree?.right])
  t.is(tree?.key, 7)
  t.is(tree?.color, 'black')
  t.is(tree?.right?.key, 9)
  t.is(tree?.right?.color, 'red')
})

test('deleting the third node (right)', t => {
  //   B          B
  //  / \   =>   /
  // B   B      R
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 9, { title: 'nine' })
  tree = remove(tree, 9)

  t.deepEqual([...entries(tree)], [tree?.left, tree])
  t.is(tree?.key, 7)
  t.is(tree?.color, 'black')
  t.is(tree?.left?.key, 5)
  t.is(tree?.left?.color, 'red')
})

test('deleting the 4th node (left, left)', t => {
  //     B          B
  //    / \   =>   / \
  //   B   B      B   B
  //  /
  // R
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 9, { title: 'nine' })
  tree = set(tree, 3, { title: 'three' })
  tree = remove(tree, 3)

  t.deepEqual([...entries(tree)], [tree?.left, tree, tree?.right])
  t.is(tree?.key, 7)
  t.is(tree?.color, 'black')
  t.is(tree?.left?.key, 5)
  t.is(tree?.left?.color, 'black')
  t.is(tree?.right?.key, 9)
  t.is(tree?.right?.color, 'black')
})

test('deleting the 4th node (left, right)', t => {
  //   B          B
  //  / \   =>   / \
  // B   B      B   B
  //  \
  //   R
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 9, { title: 'nine' })
  tree = set(tree, 6, { title: 'six' })
  tree = remove(tree, 6)

  t.deepEqual([...entries(tree)], [tree?.left, tree, tree?.right])
  t.is(tree?.key, 7)
  t.is(tree?.color, 'black')
  t.is(tree?.left?.key, 5)
  t.is(tree?.left?.color, 'black')
  t.is(tree?.right?.key, 9)
  t.is(tree?.right?.color, 'black')
})

test('deleting the 4th node (right, left)', t => {
  //   B          B
  //  / \   =>   / \
  // B   B      B   B
  //    /
  //   R
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 9, { title: 'nine' })
  tree = set(tree, 8, { title: 'eight' })
  tree = remove(tree, 8)

  t.deepEqual([...entries(tree)], [tree?.left, tree, tree?.right])
  t.is(tree?.key, 7)
  t.is(tree?.color, 'black')
  t.is(tree?.left?.key, 5)
  t.is(tree?.left?.color, 'black')
  t.is(tree?.right?.key, 9)
  t.is(tree?.right?.color, 'black')
})

test('deleting the 4th node (right, right)', t => {
  //   B            B
  //  / \     =>   / \
  // B   B        B   B
  //      \
  //       R
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 9, { title: 'nine' })
  tree = set(tree, 10, { title: 'ten' })
  tree = remove(tree, 10)

  t.deepEqual([...entries(tree)], [tree?.left, tree, tree?.right])
  t.is(tree?.key, 7)
  t.is(tree?.color, 'black')
  t.is(tree?.left?.key, 5)
  t.is(tree?.left?.color, 'black')
  t.is(tree?.right?.key, 9)
  t.is(tree?.right?.color, 'black')
})

test('deleting the 5th node (right, right)', t => {
  //     B              B
  //    / \     =>     / \
  //   B   B          B   B
  //  /     \        /
  // R       R      R
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 9, { title: 'nine' })
  tree = set(tree, 4, { title: 'four' })
  tree = set(tree, 10, { title: 'ten' })
  tree = remove(tree, 10)

  t.deepEqual(
    [...entries(tree)],
    [tree?.left?.left, tree?.left, tree, tree?.right]
  )
  t.is(tree?.key, 7)
  t.is(tree?.color, 'black')
  t.is(tree?.left?.key, 5)
  t.is(tree?.left?.color, 'black')
  t.is(tree?.right?.key, 9)
  t.is(tree?.right?.color, 'black')
  t.is(tree?.left?.left?.key, 4)
  t.is(tree?.left?.left?.color, 'red')
})

test('deleting the 7th node (left, left)', t => {
  //       B                 B                B+               B
  //    /     \           /     \          /     \          /     \
  //   B       B    =>  +B       B    =>  B       R    =>  B       R
  //  / \     / \         \     / \        \     / \        \     / \
  // B   B   B   B         R   B   B        R   B   B        R   B   B
  let tree
  tree = set(tree, 7, { title: 'seven' })
  tree = set(tree, 5, { title: 'five' })
  tree = set(tree, 9, { title: 'nine' })
  tree = set(tree, 4, { title: 'four' })
  tree = set(tree, 6, { title: 'six' })
  tree = set(tree, 8, { title: 'eight' })
  tree = set(tree, 10, { title: 'ten' })
  tree = remove(tree, 4)

  t.is(tree?.key, 7)
  t.is(tree?.color, 'black')
  t.is(tree?.left?.key, 5)
  t.is(tree?.left?.color, 'black')
  t.is(tree?.right?.key, 9)
  t.is(tree?.right?.color, 'red')
  t.is(tree?.left?.left, null)
  t.is(tree?.left?.right?.key, 6)
  t.is(tree?.left?.right?.color, 'red')
  t.is(tree?.right?.left?.key, 8)
  t.is(tree?.right?.left?.color, 'black')
  t.is(tree?.right?.right?.key, 10)
  t.is(tree?.right?.right?.color, 'black')
})

test('randomly generated trees are valid', t => {
  /* eslint-disable no-unused-vars */
  const iterations = process.env.CI ? 1000000 : 1000

  for (const testIteration of range(iterations)) {
    let tree
    const keys = times(50, () => random(1000))

    for (const key of keys) {
      tree = set(tree, key, {})
      t.notThrows(() => assertValidTree(tree))
    }

    for (const key of shuffle(keys)) {
      tree = remove(tree, key)
      t.notThrows(() => assertValidTree(tree))
    }
  }
})

function assertValidTree(tree) {
  const paths = [...traces(tree)]

  if (tree && tree.color !== 'black') throw new Error('Root must be black')

  if (
    !paths.every(path =>
      path.every(tree => tree.color === 'red' || tree.color === 'black')
    )
  )
    throw new Error('Nodes can only be colored red or black')

  const blackCounts = countBy(
    paths,
    path => path.filter(tree => tree.color === 'black').length
  )
  if (size(blackCounts) > 1)
    throw new Error('Each path must have the same number of black nodes')

  for (const path of paths) {
    let prevRed = false
    for (const tree of path) {
      if (tree.color === 'red') {
        if (prevRed) {
          throw new Error('Must not have two consecutive red nodes')
        } else {
          prevRed = true
        }
      } else {
        prevRed = false
      }
    }
  }
}

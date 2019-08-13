import test from 'ava'
import { RedBlackTree } from 'ikeru'

test('creating the first node', t => {
  // B
  const tree = new RedBlackTree(5, 'five')
  t.deepEqual([...tree], [tree])
  t.is(tree.key, 5)
  t.true(tree.color === 'black')
})

test('changing the value of an existing node', t => {
  // B
  const tree = new RedBlackTree(5, 'five').set(5, 'FIVE')
  t.deepEqual([...tree], [tree])
  t.is(tree.key, 5)
  t.is(tree.value, 'FIVE')
  t.true(tree.color === 'black')
})

test('adding a second node to the left', t => {
  //   B
  //  /
  // R
  const tree = new RedBlackTree(5, 'five').set(3, 'three')
  t.deepEqual([...tree], [tree.left, tree])
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'red')
})

test('adding a second node to the right', t => {
  // B
  //  \
  //   R
  const tree = new RedBlackTree(5, 'five').set(7, 'seven')
  t.deepEqual([...tree], [tree, tree.right])
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'red')
})

test('adding a third node at depth 2 (left then right)', t => {
  // If a black node has two red children, all three can be recolored
  // The root can always be recolored black
  //   B          R          B
  //  / \   =>   / \   =>   / \
  // R   R      B   B      B   B
  const tree = new RedBlackTree(5, 'five').set(3, 'three').set(7, 'seven')
  t.deepEqual([...tree], [tree.left, tree, tree.right])
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
})

test('adding a third node at depth 2 (right then left)', t => {
  // If a black node has two red children, all three can be recolored
  // The root can always be recolored black
  //   B          R          B
  //  / \   =>   / \   =>   / \
  // R   R      B   B      B   B
  const tree = new RedBlackTree(5, 'five').set(7, 'seven').set(3, 'three')
  t.deepEqual([...tree], [tree.left, tree, tree.right])
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
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
  const tree = new RedBlackTree(5, 'five').set(3, 'three').set(1, 'one')
  t.deepEqual([...tree], [tree.left, tree, tree.right])
  t.is(tree.key, 3)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 1)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 5)
  t.is(tree.right.color, 'black')
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
  const tree = new RedBlackTree(5, 'five').set(3, 'three').set(4, 'four')
  t.deepEqual([...tree], [tree.left, tree, tree.right])
  t.is(tree.key, 4)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 5)
  t.is(tree.right.color, 'black')
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
  const tree = new RedBlackTree(5, 'five').set(7, 'seven').set(6, 'six')
  t.deepEqual([...tree], [tree.left, tree, tree.right])
  t.is(tree.key, 6)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 5)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
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
  const tree = new RedBlackTree(5, 'five').set(7, 'seven').set(9, 'nine')
  t.deepEqual([...tree], [tree.left, tree, tree.right])
  t.is(tree.key, 7)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 5)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 9)
  t.is(tree.right.color, 'black')
})

test('adding a fourth node (left, left)', t => {
  //     B
  //    / \
  //   B   B
  //  /
  // R
  const tree = new RedBlackTree(5, 'five')
    .set(7, 'seven')
    .set(3, 'three')
    .set(1, 'one')
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
  t.is(tree.left.left.key, 1)
  t.is(tree.left.left.color, 'red')
})

test('adding a fourth node (left, right)', t => {
  //   B
  //  / \
  // B   B
  //  \
  //   R
  const tree = new RedBlackTree(5, 'five')
    .set(7, 'seven')
    .set(3, 'three')
    .set(4, 'four')
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
  t.is(tree.left.right.key, 4)
  t.is(tree.left.right.color, 'red')
})

test('adding a fourth node (right, left)', t => {
  //   B
  //  / \
  // B   B
  //    /
  //   R
  const tree = new RedBlackTree(5, 'five')
    .set(7, 'seven')
    .set(3, 'three')
    .set(6, 'six')
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
  t.is(tree.right.left.key, 6)
  t.is(tree.right.left.color, 'red')
})

test('adding a fourth node (right, right)', t => {
  //   B
  //  / \
  // B   B
  //      \
  //       R
  const tree = new RedBlackTree(5, 'five')
    .set(7, 'seven')
    .set(3, 'three')
    .set(8, 'eight')
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
  t.is(tree.right.right.key, 8)
  t.is(tree.right.right.color, 'red')
})

test('adding a fifth node (left, left then left, right)', t => {
  // If a black node has two red children, all three can be recolored
  //     B            B
  //    / \          / \
  //   B   B  =>    R   B
  //  / \          / \
  // R   R        B   B
  const tree = new RedBlackTree(7, 'seven')
    .set(5, 'five')
    .set(9, 'nine')
    .set(4, 'four')
    .set(6, 'six')
  t.is(tree.key, 7)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 5)
  t.is(tree.left.color, 'red')
  t.is(tree.right.key, 9)
  t.is(tree.right.color, 'black')
  t.is(tree.left.left.key, 4)
  t.is(tree.left.left.color, 'black')
  t.is(tree.left.right.key, 6)
  t.is(tree.left.right.color, 'black')
})

test('adding a fifth node (left, right then left, left)', t => {
  // If a black node has two red children, all three can be recolored
  //     B            B
  //    / \          / \
  //   B   B  =>    R   B
  //  / \          / \
  // R   R        B   B
  const tree = new RedBlackTree(7, 'seven')
    .set(5, 'five')
    .set(9, 'nine')
    .set(6, 'six')
    .set(4, 'four')
  t.is(tree.key, 7)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 5)
  t.is(tree.left.color, 'red')
  t.is(tree.right.key, 9)
  t.is(tree.right.color, 'black')
  t.is(tree.left.left.key, 4)
  t.is(tree.left.left.color, 'black')
  t.is(tree.left.right.key, 6)
  t.is(tree.left.right.color, 'black')
})

test('adding a fifth node (right, right then right, left)', t => {
  // If a black node has two red children, all three can be recolored
  //   B            B
  //  / \          / \
  // B   B    =>  B   R
  //    / \          / \
  //   R   R        B   B
  const tree = new RedBlackTree(5, 'five')
    .set(3, 'three')
    .set(7, 'seven')
    .set(8, 'eight')
    .set(6, 'six')
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'red')
  t.is(tree.right.left.key, 6)
  t.is(tree.right.left.color, 'black')
  t.is(tree.right.right.key, 8)
  t.is(tree.right.right.color, 'black')
})

test('adding a fifth node (right, left then right, right)', t => {
  // If a black node has two red children, all three can be recolored
  //   B            B
  //  / \          / \
  // B   B    =>  B   R
  //    / \          / \
  //   R   R        B   B
  const tree = new RedBlackTree(5, 'five')
    .set(3, 'three')
    .set(7, 'seven')
    .set(6, 'six')
    .set(8, 'eight')
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'red')
  t.is(tree.right.left.key, 6)
  t.is(tree.right.left.color, 'black')
  t.is(tree.right.right.key, 8)
  t.is(tree.right.right.color, 'black')
})

test('adding a fifth node (left, left then right, right)', t => {
  //     B
  //    / \
  //   B   B
  //  /     \
  // R       R
  const tree = new RedBlackTree(5, 'five')
    .set(3, 'three')
    .set(7, 'seven')
    .set(2, 'two')
    .set(8, 'eight')
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
  t.is(tree.left.left.key, 2)
  t.is(tree.left.left.color, 'red')
  t.is(tree.right.right.key, 8)
  t.is(tree.right.right.color, 'red')
})

test('adding a fifth node (right, right then left, left)', t => {
  //     B
  //    / \
  //   B   B
  //  /     \
  // R       R
  const tree = new RedBlackTree(5, 'five')
    .set(3, 'three')
    .set(7, 'seven')
    .set(8, 'eight')
    .set(2, 'two')
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
  t.is(tree.left.left.key, 2)
  t.is(tree.left.left.color, 'red')
  t.is(tree.right.right.key, 8)
  t.is(tree.right.right.color, 'red')
})

test('adding a fifth node (left, left then right, left)', t => {
  //     B
  //    / \
  //   B   B
  //  /   /
  // R   R
  const tree = new RedBlackTree(5, 'five')
    .set(3, 'three')
    .set(7, 'seven')
    .set(2, 'two')
    .set(6, 'six')
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
  t.is(tree.left.left.key, 2)
  t.is(tree.left.left.color, 'red')
  t.is(tree.right.left.key, 6)
  t.is(tree.right.left.color, 'red')
})

test('adding a fifth node (right, left then left, left)', t => {
  //     B
  //    / \
  //   B   B
  //  /   /
  // R   R
  const tree = new RedBlackTree(5, 'five')
    .set(3, 'three')
    .set(7, 'seven')
    .set(6, 'six')
    .set(2, 'two')
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
  t.is(tree.left.left.key, 2)
  t.is(tree.left.left.color, 'red')
  t.is(tree.right.left.key, 6)
  t.is(tree.right.left.color, 'red')
})

test('adding a fifth node (right, right then left, right)', t => {
  //   B
  //  / \
  // B   B
  //  \   \
  //   R   R
  const tree = new RedBlackTree(5, 'five')
    .set(3, 'three')
    .set(7, 'seven')
    .set(9, 'nine')
    .set(4, 'four')
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
  t.is(tree.left.right.key, 4)
  t.is(tree.left.right.color, 'red')
  t.is(tree.right.right.key, 9)
  t.is(tree.right.right.color, 'red')
})

test('adding a fifth node (left, right then right, right)', t => {
  //   B
  //  / \
  // B   B
  //  \   \
  //   R   R
  const tree = new RedBlackTree(5, 'five')
    .set(3, 'three')
    .set(7, 'seven')
    .set(4, 'four')
    .set(9, 'nine')
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
  t.is(tree.left.right.key, 4)
  t.is(tree.left.right.color, 'red')
  t.is(tree.right.right.key, 9)
  t.is(tree.right.right.color, 'red')
})

test('adding a fifth node (left, right then right, left)', t => {
  //    B
  //  /   \
  // B     B
  //  \   /
  //   R R
  const tree = new RedBlackTree(5, 'five')
    .set(3, 'three')
    .set(7, 'seven')
    .set(4, 'four')
    .set(6, 'six')
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
  t.is(tree.left.right.key, 4)
  t.is(tree.left.right.color, 'red')
  t.is(tree.right.left.key, 6)
  t.is(tree.right.left.color, 'red')
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
  const tree = new RedBlackTree(5, 'five')
    .set(3, 'three')
    .set(7, 'seven')
    .set(2, 'two')
    .set(1, 'one')
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 2)
  t.is(tree.left.color, 'red')
  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')
  t.is(tree.left.left.key, 1)
  t.is(tree.left.left.color, 'black')
  t.is(tree.left.right.key, 3)
  t.is(tree.left.right.color, 'black')
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
  const tree = new RedBlackTree(7, 'seven')
    .set(5, 'five')
    .set(9, 'nine')
    .set(4, 'four')
    .set(6, 'six')
    .set(3, 'three')
    .set(2, 'two')

  t.is(tree.key, 5)
  t.is(tree.color, 'black')

  t.is(tree.left.key, 3)
  t.is(tree.left.color, 'black')

  t.is(tree.right.key, 7)
  t.is(tree.right.color, 'black')

  t.is(tree.left.left.key, 2)
  t.is(tree.left.left.color, 'black')

  t.is(tree.left.right.key, 4)
  t.is(tree.left.right.color, 'black')

  t.is(tree.right.left.key, 6)
  t.is(tree.right.left.color, 'black')

  t.is(tree.right.right.key, 9)
  t.is(tree.right.right.color, 'black')
})

test('deleting the root', t => {
  // B  =>
  const tree = new RedBlackTree(7, 'seven')
  t.is(tree.delete(7), null)
})

test('deleting a root having only a left child', t => {
  //   B      B
  //  /   =>
  // R
  const tree = new RedBlackTree(7, 'seven').set(5, 'nine').delete(7)
  t.deepEqual([...tree], [tree])
  t.is(tree.key, 5)
  t.is(tree.color, 'black')
})

test('deleting a root having only a right child', t => {
  // B        B
  //  \   =>
  //   R
  const tree = new RedBlackTree(7, 'seven').set(9, 'nine').delete(7)
  t.deepEqual([...tree], [tree])
  t.is(tree.key, 9)
  t.is(tree.color, 'black')
})

test('deleting the second node (left)', t => {
  //   B      B
  //  /   =>
  // R
  const tree = new RedBlackTree(7, 'seven').set(5, 'five').delete(5)
  t.deepEqual([...tree], [tree])
  t.is(tree.key, 7)
  t.is(tree.color, 'black')
})

test('deleting the second node (right)', t => {
  // B        B
  //  \   =>
  //   R
  const tree = new RedBlackTree(7, 'seven').set(9, 'nine').delete(9)
  t.deepEqual([...tree], [tree])
  t.is(tree.key, 7)
  t.is(tree.color, 'black')
})

test('deleting the root of a 3 node tree', t => {
  //   B          B
  //  / \   =>   /
  // B   B      R
  const tree = new RedBlackTree(7, 'seven')
    .set(5, 'five')
    .set(9, 'nine')
    .delete(7)
  t.deepEqual([...tree], [tree.left, tree])
  t.is(tree.key, 9)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 5)
  t.is(tree.left.color, 'red')
})

test('deleting the third node (left)', t => {
  //   B        B
  //  / \   =>   \
  // B   B        R
  const tree = new RedBlackTree(7, 'seven')
    .set(5, 'five')
    .set(9, 'nine')
    .delete(5)
  t.deepEqual([...tree], [tree, tree.right])
  t.is(tree.key, 7)
  t.is(tree.color, 'black')
  t.is(tree.right.key, 9)
  t.is(tree.right.color, 'red')
})

test('deleting the third node (right)', t => {
  //   B          B
  //  / \   =>   /
  // B   B      R
  const tree = new RedBlackTree(7, 'seven')
    .set(5, 'five')
    .set(9, 'nine')
    .delete(9)
  t.deepEqual([...tree], [tree.left, tree])
  t.is(tree.key, 7)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 5)
  t.is(tree.left.color, 'red')
})

test('deleting the 4th node (left, left)', t => {
  //     B          B
  //    / \   =>   / \
  //   B   B      B   B
  //  /
  // R
  const tree = new RedBlackTree(7, 'seven')
    .set(5, 'five')
    .set(9, 'nine')
    .set(3, 'three')
    .delete(3)
  t.deepEqual([...tree], [tree.left, tree, tree.right])
  t.is(tree.key, 7)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 5)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 9)
  t.is(tree.right.color, 'black')
})

test('deleting the 4th node (left, right)', t => {
  //   B          B
  //  / \   =>   / \
  // B   B      B   B
  //  \
  //   R
  const tree = new RedBlackTree(7, 'seven')
    .set(5, 'five')
    .set(9, 'nine')
    .set(6, 'six')
    .delete(6)
  t.deepEqual([...tree], [tree.left, tree, tree.right])
  t.is(tree.key, 7)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 5)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 9)
  t.is(tree.right.color, 'black')
})

test('deleting the 4th node (right, left)', t => {
  //   B          B
  //  / \   =>   / \
  // B   B      B   B
  //    /
  //   R
  const tree = new RedBlackTree(7, 'seven')
    .set(5, 'five')
    .set(9, 'nine')
    .set(8, 'eight')
    .delete(8)
  t.deepEqual([...tree], [tree.left, tree, tree.right])
  t.is(tree.key, 7)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 5)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 9)
  t.is(tree.right.color, 'black')
})

test('deleting the 4th node (right, right)', t => {
  //   B            B
  //  / \     =>   / \
  // B   B        B   B
  //      \
  //       R
  const tree = new RedBlackTree(7, 'seven')
    .set(5, 'five')
    .set(9, 'nine')
    .set(10, 'ten')
    .delete(10)
  t.deepEqual([...tree], [tree.left, tree, tree.right])
  t.is(tree.key, 7)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 5)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 9)
  t.is(tree.right.color, 'black')
})

test('deleting the 5th node (right, right)', t => {
  //     B            B
  //    / \     =>   / \
  //   B   B        B   B
  //  /     \
  // R       R
  const tree = new RedBlackTree(7, 'seven')
    .set(5, 'five')
    .set(9, 'nine')
    .set(10, 'ten')
    .delete(10)
  t.deepEqual([...tree], [tree.left, tree, tree.right])
  t.is(tree.key, 7)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 5)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 9)
  t.is(tree.right.color, 'black')
})

test('deleting the 7th node (left, left)', t => {
  //       B                 B                B+               B
  //    /     \           /     \          /     \          /     \
  //   B       B    =>  +B       B    =>  B       R    =>  B       R
  //  / \     / \         \     / \        \     / \        \     / \
  // B   B   B   B         R   B   B        R   B   B        R   B   B
  const tree = new RedBlackTree(7, 'seven')
    .set(5, 'five')
    .set(9, 'nine')
    .set(4, 'four')
    .set(6, 'six')
    .set(8, 'eight')
    .set(10, 'ten')
    .delete(4)
  t.is(tree.key, 7)
  t.is(tree.color, 'black')
  t.is(tree.left.key, 5)
  t.is(tree.left.color, 'black')
  t.is(tree.right.key, 9)
  t.is(tree.right.color, 'red')
  t.is(tree.left.left, null)
  t.is(tree.left.right.key, 6)
  t.is(tree.left.right.color, 'red')
  t.is(tree.right.left.key, 8)
  t.is(tree.right.left.color, 'black')
  t.is(tree.right.right.key, 10)
  t.is(tree.right.right.color, 'black')
})

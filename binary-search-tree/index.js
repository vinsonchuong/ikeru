/* @flow */
import type { BinaryTree } from 'ikeru/binary-tree'

export type BinarySearchTree<Node: {}> = BinaryTree<{
  ...$Exact<Node>,
  key: number
}>

export function* entries<Node: {}, Tree: BinarySearchTree<Node>>(
  tree: ?Tree
): Iterator<Tree> {
  if (!tree) return
  if (tree.left) yield* entries(tree.left)
  yield tree
  if (tree.right) yield* entries(tree.right)
}

export function* traces<Node: {}, Tree: BinarySearchTree<Node>>(
  tree: ?Tree
): Iterator<Array<Tree>> {
  if (!tree) {
    return
  }
  if (!tree.left && !tree.right) {
    yield [tree]
  }
  if (tree.left) {
    for (const trace of traces(tree.left)) {
      yield [tree, ...trace]
    }
  }
  if (tree.right) {
    for (const trace of traces(tree.right)) {
      yield [tree, ...trace]
    }
  }
}

export function get<Node: {}, Tree: BinarySearchTree<Node>>(
  tree: ?Tree,
  key: number
): ?Tree {
  if (!tree) return null
  else if (key === tree.key) return tree
  else if (key < tree.key) return get(tree.left, key)
  else return get(tree.right, key)
}

export function set<Node: {}>(
  tree: ?BinarySearchTree<Node>,
  key: number,
  values: Node
): BinarySearchTree<Node> {
  if (!tree) return { key, left: null, right: null, ...values }
  else if (key === tree.key) return { ...tree, ...values }
  else if (key < tree.key) return { ...tree, left: set(tree.left, key, values) }
  else return { ...tree, right: set(tree.right, key, values) }
}

export function remove<Node: {}, Tree: BinarySearchTree<Node>>(
  tree: ?Tree,
  key: number
): ?Tree {
  if (!tree) return null
  else if (key === tree.key) {
    if (tree.left && tree.right) {
      const nextNode = first(tree.right)
      return {
        ...nextNode,
        left: tree.left,
        right: remove(tree.right, nextNode.key)
      }
    } else return tree.left || tree.right
  } else if (key < tree.key) return { ...tree, left: remove(tree.left, key) }
  else return { ...tree, right: remove(tree.right, key) }
}

export function first<Node: {}, Tree: BinarySearchTree<Node>>(
  tree: Tree
): Tree {
  return tree && tree.left ? first(tree.left) : tree
}

export function rotateRight<Node: {}, Tree: BinarySearchTree<Node>>(
  tree: Tree
): Tree {
  if (!tree.left) {
    throw new Error('Can only right rotate a tree with a left child')
  }
  return { ...tree.left, right: { ...tree, left: tree.left.right } }
}

export function rotateLeft<Node: {}, Tree: BinarySearchTree<Node>>(
  tree: Tree
): Tree {
  if (!tree.right) {
    throw new Error('Can only left rotate a tree with a right child')
  }
  return { ...tree.right, left: { ...tree, right: tree.right.left } }
}

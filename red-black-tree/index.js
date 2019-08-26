/* @flow */
import type { BinarySearchTree } from 'ikeru/binary-search-tree'
import * as bst from 'ikeru/binary-search-tree'

type Color = 'red' | 'black' | '+black' | '-black'

export type RedBlackTree<Node: {}> = BinarySearchTree<{
  ...$Exact<Node>,
  color: Color
}>

export { entries, traces, get } from 'ikeru/binary-search-tree'

export function set<Node: {}>(
  tree: ?RedBlackTree<Node>,
  key: number,
  values: Node,
  isRoot: boolean = true
): RedBlackTree<Node> {
  if (!tree) {
    if (isRoot) {
      return { key, color: 'black', left: null, right: null, ...values }
    } else {
      return { key, color: 'red', left: null, right: null, ...values }
    }
  } else if (key === tree.key) {
    return { ...tree, key, ...values }
  } else if (key < tree.key) {
    return rebalance(
      { ...tree, left: set(tree.left, key, values, false) },
      isRoot
    )
  } else {
    return rebalance(
      { ...tree, right: set(tree.right, key, values, false) },
      isRoot
    )
  }
}

export function remove<Node: {}>(
  t: ?RedBlackTree<Node>,
  key: number,
  isRoot: boolean = true
): ?RedBlackTree<Node> {
  let tree = t

  if (!tree) {
    return null
  }

  if (key === tree.key) {
    if (tree.left && tree.right) {
      const nextNode = bst.first(tree.right)
      const shouldRecolor =
        nextNode === tree.right && !nextNode.left && !nextNode.right

      tree = {
        ...nextNode,
        color: shouldRecolor
          ? isRoot
            ? 'black'
            : addBlack(tree.color)
          : tree.color,
        left:
          shouldRecolor && tree.left
            ? { ...tree.left, color: subtractBlack(tree.left.color) }
            : tree.left,
        right: remove(tree.right, nextNode.key, false)
      }
    } else if (tree.left) {
      tree = { ...tree.left, color: tree.color }
    } else if (tree.right) {
      tree = { ...tree.right, color: tree.color }
    } else {
      return null
    }
  } else if (key < tree.key) {
    const shouldRecolor =
      tree.left &&
      key === tree.left.key &&
      tree.left.color === 'black' &&
      !tree.left.left &&
      !tree.left.right
    tree = {
      ...tree,
      color: shouldRecolor
        ? isRoot
          ? 'black'
          : addBlack(tree.color)
        : tree.color,
      left: remove(tree.left, key, false),
      right:
        shouldRecolor && tree.right
          ? { ...tree.right, color: subtractBlack(tree.right.color) }
          : tree.right
    }
  } else {
    const shouldRecolor =
      tree.right &&
      key === tree.right.key &&
      tree.right.color === 'black' &&
      !tree.right.left &&
      !tree.right.right
    tree = {
      ...tree,
      color: shouldRecolor
        ? isRoot
          ? 'black'
          : addBlack(tree.color)
        : tree.color,
      left:
        shouldRecolor && tree.left
          ? { ...tree.left, color: subtractBlack(tree.left.color) }
          : tree.left,
      right: remove(tree.right, key, false)
    }
  }

  if (
    (tree.left && tree.left.color === '+black') ||
    (tree.right && tree.right.color === '+black')
  ) {
    tree = {
      ...tree,
      color: isRoot ? 'black' : addBlack(tree.color),
      left: tree.left && {
        ...tree.left,
        color: subtractBlack(tree.left.color)
      },
      right: tree.right && {
        ...tree.right,
        color: subtractBlack(tree.right.color)
      }
    }
  }

  tree = rebalance(tree, isRoot)

  return tree
}

function redden<Node: {}>(tree: ?RedBlackTree<Node>): ?RedBlackTree<Node> {
  return tree && { ...tree, color: 'red' }
}

function blacken<Node: {}>(tree: ?RedBlackTree<Node>): ?RedBlackTree<Node> {
  return tree && { ...tree, color: 'black' }
}

function rebalance<Node: {}>(
  t: RedBlackTree<Node>,
  isRoot: boolean
): RedBlackTree<Node> {
  let tree = t

  if (tree.color === '+black' || isRoot) {
    if (tree.left && tree.left.color === '-black') {
      tree = bst.rotateRight({ ...tree, left: bst.rotateLeft(tree.left) })
      tree = {
        ...tree,
        left: rebalance(
          { ...blacken(tree.left), left: redden(tree.left?.left) },
          false
        ),
        right: blacken(tree.right)
      }
    } else if (tree.right && tree.right.color === '-black') {
      tree = bst.rotateLeft({ ...tree, right: bst.rotateRight(tree.right) })
      tree = {
        ...tree,
        left: blacken(tree.left),
        right: rebalance(
          { ...blacken(tree.right), right: redden(tree.right?.right) },
          false
        )
      }
    }
  }

  if (tree.color === 'black' || tree.color === '+black') {
    if (
      tree.left &&
      tree.left.color === 'red' &&
      tree.right &&
      tree.right.color === 'red'
    ) {
      return {
        ...tree,
        color: isRoot ? 'black' : 'red',
        left: blacken(tree.left),
        right: blacken(tree.right)
      }
    }

    if (
      tree.left &&
      tree.left.color === 'red' &&
      (!tree.right || tree.right.color !== 'red')
    ) {
      if (tree.left.right && tree.left.right.color === 'red') {
        tree = { ...tree, left: bst.rotateLeft(tree.left) }
      }

      if (tree.left.left && tree.left.left.color === 'red') {
        const color = isRoot ? 'black' : subtractBlack(tree.color)
        tree = bst.rotateRight(tree)
        return {
          ...tree,
          color,
          left: blacken(tree.left),
          right: blacken(tree.right)
        }
      }
    }

    if (
      (!tree.left || tree.left.color !== 'red') &&
      tree.right &&
      tree.right.color === 'red'
    ) {
      if (tree.right.left && tree.right.left.color === 'red') {
        tree = { ...tree, right: bst.rotateRight(tree.right) }
      }

      if (tree.right.right && tree.right.right.color === 'red') {
        const color = isRoot ? 'black' : subtractBlack(tree.color)
        tree = bst.rotateLeft(tree)
        return {
          ...tree,
          color,
          left: blacken(tree.left),
          right: blacken(tree.right)
        }
      }
    }
  }

  return tree
}

function addBlack(color: Color): Color {
  if (color === '-black') {
    return 'red'
  } else if (color === 'red') {
    return 'black'
  } else if (color === 'black') {
    return '+black'
  } else {
    throw new Error('Cannot add black to +black')
  }
}

function subtractBlack(color: Color): Color {
  if (color === '+black') {
    return 'black'
  } else if (color === 'black') {
    return 'red'
  } else if (color === 'red') {
    return '-black'
  } else {
    throw new Error('Cannot subtract black from -black')
  }
}

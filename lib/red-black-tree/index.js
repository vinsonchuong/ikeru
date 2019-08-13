/* @flow */
import { BinarySearchTree } from 'ikeru'

type Color = 'red' | 'black' | '+black' | '-black'

export default class RedBlackTree<Value> extends BinarySearchTree<Value> {
  +key: number
  +value: Value
  +left: ?RedBlackTree<Value>
  +right: ?RedBlackTree<Value>
  +color: Color
  +isRoot: boolean

  constructor(
    key: number,
    value: Value,
    left: ?RedBlackTree<Value> = null,
    right: ?RedBlackTree<Value> = null,
    color: Color = 'black',
    isRoot: boolean = true
  ) {
    super(key, value, left, right)
    this.color = color
    this.isRoot = isRoot
  }

  set(key: number, value: Value): RedBlackTree<Value> {
    return rebalance(cast(super.set(key, value), this.color, this.isRoot))
  }

  delete(key: number): ?RedBlackTree<Value> {
    let tree = super.delete(key)

    if (!tree) {
      return tree
    }

    tree =
      tree instanceof RedBlackTree
        ? updateNode(tree, { color: this.color, isRoot: this.isRoot })
        : cast(tree, this.color, this.isRoot)

    if (
      this.left &&
      key === this.left.key &&
      this.left.color === 'black' &&
      !this.left.left &&
      !this.left.right
    ) {
      if (!tree.right) {
        throw new Error('Invalid tree')
      }
      tree = updateNode(tree, {
        color: tree.isRoot ? 'black' : '+black',
        right: updateNode(tree.right, {
          color: subtractBlack(tree.right.color)
        })
      })
    } else if (
      this.right &&
      key === this.right.key &&
      this.right.color === 'black' &&
      !this.right.left &&
      !this.right.right
    ) {
      if (!tree.left) {
        throw new Error('Invalid tree')
      }
      tree = updateNode(tree, {
        color: tree.isRoot ? 'black' : '+black',
        left: updateNode(tree.left, { color: subtractBlack(tree.left.color) })
      })
    }

    if (tree.left?.color === '+black' || tree.right?.color === '+black') {
      tree = updateNode(tree, {
        color: tree.isRoot ? 'black' : addBlack(tree.color),
        left:
          tree.left &&
          updateNode(tree.left, {
            color: subtractBlack(tree.left.color)
          }),
        right:
          tree.right &&
          updateNode(tree.right, {
            color: subtractBlack(tree.right.color)
          })
      })
    }

    tree = rebalance(tree)

    return tree
  }
}

function cast<Value>(
  tree: BinarySearchTree<Value>,
  color: Color = 'red',
  isRoot: boolean = false
): RedBlackTree<Value> {
  return tree instanceof RedBlackTree
    ? tree
    : new RedBlackTree<Value>(
        tree.key,
        tree.value,
        tree.left && cast(tree.left),
        tree.right && cast(tree.right),
        color,
        isRoot
      )
}

function updateNode<Value>(
  tree: ?RedBlackTree<Value>,
  updates: {
    color?: Color,
    left?: ?RedBlackTree<Value>,
    right?: ?RedBlackTree<Value>,
    isRoot?: boolean
  }
): RedBlackTree<Value> {
  if (!tree) {
    throw new Error('Tree must not be null')
  }

  return new RedBlackTree<Value>(
    tree.key,
    tree.value,
    'left' in updates ? updates.left : tree.left,
    'right' in updates ? updates.right : tree.right,
    'color' in updates ? updates.color : tree.color,
    'isRoot' in updates ? updates.isRoot : tree.isRoot
  )
}

function rotateLeft<Value>(tree: ?RedBlackTree<Value>): RedBlackTree<Value> {
  if (!tree || !tree.right) {
    throw new Error('Tree must not be empty and must have a right child')
  }

  return updateNode(tree.right, {
    isRoot: tree.isRoot,
    left: updateNode(tree, { isRoot: false, right: tree.right.left })
  })
}

function rotateRight<Value>(tree: ?RedBlackTree<Value>): RedBlackTree<Value> {
  if (!tree || !tree.left) {
    throw new Error('Tree must not be empty and must have a left child')
  }

  return updateNode(tree.left, {
    isRoot: tree.isRoot,
    right: updateNode(tree, { isRoot: false, left: tree.left.right })
  })
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

function rebalance<Value>(t: ?RedBlackTree<Value>): RedBlackTree<Value> {
  let tree = t

  if (!tree) {
    throw new Error('Cannot rebalance an empty tree')
  }

  if (tree.color === '+black') {
    if (tree.left?.color === '-black') {
      tree = updateNode(tree, { left: rotateLeft(tree.left) })
      tree = rotateRight(tree)
      tree = updateNode(tree, {
        left: updateNode(tree.left, {
          color: 'black',
          left: updateNode(tree.left?.left, { color: 'red' })
        }),
        right: updateNode(tree.right, { color: 'black' })
      })
      tree = updateNode(tree, { left: rebalance(tree.left) })
    } else if (tree.right?.color === '-black') {
      tree = updateNode(tree, { right: rotateRight(tree.right) })
      tree = rotateLeft(tree)
      tree = updateNode(tree, {
        left: updateNode(tree.left, { color: 'black' }),
        right: updateNode(tree.right, {
          color: 'black',
          right: updateNode(tree.right?.right, { color: 'red' })
        })
      })
      tree = updateNode(tree, { right: rebalance(tree.right) })
    }
  }

  if (tree.color === 'black' || tree.color === '+black') {
    if (tree.left?.color === 'red' && tree.right?.color === 'red') {
      return updateNode(tree, {
        color: tree.isRoot ? 'black' : 'red',
        left: updateNode(tree.left, { color: 'black' }),
        right: updateNode(tree.right, { color: 'black' })
      })
    }

    if (tree.left?.color === 'red' && tree.right?.color !== 'red') {
      if (tree.left?.right?.color === 'red') {
        tree = updateNode(tree, { left: rotateLeft(tree.left) })
      }

      if (tree.left?.left?.color === 'red') {
        tree = rotateRight(tree)
        return updateNode(tree, {
          color: tree.isRoot || tree.color === '+black' ? 'black' : 'red',
          left: updateNode(tree.left, { color: 'black' }),
          right: updateNode(tree.right, { color: 'black' })
        })
      }
    }

    if (tree.left?.color !== 'red' && tree.right?.color === 'red') {
      if (tree.right?.left?.color === 'red') {
        tree = updateNode(tree, { right: rotateRight(tree.right) })
      }

      if (tree.right?.right?.color === 'red') {
        tree = rotateLeft(tree)
        return updateNode(tree, {
          color: tree.isRoot || tree.color === '+black' ? 'black' : 'red',
          left: updateNode(tree.left, { color: 'black' }),
          right: updateNode(tree.right, { color: 'black' })
        })
      }
    }
  }

  return tree
}

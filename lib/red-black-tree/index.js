import { BinarySearchTree } from 'ikeru'

export default class RedBlackTree extends BinarySearchTree {
  static fromObject(data) {
    return new RedBlackTree(
      data.key,
      data.value,
      data.left && this.fromObject(data.left),
      data.right && this.fromObject(data.right),
      data.color,
      data.isRoot
    )
  }

  constructor(
    key,
    value,
    left = null,
    right = null,
    color = 'black',
    isRoot = true
  ) {
    super(key, value, left, right)
    this.color = color
    this.isRoot = isRoot
  }

  set(key, value) {
    return rebalance(cast(super.set(key, value), this.color, this.isRoot))
  }

  delete(key) {
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
      tree = updateNode(tree, {
        color: tree.isRoot ? 'black' : '+black',
        left: updateNode(tree.left, { color: subtractBlack(tree.left.color) })
      })
    }

    if (
      (tree.left && tree.left.color === '+black') ||
      (tree.right && tree.right.color === '+black')
    ) {
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

function cast(tree, color = 'red', isRoot = false) {
  return tree instanceof RedBlackTree
    ? tree
    : new RedBlackTree(
        tree.key,
        tree.value,
        tree.left && cast(tree.left),
        tree.right && cast(tree.right),
        color,
        isRoot
      )
}

function updateNode(tree, updates) {
  return new RedBlackTree(
    tree.key,
    tree.value,
    'left' in updates ? updates.left : tree.left,
    'right' in updates ? updates.right : tree.right,
    'color' in updates ? updates.color : tree.color,
    'isRoot' in updates ? updates.isRoot : tree.isRoot
  )
}

function rotateLeft(tree) {
  return updateNode(tree.right, {
    isRoot: tree.isRoot,
    left: updateNode(tree, { isRoot: false, right: tree.right.left })
  })
}

function rotateRight(tree) {
  return updateNode(tree.left, {
    isRoot: tree.isRoot,
    right: updateNode(tree, { isRoot: false, left: tree.left.right })
  })
}

function addBlack(color) {
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

function subtractBlack(color) {
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

function rebalance(t) {
  let tree = t

  if (tree.color === '+black') {
    if (tree.left && tree.left.color === '-black') {
      tree = updateNode(tree, { left: rotateLeft(tree.left) })
      tree = rotateRight(tree)
      tree = updateNode(tree, {
        left: updateNode(tree.left, {
          color: 'black',
          left: updateNode(tree.left.left, { color: 'red' })
        }),
        right: updateNode(tree.right, { color: 'black' })
      })
      tree = updateNode(tree, { left: rebalance(tree.left) })
    } else if (tree.right && tree.right.color === '-black') {
      tree = updateNode(tree, { right: rotateRight(tree.right) })
      tree = rotateLeft(tree)
      tree = updateNode(tree, {
        left: updateNode(tree.left, { color: 'black' }),
        right: updateNode(tree.right, {
          color: 'black',
          right: updateNode(tree.right.right, { color: 'red' })
        })
      })
      tree = updateNode(tree, { right: rebalance(tree.right) })
    }
  }

  if (tree.color === 'black' || tree.color === '+black') {
    if (
      tree.left &&
      tree.left.color === 'red' &&
      tree.right &&
      tree.right.color === 'red'
    ) {
      return updateNode(tree, {
        color: tree.isRoot ? 'black' : 'red',
        left: updateNode(tree.left, { color: 'black' }),
        right: updateNode(tree.right, { color: 'black' })
      })
    }

    if (
      tree.left &&
      tree.left.color === 'red' &&
      (!tree.right || tree.right.color !== 'red')
    ) {
      if (tree.left.right && tree.left.right.color === 'red') {
        tree = updateNode(tree, { left: rotateLeft(tree.left) })
      }

      if (tree.left.left && tree.left.left.color === 'red') {
        tree = rotateRight(tree)
        return updateNode(tree, {
          color: tree.isRoot || tree.color === '+black' ? 'black' : 'red',
          left: updateNode(tree.left, { color: 'black' }),
          right: updateNode(tree.right, { color: 'black' })
        })
      }
    }

    if (
      (!tree.left || tree.left.color !== 'red') &&
      tree.right &&
      tree.right.color === 'red'
    ) {
      if (tree.right.left && tree.right.left.color === 'red') {
        tree = updateNode(tree, { right: rotateRight(tree.right) })
      }

      if (tree.right.right && tree.right.right.color === 'red') {
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

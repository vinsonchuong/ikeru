export default class BinarySearchTree {
  static fromObject(data) {
    return new BinarySearchTree(
      data.key,
      data.value,
      data.left && BinarySearchTree.fromObject(data.left),
      data.right && BinarySearchTree.fromObject(data.right)
    )
  }

  constructor(key, value, left = null, right = null) {
    this.key = key
    this.value = value
    this.left = left
    this.right = right
  }

  *[Symbol.iterator]() {
    if (this.left) {
      yield* this.left
    }

    yield this

    if (this.right) {
      yield* this.right
    }
  }

  get(key) {
    if (key < this.key) {
      return this.left ? this.left.get(key) : null
    } else if (key === this.key) {
      return this
    } else {
      return this.right ? this.right.get(key) : null
    }
  }

  set(key, value) {
    /* eslint-disable prettier/prettier */
    const updatedLeft = key < this.key
      ? this.left
        ? this.left.set(key, value)
        : new BinarySearchTree(key, value)
      : this.left
    const updatedValue = key === this.key
      ? value
      : this.value
    const updatedRight = key > this.key
      ? this.right
        ? this.right.set(key, value)
        : new BinarySearchTree(key, value)
      : this.right
    return updatedLeft !== this.left || updatedValue !== this.value || updatedRight !== this.right
      ? new BinarySearchTree(this.key, updatedValue, updatedLeft, updatedRight)
      : this
  }

  delete(key) {
    if (key < this.key) {
      const updatedLeft = this.left && this.left.delete(key)
      return updatedLeft !== this.left
        ? new BinarySearchTree(this.key, this.value, updatedLeft, this.right)
        : this
    } else if (key === this.key) {
      if (this.left && this.right) {
        let minNode = this.right
        while (minNode.left) {
          minNode = minNode.left
        }

        const tree = this.delete(minNode.key)
        return new BinarySearchTree(
          minNode.key,
          minNode.value,
          tree.left,
          tree.right
        )
      } else if (this.left) {
        return this.left
      } else if (this.right) {
        return this.right
      } else {
        return null
      }
    } else {
      const updatedRight = this.right && this.right.delete(key)
      return updatedRight !== this.right
        ? new BinarySearchTree(this.key, this.value, this.left, updatedRight)
        : this
    }
  }
}

/* @flow */

export default class BinarySearchTree<Value> {
  key: number
  value: Value
  left: ?BinarySearchTree<Value>
  right: ?BinarySearchTree<Value>

  constructor(
    key: number,
    value: Value,
    left: ?BinarySearchTree<Value> = null,
    right: ?BinarySearchTree<Value> = null
  ) {
    this.key = key
    this.value = value
    this.left = left
    this.right = right
  }

  /*:: *@@iterator(): Iterator<BinarySearchTree<Value>> {} */ // eslint-disable-line
  // $FlowFixMe
  *[Symbol.iterator]() {
    if (this.left) {
      yield* this.left
    }

    yield this

    if (this.right) {
      yield* this.right
    }
  }

  get(key: number): ?BinarySearchTree<Value> { // eslint-disable-line prettier/prettier
    if (key < this.key) {
      return this.left ? this.left.get(key) : null
    } else if (key === this.key) {
      return this
    } else {
      return this.right ? this.right.get(key) : null
    }
  }

  set(key: number, value: Value): BinarySearchTree<Value> { // eslint-disable-line prettier/prettier
    /* eslint-disable prettier/prettier */
    const updatedLeft = key < this.key
      ? this.left
        ? this.left.set(key, value)
        : new BinarySearchTree<Value>(key, value)
      : this.left
    const updatedValue = key === this.key
      ? value
      : this.value
    const updatedRight = key > this.key
      ? this.right
        ? this.right.set(key, value)
        : new BinarySearchTree<Value>(key, value)
      : this.right
    return updatedLeft !== this.left || updatedValue !== this.value || updatedRight !== this.right
      ? new BinarySearchTree<Value>(this.key, updatedValue, updatedLeft, updatedRight)
      : this
  }

  delete(key: number): ?BinarySearchTree<Value> {
    if (key < this.key) {
      const updatedLeft = this.left && this.left.delete(key)
      return updatedLeft !== this.left
        ? new BinarySearchTree<Value>(this.key, this.value, updatedLeft, this.right)
        : this
    } else if (key === this.key) {
      if (this.left && this.right) {
        let minNode = this.right
        while (minNode.left) {
          minNode = minNode.left
        }

        return new BinarySearchTree<Value>(
          minNode.key,
          minNode.value,
          this.left,
          this.right.delete(minNode.key)
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
        ? new BinarySearchTree<Value>(this.key, this.value, this.left, updatedRight)
        : this
    }
  }
}

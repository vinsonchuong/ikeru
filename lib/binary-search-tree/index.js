/* @flow */

class Node<Value> {
  key: number
  value: Value // eslint-disable-line
  left: ?Node<Value> // eslint-disable-line
  right: ?Node<Value> // eslint-disable-line

  constructor(key: number, value: Value) {
    this.key = key
    this.value = value
    this.left = null
    this.right = null
  }

  get(key: number): ?Value {
    if (key < this.key) {
      return this.left && this.left.get(key)
    } else if (key === this.key) {
      return this.value
    } else {
      return this.right && this.right.get(key)
    }
  }

  set(key: number, value: Value) {
    if (key < this.key) {
      if (this.left) {
        this.left.set(key, value)
      } else {
        this.left = new Node<Value>(key, value)
      }
    } else if (key === this.key) {
      this.value = value
    } else {
      if (this.right) {
        this.right.set(key, value)
      } else {
        this.right = new Node<Value>(key, value)
      }
    }
  }

  delete(key: number): ?Node<Value> {
    if (key < this.key && this.left) {
      this.left = this.left.delete(key)
      return this
    } else if (key === this.key) {
      if (this.left && this.right) {
        let minNode = this.right
        while (minNode.left) {
          minNode = minNode.left
        }

        minNode.right = this.right.delete(minNode.key)
        minNode.left = this.left
        return minNode
      } else if (this.left) {
        return this.left
      } else if (this.right) {
        return this.right
      } else {
        return null
      }
    } else if (this.right) {
      this.right = this.right.delete(key)
      return this
    }
  }

  /*:: *@@iterator(): Iterator<[number, Value]> {} */ // eslint-disable-line
  // $FlowFixMe
  *[Symbol.iterator]() {
    if (this.left) {
      yield* this.left
    }

    yield [this.key, this.value]

    if (this.right) {
      yield* this.right
    }
  }
}

export default class<Value> { // eslint-disable-line
  root: ?Node<Value> // eslint-disable-line

  constructor() {
    this.root = null
  }

  get(key: number): ?Value {
    return this.root ? this.root.get(key) : null
  }

  set(key: number, value: Value) {
    if (!this.root) {
      this.root = new Node<Value>(key, value) // eslint-disable-line
    } else {
      this.root.set(key, value)
    }
  }

  delete(key: number) {
    if (this.root) {
      this.root = this.root.delete(key)
    }
  }

  /*:: *@@iterator(): Iterator<[number, Value]> {} */ // eslint-disable-line
  // $FlowFixMe
  *[Symbol.iterator]() {
    if (this.root) {
      yield* this.root
    }
  }

  toJSON() {
    return this.root || null
  }
}

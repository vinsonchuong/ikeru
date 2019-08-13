# ikeru
![npm](https://img.shields.io/npm/v/ikeru.svg)
[![Build Status](https://travis-ci.org/vinsonchuong/ikeru.svg?branch=master)](https://travis-ci.org/vinsonchuong/ikeru)
[![dependencies Status](https://david-dm.org/vinsonchuong/ikeru/status.svg)](https://david-dm.org/vinsonchuong/ikeru)
[![devDependencies Status](https://david-dm.org/vinsonchuong/ikeru/dev-status.svg)](https://david-dm.org/vinsonchuong/ikeru?type=dev)

The art of arranging data

## Usage
Install [ikeru](https://yarnpkg.com/en/package/ikeru)
by running:

```sh
yarn add ikeru
```

### `BinarySearchTree`
```js
import { BinarySearchTree } from 'ikeru'

let tree = new BinarySearchTree(5, { name: 'Five' })
tree = tree.set(3, { name: 'Three' })
tree = tree.set(7, { name: 'Seven' })

console.log(tree.get(1)) // null

for (const node of tree) {
  console.log(node.key, node.value)
  // 3, { name: 'Three' }
  // 5, { name: 'Five' }
  // 7, { name: 'Seven' }
}

const serializedData = JSON.stringify(tree, null, 2)
console.log(serializedData)
// {
//   "key": 5,
//   "value": {
//     "name": "Five"
//   },
//   "left": {
//     "key": 3,
//     "value": {
//       "name": "Three"
//     },
//     "left": null
//     "right": null
//   }
//   "right": {
//     "key": 7,
//     "value": {
//       "name": "Seven"
//     },
//     "left": null
//     "right": null
//   }
// }

tree = BinarySearchTree.fromObject(JSON.parse(serializedData))
for (const node of tree) {
  console.log(node.key, node.value)
  // 3, { name: 'Three' }
  // 5, { name: 'Five' }
  // 7, { name: 'Seven' }
}

tree = tree.delete(5)

for (const node of tree) {
  console.log(node.key, node.value)
  // 3, { name: 'Three' }
  // 7, { name: 'Seven' }
}
```

### `RedBlackTree`
A `BinarySearchTree` that reorganizes itself when updated to ensure fast
reads and writes.

```js
import { RedBlackTree } from 'ikeru'

let tree = new RedBlackTree(5, { name: 'Five' })
tree = tree.set(3, { name: 'Three' })
tree = tree.set(7, { name: 'Seven' })
tree = tree.delete(5)

for (const node of tree) {
  console.log(node.key, node.value)
  // 3, { name: 'Three' }
  // 7, { name: 'Seven' }
}
```

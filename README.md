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

const tree = new BinarySearchTree()

tree.set(5, { name: 'Five' })
tree.set(3, { name: 'Three' })
tree.set(7, { name: 'Seven' })

console.log(tree.get(1)) // null
tree.get(5).description = 'mutate values'

for (const [key, value] of tree) {
  console.log(key, value)
  // 3, { name: 'Three' }
  // 5, { name: 'Five', description: 'mutate values' }
  // 7, { name: 'Seven' }
}

console.log(JSON.stringify(tree), null, 2)
// {
//   "key": 5,
//   "value": {
//     "name": "Five",
//     "description": "mutate values"
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

tree.delete(5)

for (const [key, value] of tree) {
  console.log(key, value)
  // 3, { name: 'Three' }
  // 7, { name: 'Seven' }
}
```

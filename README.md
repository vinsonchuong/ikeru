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
A sorted dictionary of number keys to arbitrary values.

Note that these trees do not self-balance. See [`RedBlackTree`](#redblacktree).

```js
import { get, set, remove, entries } from 'ikeru/binary-search-tree'

let tree
tree = set(tree, 5, { title: 'Five' })
tree = set(tree, 3, { title: 'Three' })
tree = set(tree, 7, { title: 'Seven' })

console.log(get(tree, 1))
// null

for (const node of entries(tree)) {
  console.log(node.key, node.title)
  // 3, 'Three'
  // 5, 'Five'
  // 7, 'Seven'
}

console.log(JSON.stringify(tree, null, 2))
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

tree = remove(tree, 5)

for (const node of entries(tree)) {
  console.log(node.key, node.value)
  // 3, { name: 'Three' }
  // 7, { name: 'Seven' }
}
```

### `RedBlackTree`
A [`BinarySearchTree`](#binarysearchtree) that self-balances after every update,
maintaining `O(log n)` reads and writes.

`RedBlackTree` follows the same interface as `BinarySearchTree`.

```js
import { get, set, remove, entries } from 'ikeru/red-black-tree'

let tree
tree = set(tree, 5, { title: 'Five' })
tree = set(tree, 3, { title: 'Three' })
tree = set(tree, 7, { title: 'Seven' })

for (const node of entries(tree)) {
  console.log(node.key, node.title)
  // 3, 'Three'
  // 5, 'Five'
  // 7, 'Seven'
}
```

### `TimeSeries`
`ikeru` provides various utilities for summarizing and transforming time series
data.

```js
import { merge } from 'ikeru/time-series'

const series1 = [
  { time: new Date('2019-01-01') },
  { time: new Date('2019-01-03') },
  { time: new Date('2019-01-07') }
]
const series2 = [
  { time: new Date('2019-01-02') },
  { time: new Date('2019-01-04') },
  { time: new Date('2019-01-08') }
]
const series3 = [
  { time: new Date('2019-01-05') },
  { time: new Date('2019-01-06') },
  { time: new Date('2019-01-09') }
]

const series = merge(series1, series2, series3)
```

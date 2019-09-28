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
import {
  merge, downsample, interpolate, extrapolate, window, join
} from 'ikeru/time-series'
import {
  getMonth, startOfMonth, differenceInDays, addDays, addMonths, subMonths
} from 'date-fns'

const series1 = [
  { time: Date.parse('2019-01-01') },
  { time: Date.parse('2019-02-03') },
  { time: Date.parse('2019-03-07') }
]
const series2 = [
  { time: Date.parse('2019-01-02') },
  { time: Date.parse('2019-02-04') },
  { time: Date.parse('2019-03-08') }
]
const series3 = [
  { time: Date.parse('2019-01-05') },
  { time: Date.parse('2019-02-06') },
  { time: Date.parse('2019-03-09') },
  { time: Date.parse('2019-05-03') }
]

const series = merge(series1, series2, series3)

const monthlyMissingApril = downsample(
  series,
  point => startOfMonth(point.time).getTime(),
  (time, points) => ({ time })
)

const monthly = interpolate(
  monthlyMissingApril,
  (before, after) => {
    const newPoints = []
    let point = before
    while (differenceInDays(after.time, point.time) > 1) {
      point = {
        time: addDays(point.time, 1).getTime()
      }
      newPoints.push(point)
    }
    return newPoints
  }
)

const everyMonthInYear = extrapolate(
  monthly,
  start => {
    const newPoints = []
    let point = start
    while (getMonth(point.time) > 0) {
      point = subMonths(point, 1)
      newPoints.push(point)
    }
    newPoints.reverse()
    return newPoints
  },
  end => {
    const newPoints = []
    let point = end
    while (getMonth(point.time) < 11) {
      point = addMonths(point.time, 1)
      newPoints.push(point)
    }
    return newPoints
  }
)

const firstThreeMonths = window(
  everyMonthInYear,
  Date.parse('2019-01-01'),
  Date.parse('2019-03-31')
)


const parallelSeries1 = [
  { time: Date.parse('2019-01-01'), value: 1 },
  { time: Date.parse('2019-01-02'), value: 2 },
  { time: Date.parse('2019-01-03'), value: 3 }
]
const parallelSeries2 = [
  { time: Date.parse('2019-01-01'), value: 4 },
  { time: Date.parse('2019-01-02'), value: 5 },
  { time: Date.parse('2019-01-03'), value: 6 }
]
const addedUp = join([parallelSeries1, parallelSeries2], (time, [p1, p2]) => ({
  time,
  value: p1.value + p2.value
}))
```

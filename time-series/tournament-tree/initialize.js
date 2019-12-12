/* @flow */
import type { TournamentTree } from './'

export default function<Value>(
  queues: Array<Array<Value>>,
  getKey: Value => number
): TournamentTree<Value> {
  const leafNodes = []
  let index = 0
  const numLeafNodes = 2 ** Math.ceil(Math.log2(queues.length))
  while (index < numLeafNodes) {
    if (index < queues.length) {
      const queue = queues[index]
      if (queue.length > 0) {
        const [first, ...rest] = queue
        leafNodes.push({
          queue: rest,
          key: getKey(first),
          value: first
        })
      } else {
        leafNodes.push({
          queue: [],
          key: Infinity,
          value: null
        })
      }
    } else {
      leafNodes.push({
        queue: [],
        key: Infinity,
        value: null
      })
    }
    index++
  }

  let level = leafNodes
  while (level.length > 1) {
    const nextLevel = []

    let index = 0
    while (index < level.length) {
      const parent1 = level[index]
      const parent2 = level[index + 1]
      const winner = parent1.key < parent2.key ? parent1 : parent2

      nextLevel.push({
        parent1,
        parent2,
        key: winner.key,
        value: winner.value
      })

      index += 2
    }

    level = nextLevel
  }

  return level[0]
}

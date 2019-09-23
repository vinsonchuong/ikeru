/* @flow */
import type { TournamentTree } from './'

export default function next<Value>(
  tournamentTree: TournamentTree<Value>,
  getKey: Value => number
): TournamentTree<Value> {
  if (tournamentTree.queue) {
    if (tournamentTree.queue.length > 0) {
      const [first, ...rest] = tournamentTree.queue
      return {
        queue: rest,
        key: getKey(first),
        value: first
      }
    } else {
      return {
        queue: [],
        key: Infinity,
        value: null
      }
    }
  } else {
    const parent1 =
      tournamentTree.parent1.key === tournamentTree.key
        ? next(tournamentTree.parent1, getKey)
        : tournamentTree.parent1
    const parent2 =
      tournamentTree.parent2.key === tournamentTree.key
        ? next(tournamentTree.parent2, getKey)
        : tournamentTree.parent2
    const winner = parent1.key < parent2.key ? parent1 : parent2
    return {
      parent1,
      parent2,
      key: winner.key,
      value: winner.value
    }
  }
}

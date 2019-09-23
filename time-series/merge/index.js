/* @flow */
import type { TimeSeries } from 'ikeru/time-series'
import { initialize, next } from './tournament-tree'

export default function(...timeSeriesList: Array<TimeSeries>): TimeSeries {
  function getKey(item) {
    return item.time.valueOf()
  }
  let tournamentTree = initialize(timeSeriesList, getKey)
  const merged = []
  while (tournamentTree.value) {
    merged.push(tournamentTree.value)
    tournamentTree = next(tournamentTree, getKey)
  }
  return merged
}

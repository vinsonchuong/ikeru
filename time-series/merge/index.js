/* @flow */
import type { TimeSeries } from 'ikeru/time-series'
import { initialize, next } from './tournament-tree'

export default function<Data>(
  ...timeSeriesList: Array<TimeSeries<Data>>
): TimeSeries<Data> {
  if (timeSeriesList.length === 0) {
    return []
  }
  if (timeSeriesList.length === 1) {
    return timeSeriesList[0]
  }

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

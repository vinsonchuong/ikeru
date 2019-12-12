/* @flow */
import type { TimeSeries, TimeSeriesPoint } from 'ikeru/time-series'
import { initialize, next } from '../tournament-tree'

export default function<Data>(
  timeSeriesList: Array<TimeSeries<Data>>,
  combine: (number, Array<TimeSeriesPoint<Data>>) => TimeSeriesPoint<Data>
): TimeSeries<Data> {
  if (timeSeriesList.length === 0) {
    return []
  }

  const getTime = item => item.time

  let tournamentTree = initialize(timeSeriesList, getTime)
  const groups = []
  let currentGroup = []

  while (tournamentTree.value) {
    if (currentGroup[0] && tournamentTree.value.time !== currentGroup[0].time) {
      groups.push(currentGroup)
      currentGroup = []
    }

    currentGroup.push(tournamentTree.value)
    tournamentTree = next(tournamentTree, getTime)
  }

  groups.push(currentGroup)

  return groups.map(group => combine(group[0].time.valueOf(), group))
}

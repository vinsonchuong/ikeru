/* @flow */
import type { TimeSeries } from '../'

export default function<Data>(
  timeSeries: TimeSeries<Data>,
  start: Date,
  end: Date
): TimeSeries<Data> {
  if (timeSeries.length === 0) {
    return timeSeries
  }

  let startIndex = 0
  while (
    timeSeries[startIndex].time < start &&
    startIndex < timeSeries.length
  ) {
    startIndex++
  }

  let endIndex = timeSeries.length - 1
  while (timeSeries[endIndex].time > end && endIndex > 0) {
    endIndex--
  }

  return timeSeries.slice(startIndex, endIndex + 1)
}

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
    startIndex < timeSeries.length &&
    timeSeries[startIndex].time < start
  ) {
    startIndex++
  }

  let endIndex = timeSeries.length - 1
  while (endIndex > 0 && timeSeries[endIndex].time > end) {
    endIndex--
  }

  return timeSeries.slice(startIndex, endIndex + 1)
}

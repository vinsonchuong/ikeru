/* @flow */
import test from 'ava'
import { interpolate } from 'ikeru/time-series'
import { parseISO, differenceInDays, addDays } from 'date-fns'

process.env.TZ = 'utc'

test('filling in gaps in a time series', t => {
  const series = [
    { time: parseISO('2019-01-01') },
    { time: parseISO('2019-01-03') },
    { time: parseISO('2019-01-04') },
    { time: parseISO('2019-01-06') },
    { time: parseISO('2019-01-09') }
  ]

  t.deepEqual(
    interpolate(series, (before, after) => {
      const newPoints = []
      let point = before
      while (differenceInDays(after.time, point.time) > 1) {
        point = {
          time: addDays(point.time, 1)
        }
        newPoints.push(point)
      }
      return newPoints
    }),
    [
      { time: parseISO('2019-01-01') },
      { time: parseISO('2019-01-02') },
      { time: parseISO('2019-01-03') },
      { time: parseISO('2019-01-04') },
      { time: parseISO('2019-01-05') },
      { time: parseISO('2019-01-06') },
      { time: parseISO('2019-01-07') },
      { time: parseISO('2019-01-08') },
      { time: parseISO('2019-01-09') }
    ]
  )
})

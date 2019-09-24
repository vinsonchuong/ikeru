/* @flow */
import test from 'ava'
import { parseISO, addDays, subDays } from 'date-fns'
import { extrapolate } from 'ikeru/time-series'

process.env.TZ = 'utc'

test('adding to the ends of a time series', t => {
  const series = [
    { time: parseISO('2019-01-15') },
    { time: parseISO('2019-01-16') }
  ]

  t.deepEqual(
    extrapolate(
      series,
      start => [{ time: subDays(start.time, 1) }],
      end => [{ time: addDays(end.time, 1) }]
    ),
    [
      { time: parseISO('2019-01-14') },
      { time: parseISO('2019-01-15') },
      { time: parseISO('2019-01-16') },
      { time: parseISO('2019-01-17') }
    ]
  )
})

/* @flow */
import test from 'ava'
import { window } from 'ikeru/time-series'

test('looking at a particular time range of a time series', t => {
  const series = [
    { time: Date.parse('2018-12-30') },
    { time: Date.parse('2018-12-31') },
    { time: Date.parse('2019-01-01') },
    { time: Date.parse('2019-01-03') },
    { time: Date.parse('2019-01-31') },
    { time: Date.parse('2019-02-01') },
    { time: Date.parse('2019-02-03') }
  ]

  t.deepEqual(
    window(series, Date.parse('2019-01-01'), Date.parse('2019-01-31')),
    [
      { time: Date.parse('2019-01-01') },
      { time: Date.parse('2019-01-03') },
      { time: Date.parse('2019-01-31') }
    ]
  )
})

test('not failing on an empty time series', t => {
  t.deepEqual(
    window([], Date.parse('2019-01-01'), Date.parse('2019-01-31')),
    []
  )
})

test('not failing on time series of one point', t => {
  const series = [{ time: Date.parse('2019-01-01') }]
  t.deepEqual(
    window(series, Date.parse('2019-01-01'), Date.parse('2019-01-31')),
    series
  )
})

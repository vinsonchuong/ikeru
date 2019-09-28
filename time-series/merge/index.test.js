/* @flow */
import test from 'ava'
import { merge } from 'ikeru/time-series'

test('merging 0 time series', t => {
  t.deepEqual(merge(), [])
})

test('merging 1 time series', t => {
  const series = [
    { time: Date.parse('2019-01-01') },
    { time: Date.parse('2019-01-03') },
    { time: Date.parse('2019-01-07') }
  ]

  t.deepEqual(merge(series), series)
})

test('merging multiple time series', t => {
  const series1 = [
    { time: Date.parse('2019-01-01') },
    { time: Date.parse('2019-01-03') },
    { time: Date.parse('2019-01-07') }
  ]
  const series2 = [
    { time: Date.parse('2019-01-02') },
    { time: Date.parse('2019-01-04') },
    { time: Date.parse('2019-01-08') }
  ]
  const series3 = [
    { time: Date.parse('2019-01-05') },
    { time: Date.parse('2019-01-06') },
    { time: Date.parse('2019-01-09') }
  ]
  const series4 = []

  t.deepEqual(merge(series1, series2, series3, series4), [
    { time: Date.parse('2019-01-01') },
    { time: Date.parse('2019-01-02') },
    { time: Date.parse('2019-01-03') },
    { time: Date.parse('2019-01-04') },
    { time: Date.parse('2019-01-05') },
    { time: Date.parse('2019-01-06') },
    { time: Date.parse('2019-01-07') },
    { time: Date.parse('2019-01-08') },
    { time: Date.parse('2019-01-09') }
  ])
})

test('merging time series with the same dates', t => {
  const series1 = [{ time: Date.parse('2019-01-01') }]
  const series2 = [{ time: Date.parse('2019-01-01') }]

  t.deepEqual(merge(series1, series2), [
    { time: Date.parse('2019-01-01') },
    { time: Date.parse('2019-01-01') }
  ])
})

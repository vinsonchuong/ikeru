/* @flow */
import test from 'ava'
import { merge } from 'ikeru/time-series'

test('merging multiple time series', t => {
  const series1 = [
    { time: new Date('2019-01-01') },
    { time: new Date('2019-01-03') },
    { time: new Date('2019-01-07') }
  ]
  const series2 = [
    { time: new Date('2019-01-02') },
    { time: new Date('2019-01-04') },
    { time: new Date('2019-01-08') }
  ]
  const series3 = [
    { time: new Date('2019-01-05') },
    { time: new Date('2019-01-06') },
    { time: new Date('2019-01-09') }
  ]

  t.deepEqual(merge(series1, series2, series3), [
    { time: new Date('2019-01-01') },
    { time: new Date('2019-01-02') },
    { time: new Date('2019-01-03') },
    { time: new Date('2019-01-04') },
    { time: new Date('2019-01-05') },
    { time: new Date('2019-01-06') },
    { time: new Date('2019-01-07') },
    { time: new Date('2019-01-08') },
    { time: new Date('2019-01-09') }
  ])
})

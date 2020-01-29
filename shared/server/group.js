import fs from 'fs'
import _ from 'lodash'
import geoff from './geoff'

const data = JSON.parse(fs.readFileSync('shared/server/located_long.json'))

const grouped = _(data).groupBy('countryCode')
    .mapValues( arr => arr.length )
    .mapKeys( (v, k) => geoff.alpha3ToAlpha2(geoff.numericToAlpha3(k)) )

    //.toPairs()
    //.sortBy(t => t[1])
    //.reverse()
    //.map(t => { return [  geoff.numericToAlpha3(t[0]), t[1] ] })
    .valueOf()


console.log(grouped)

fs.writeFileSync('shared/server/grouped.json', JSON.stringify(grouped))

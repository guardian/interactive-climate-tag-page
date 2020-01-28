import * as d3b from 'd3'
import * as d3gp from 'd3-geo-projection'
import { $ } from 'shared/js/util'

import articles from 'shared/server/located.json'
import countries from 'shared/server/countries.json'

import world from 'world-atlas/countries-110m.json'
import * as topojson from 'topojson'

import React, { render } from 'react'
import App from './components/App'

// const d3 = Object.assign({}, d3b, d3gp)

// const countriesFc = topojson.feature(world, world.objects.countries)

// const draw = () => {

//     const svgEl = $('.cc-map')
//     const width = svgEl.getBoundingClientRect().width
//     const height = width*0.67

//     const svg = d3.select(svgEl)
//         .attr('width', width)
//         .attr('height', height)

//     const proj = d3.geoWinkel3()
//         .fitSize([ width, height ], { type : 'Sphere' })

//     const path = d3.geoPath().projection(proj)

//     const outline = svg.append('path')
//         .attr('d', path({ type : 'Sphere' }))
//         .attr('class', 'cc-outline')

//     const headsDiv = d3.select('.cc-headlines')

//     const articleDivs = headsDiv
//         .selectAll('blah')
//         .data(articles)
//         .enter()
//         .append('div')
//         .attr('class', 'cc-box')

//     articleDivs.append('a')
//         .html(d => d.headline)
//         .attr('class', 'cc-boxlink')
//         .attr('href', d => d.url)
        

//     const countryShapes = svg
//         .selectAll('blah')
//         .data(countriesFc.features)
//         .enter()
//         .append('path')
//         .attr('d', path)
//         .attr('class', 'cc-country')

//     const bubbles = svg
//         .selectAll('blah')
//         .data(articles)
//         .enter()
//         .append('circle')
//         .each( function(d, i) {

//             const el = d3.select(this)

//             const entry = countries.find(o => o.name === d.imgLocation)

//             if(entry) {

//             const p = proj([ entry.lng, entry.lat ])

//             el.attr('cx', p[0])
//                 .attr('cy', p[1])
//                 .attr('r', 6)
//                 .attr('class', 'cc-bubble')

//             }

//         } )


// }

render(<App articles={articles} />, $('.cc-container'))
import React from 'react'
import * as d3b from 'd3'
import * as d3gp from 'd3-geo-projection'

import world from 'world-atlas/countries-50m.json'
import lw from 'world-atlas/land-50m.json'
import countries from 'shared/server/countries'

import grouped from 'shared/server/grouped.json'
import { Delaunay } from 'd3-delaunay'
import { numberWithCommas } from 'shared/js/util'

const codeToName = {}

countries.forEach( row => {

    codeToName[row.code] = row.name

} )

codeToName['GB'] = 'UK'
codeToName['US'] = 'US'

import * as topojson from 'topojson'

const countriesFc = topojson.feature(world, world.objects.countries)
const landFc = topojson.feature(lw, lw.objects.land)

const d3 = Object.assign({}, d3b, d3gp)

const lab = (code, val) => {
    return `<tspan class='cc-cname'>${codeToName[code]}</tspan><tspan class='cc-val' dx='3' >${numberWithCommas(val)}</tspan>`
}

class App extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            selected : null
        }

        this.setSvg = node => this.svg = node
        this.setBubbleSvg = node => this.bubbleSvg = node
        this.drawMap = this.drawMap.bind(this)
        this.updateMap = this.updateMap.bind(this)
        this.hover = this.hover.bind(this)
        
    }

    drawMap () {

        const width = this.svg.getBoundingClientRect().width
        const height = width*0.61

        const svg = d3.select(this.svg)
            .attr('width', width)
            .attr('height', height - 12)

        const proj = d3.geoNaturalEarth()
            .fitSize([ width, height ], { type : 'Sphere' })

        const path = d3.geoPath().projection(proj)

        const outline = svg.append('path')
            .attr('d', path({ type : 'Sphere' }))
            .attr('class', 'cc-outline')

        const landShapes = svg
            .selectAll('blah')
            .data(landFc.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'cc-land')

        const countryShapes = svg
                .selectAll('blah')
                .data(countriesFc.features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('class', f => {

                    if(this.props.mapArticles.some( obj => {

                        return String(obj.countryCode) === String(f.id)

                    } )){
                        return 'cc-country cc-country--hl'
                    }
                    return 'cc-country'

                })

            this.setState({ countryShapes })

    }

    updateMap() {

        const { selected, countryShapes } = this.state

        console.log('highlighting:', selected)
        
        countryShapes.attr('class', f => {

            if(!selected) {

                return this.props.mapArticles.some( obj => {
                    return String(obj.countryCode) === String(f.id)
                } ) ? 'cc-country cc-country--hl' : 'cc-country'

            }

            if(selected === f.id) {
                return 'cc-country cc-country--hl'
            }

            if(this.props.mapArticles.some( obj => {

                return String(obj.countryCode) === String(f.id)

            } )){
                return 'cc-country cc-country--hl cc-country--faded'
            }
            return 'cc-country'

        })

    }

    drawBubbleMap() {

        const width = this.svg.getBoundingClientRect().width
        const height = width*0.61
    
        const svg = d3.select(this.bubbleSvg)
            .attr('width', width)
            .attr('height', height - 12)
    
        const proj = d3.geoNaturalEarth()
            .fitSize([ width, height ], { type : 'Sphere' })
    
        const path = d3.geoPath().projection(proj)
    
        const outline = svg.append('path')
            .attr('d', path({ type : 'Sphere' }))
            .attr('class', 'cc-outline')
    
        const landShapes = svg
            .selectAll('blah')
            .data(landFc.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'cc-land')

        const rScale = d3.scaleSqrt()
            .domain([ 0, 1000 ])
            .range([0, 40])

        const countriesF = countries.filter( c => grouped[c.code] )
            .sort((a, b) => grouped[b.code] - grouped[a.code])

        const delaunay = Delaunay.from( countriesF
            .map( c => {
                return proj([c.lng, c.lat])
            } ))

        const voro = delaunay.voronoi([ 0, 0, width, height ])

        console.log(voro)

        const bubbles = svg
            .selectAll('blah')
            .data(countriesF)
            .enter()
            .append('g')

            .each(function(d, i) {

                const el = d3.select(this)

                const p = proj([d.lng, d.lat])

                console.log(grouped[d.code])

                el.attr('transform', `translate(${p[0]}, ${p[1]})`)

                el
                    .append('circle')
                    .attr('r', rScale(grouped[d.code]))
                    .attr('class', 'cc-bubble')

            })

        const labels = svg
        .selectAll('blah')
        .data(countriesF)
        .enter()
        .append('text')
        .each(function(d, i) {

            const el = d3.select(this)

            const p = proj([d.lng, d.lat])

            el.attr('x', p[0])
            .attr('y', p[1] - rScale(grouped[d.code]) - 6)
            .html(lab(d.code, grouped[d.code]))
                .attr('class', 'cc-label')

        })

        const voroCells = svg
            .selectAll('blah')
            .data(countriesF)
            .enter()
            .append('path')
            .attr('d', (d, i) => {

                return voro.renderCell(i)

            })
            .attr('class', 'cc-voro')
            .on('mouseenter', (d, i) => {

                console.log('mouseenter')

                labels
                    
                    .classed('cc-label--shown', (d, j) => j === i)

            })

    }

    hover (code) {

        console.log('hovering ...')

        this.setState({ selected : code })

    }

    render() {

        const { articles, mapArticles } = this.props
        const { selected } = this.state

        return <div>

            <h3 class='cc-prehead'>Environment <span class='cc-tri'></span> Climate change</h3>
            <h2 class='cc-head'>The world today in climate news</h2>
            <p class='cc-date'>28 January 2020</p>

            <div className='cc-headlines'>

            <div className='cc-list cc-list--left'
            onMouseOut={ () => this.hover(null) }>
            { articles.slice(0, 4).map( obj => {
                console.log(obj)
                const toneTag = obj.tags.find(d => d.id.indexOf('tone/') > -1)
                const tone = toneTag ? toneTag.id.split('/')[1] : 'no-tone'
                const firstTag = obj.tags[0]
                let prefix = null


                if (firstTag.id.indexOf('/series/') > -1) {
                    prefix = firstTag.title
                }

                const headline = firstTag.title === 'Opinion' ? obj.headline.split('|')[0] : obj.headline
                const byline = firstTag.title === 'Opinion' ? obj.headline.split('|')[1] : ''

                return <a className='cc-hyperlink' href={obj.url} target="_blank"><div className={`cc-box ge-background--${tone === 'comment' ? 'comment-light' : '#f6f6f6'} ge-border-color--${tone} ${byline ? 'cc-box-opinion' : ''}`}
                onMouseOver={ () => this.hover(obj.countryCode) }
                >   <span class={`cc-prefix ge-color--${tone}`}>{prefix ? prefix + ' / ' : ''}</span><h2 className='cc-boxlink'>{headline}</h2>
                    <div class={`cc-byline ge-color--${'comment'}`}>{byline}</div>
                    </div></a>

            } ) }
            </div>

            <svg className='cc-map' ref={this.setSvg} ></svg>

            <div className='cc-list cc-list--right'
            onMouseOut={ () => this.hover(null) }>
            { articles.slice(4, 8).map( obj => {
                console.log(obj)
                const toneTag = obj.tags.find(d => d.id.indexOf('tone/') > -1)
                const tone = toneTag ? toneTag.id.split('/')[1] : 'no-tone'
                const firstTag = obj.tags[0]
                let prefix = null


                if (firstTag.id.indexOf('/series/') > -1) {
                    prefix = firstTag.title
                }


                const headline = firstTag.title === 'Opinion' ? obj.headline.split('|')[0] : obj.headline
                const byline = firstTag.title === 'Opinion' ? obj.headline.split('|')[1] : ''

                return <a className='cc-hyperlink' href={obj.url} target="_blank"><div className={`cc-box ge-background--${tone === 'comment' ? 'comment-light' : '#f6f6f6'} ge-border-color--${tone} ${byline ? 'cc-box-opinion' : ''}`}
                onMouseOver={ () => this.hover(obj.countryCode) }
                >   <span class={`cc-prefix ge-color--${tone}`}>{prefix ? prefix + ' / ' : ''}</span><h2 className='cc-boxlink'>{headline }</h2>
                    <div class={`cc-byline ge-color--${'comment'}`}>{byline}</div>
                    </div></a>

            } ) }
            </div>
        </div>

        <h2 class='cc-head cc-head-transformed'>More climate news</h2>

        <div class='cc-list-section'>
            <ul className='cc-list-ul'>
                {

                    articles.slice(8, 8 + 12).map( o => {

                    return <a className='cc-list-a' target='_blank' href={o.url}><li className='cc-list-li'>{o.headline}</li></a>

                    } )

                }
            </ul>

            <button class='cc-more'>
            <span class="inline-plus inline-icon ">
<svg width="18" height="18" viewBox="0 0 18 18" class="inline-plus__svg inline-icon__svg">
<path d="M8.2 0h1.6l.4 7.8 7.8.4v1.6l-7.8.4-.4 7.8H8.2l-.4-7.8L0 9.8V8.2l7.8-.4.4-7.8z"></path>
</svg> </span>
                
                <span>More news</span></button>

        </div>

            <h2 class='cc-head'>The Guardian's climate reporting mapped</h2>
            <p class='cc-date'>based on 5,000 articles</p>

            <svg className='cc-bubblemap' ref={this.setBubbleSvg} ></svg>
        </div>

    }

    componentDidMount() {
        this.drawMap()
        this.drawBubbleMap()
    }

    componentDidUpdate(prevProps, prevState) {

        console.log(prevState.selected, this.state.selected)

        if(prevState.selected !== this.state.selected) {
            console.log('updating map ...')
            this.updateMap()
        }

    }
}

export default App
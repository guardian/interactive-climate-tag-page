import React from 'react'
import * as d3b from 'd3'
import * as d3gp from 'd3-geo-projection'

import world from 'world-atlas/countries-50m.json'
import lw from 'world-atlas/land-50m.json'
import countries from 'shared/server/countries'

import grouped from 'shared/server/grouped.json'

import * as topojson from 'topojson'

const countriesFc = topojson.feature(world, world.objects.countries)
const landFc = topojson.feature(lw, lw.objects.land)

const d3 = Object.assign({}, d3b, d3gp)

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

                    if(this.props.articles.some( obj => {

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

                return this.props.articles.some( obj => {
                    return String(obj.countryCode) === String(f.id)
                } ) ? 'cc-country cc-country--hl' : 'cc-country'

            }

            if(selected === f.id) {
                return 'cc-country cc-country--hl'
            }

            if(this.props.articles.some( obj => {

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

        const bubbles = svg
            .selectAll('blah')
            .data(countries)
            .enter()
            .append('circle')
            .each(function(d, i) {

                const el = d3.select(this)

                const p = proj([d.lng, d.lat])

                console.log(grouped[d.code])

                el
                    .attr('cx', p[0])
                    .attr('cy', p[1])
                    .attr('r', rScale(grouped[d.code]))
                    .attr('class', 'cc-bubble')

            })

    }

    hover (code) {

        console.log('hovering ...')

        this.setState({ selected : code })

    }

    render() {

        const { articles } = this.props
        const { selected } = this.state

        return <div>

            <h3 class='cc-prehead'>Climate change</h3>
            <h2 class='cc-head'>The world today in climate news</h2>
            <p class='cc-date'>28 January 2020</p>

            <div className='cc-headlines'>

            <div className='cc-list cc-list--left'
            onMouseOut={ () => this.hover(null) }>
            { articles.slice(0, 4).map( obj => {

                return <a className='cc-hyperlink' href={obj.url} target="_blank"><div className='cc-box'
                onMouseOver={ () => this.hover(obj.countryCode) }
                >
                    <h2 className='cc-boxlink'>
                        { obj.headline }</h2>
                    </div></a>

            } ) }
            </div>

            <svg className='cc-map' ref={this.setSvg} ></svg>

            <div className='cc-list cc-list--right'
            onMouseOut={ () => this.hover(null) }>
            { articles.slice(4, 8).map( obj => {

                return <a className='cc-hyperlink' href={obj.url} target="_blank"><div className='cc-box'
                onMouseOver={ () => this.hover(obj.countryCode) }
                >
                    <h2 className='cc-boxlink'>{ obj.headline }</h2>
                    </div></a>

            } ) }
            </div>
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
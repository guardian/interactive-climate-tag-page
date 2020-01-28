import React from 'react'
import * as d3b from 'd3'
import * as d3gp from 'd3-geo-projection'

import world from 'world-atlas/countries-110m.json'
import * as topojson from 'topojson'

const countriesFc = topojson.feature(world, world.objects.countries)

const d3 = Object.assign({}, d3b, d3gp)

class App extends React.Component {

    constructor(props) {
        super(props)

        this.setSvg = node => this.svg = node
        this.drawMap = this.drawMap.bind(this)
        
    }

    drawMap () {

        const width = this.svg.getBoundingClientRect().width
        const height = width*0.61

        const svg = d3.select(this.svg)
            .attr('width', width)
            .attr('height', height)

        const proj = d3.geoWinkel3()
            .fitSize([ width, height ], { type : 'Sphere' })

        const path = d3.geoPath().projection(proj)

        const outline = svg.append('path')
            .attr('d', path({ type : 'Sphere' }))
            .attr('class', 'cc-outline')

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

    }

    render() {

        const { articles } = this.props

        return <div>

            <h3 class='cc-prehead'>Climate change</h3>
            <h2 class='cc-head'>Around the world</h2>

            <div className='cc-headlines'>

            <div className='cc-list cc-list--left'>
            { articles.slice(0, 4).map( obj => {

                return <div className='cc-box'>
                    <h2 className='cc-boxlink'>{ obj.headline }</h2>
                    </div>

            } ) }
            </div>

            <svg className='cc-map' ref={this.setSvg} ></svg>

            <div className='cc-list cc-list--right'>
            { articles.slice(4, 8).map( obj => {

                return <div className='cc-box'>
                    <h2 className='cc-boxlink'>{ obj.headline }</h2>
                    </div>

            } ) }
            </div>
        </div>
        </div>

    }

    componentDidMount() {
        this.drawMap()
    }
}

export default App
import fs from 'fs'
import geoff from './geoff'

const guessLocation = entry => {

    const textLocations = entry.textLocations.map( str => {

        return str
            .replace('’s', '')
            .replace(/^“/g, '')
            .replace(/[:;,.)]$/g, '')

    } )

    const worldTags = entry.tags.filter(t => t.id.startsWith('world/'))
        .map( t => t.id.split('/').slice(-1)[0].replace('-', ' ') )

    
    const textCountries = textLocations.map( str => {

        return geoff.parseName(str)

    } )
    .map( c => c.toAlpha3() )
    .filter( d => d )

    const tagCountries = worldTags
        .map( str => geoff.parseName(str) )
        .map( c => c.toAlpha3() )
        .filter( d => d )

    const imgCountry = geoff.parseName(entry.imgLocation).toAlpha3()

    const scores = {}

    if(entry.tags.map(t => t.id).includes('uk/uk')) {
        scores['GBR'] = 5
    }
    if(entry.tags.map( t => t.id ).includes('us-news/us-news')) {
        scores['USA'] = 5
    }

    if(imgCountry) {
        scores[imgCountry] = scores[imgCountry] ? scores[imgCountry] + 2 : 2
    }

    textCountries.forEach( code => {
        if(!scores[code]) {
            scores[code] = 1
        } else {
            scores[code] += 1
        }
    } )

    tagCountries.forEach( code => {
        if(!scores[code]) {
            scores[code] = 3
        } else {
            scores[code] += 3
        }
    } )

    if(Object.entries(scores).length > 0) {

    const top = Object.entries(scores).sort((a, b) => {
        return b[1] - a[1]
    })[0][0]

    return geoff.alpha3ToNumeric(top)
    } else {
        return null
    }

}


const data = JSON.parse(fs.readFileSync('shared/server/parsed_short.json'))

    .filter( d => d )

    .map( (entry, i ) => {

        console.log(i)

        const code = guessLocation(entry)

        return Object.assign({}, entry, { countryCode : code })

    } )
    .filter( d => d )

console.log(data.length)


fs.writeFileSync('shared/server/located_short.json', JSON.stringify(data, null, 2))
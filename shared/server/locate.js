import fs from 'fs'
import geoff from './geoff'

const data = JSON.parse(fs.readFileSync('shared/server/parsed.json'))
    .map( entry => {

        if(entry.imgLocation) {

            const country = geoff.parseName(entry.imgLocation)
            const numeric = country.toNumeric()
            return Object.assign({}, entry, { countryCode : numeric })

        }

    } )
    .filter( d => d )


fs.writeFileSync('shared/server/located.json', JSON.stringify(data, null, 2))
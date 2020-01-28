import fs from 'fs'
import sync from 'csv-parse/lib/sync'

const data = sync(fs.readFileSync('shared/server/countries.tsv'),
{ delimiter : '\t', columns : true })
    .map( row => {

        return {
            code : row.country,
            name : row.name,
            lat : Number(row.latitude),
            lng : Number(row.longitude)
        }

    } )

fs.writeFileSync('shared/server/countries.json', JSON.stringify(data))
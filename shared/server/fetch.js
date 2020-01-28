import fetch from 'node-fetch'
import config from './config.json'
import fs from 'fs'
import nlp from 'compromise'

const url = `https://content.guardianapis.com/environment/climate-change?format=json&api-key=${config.key}&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all`

fetch(url).then( resp => resp.json() )
    .then( data => {
        
        const results = data.response.results

        const ex = results[0].fields.body

        console.log(ex)

        const places = nlp(ex).places()
        console.log(places.out('array'))

    })
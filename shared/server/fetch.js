import fetch from 'node-fetch'
import config from './config.json'
import fs from 'fs'
import nlp from 'compromise'

const url = `https://content.guardianapis.com/environment/climate-change?format=json&api-key=${config.key}&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all`

const out = []

const save = (obj, i) => {

    out[i] = obj

    fs.writeFileSync('shared/server/parsed_long.json', JSON.stringify(out, null, 2))

}


const parse = (article, i) => {


    const text = article.fields.body
    const mainMedia = article.elements.find( obj => obj.relation === 'main' )

    const textLocations = nlp(text).places().out('array')

    const headline = article.webTitle
    const trail = article.fields.trailText

    const articleUrl = article.webUrl

    const tags = article.tags.map( o => {
        return { id : o.id, title : o.webTitle }
    } )

    const parsed = {

        headline,
        trail,
        tags,
        url : articleUrl,
        textLocations
    }

    try {

    const url = mainMedia.assets[0].typeData.mediaApiUri
    console.log(url)

    fetch(url, {
        'headers': { 'Cookie' : '_ga=GA1.3.1554421536.1567680633; cto_lwid=23c26aeb-8be8-48c9-a0d6-329e5fb53374; __gads=ID=2449a78b568fcae6:T=1567680633:S=ALNI_MbQ0SDZgWx77F5StCvApzjPoP-o2Q; _gid=GA1.3.1286121082.1580120300; permutive-session=%7B%22session_id%22%3A%22ad1081c1-bdb0-4ba9-87a1-bca51705c7c1%22%2C%22last_updated%22%3A%222020-01-28T09%3A36%3A05.258Z%22%7D; gutoolsAuth-assym=Zmlyc3ROYW1lPU5pa28mbGFzdE5hbWU9S29tbWVuZGEmZW1haWw9bmlrb2xhdXMua29tbWVuZGFAZ3VhcmRpYW4uY28udWsmYXZhdGFyVXJsPWh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BQXVFN21ELURZTFVqY2hfaUk0R3hqSVBfMlhiTXpncktEWm1MUTR2b3dpVEtnJnN5c3RlbT1tZWRpYS1zZXJ2aWNlJmF1dGhlZEluPW1lZGlhLXNlcnZpY2UmZXhwaXJlcz0xNTgwMjQ1MTI3MDAwJm11bHRpZmFjdG9yPXRydWU=.TFdnMOQhGIhe4ouTrpT3ptSB5k7q2VMXp2mErDRsZfP3UA0hVW26FkT4f5tT1BfExd0RqQ1cnrd5ocp1btk6VIfzG2b+v3vTJ7VIiVU01++jeOrXSjo3yb0irDFR1H2N1/D4Hvt/FObRm1oeESj8wUP7/1TN+ha/zoF/QzsoqDBvjUjho2qbhlZ1xBS/0uWwLiV6or/dldLV7RLUnZ4qWLelSuv5DcD25VXXdf3COmdmG48NWAuAOMXuPmsRpHD84UbYjU98ABHAQYBLMiJ7oAman7PmC2Hmy4NJUNMxlDrjBcqOrWd9LEjtskTQRECCoTpNQ9YGmMN0iDGG7qcqU/Zpd1WCRYt3iBfxRvoIvIRgR/iBK4awp4n8ad0FQg2IRr7RjuC09trKj7TUmroQWNwefCJHeyt9j/98ZdYrO3vF84JYUuIK76Oh0Yrx1W5qwE7ZHCaauqb9u0g/p9D7iRemIWbO4CEp1w0UxyN/BBBMlO7/9CRkWf42mWogYUznRmxiGVUjB2wW+OJVepZEdD2a2RxTZIY21pQ2RrR8q2rPTSopgAwyvVQH580v1vzl+T26Js0RcSJMVUhjvPQrQKjYgmLaLlb8s1X+c0EnlAZOunVu/2FPhNk/S2L85M/3R4Z3QloEa5ZVhQRydp7Xd63Dk0xAf9xUoZx6YYyr6QU=; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImNzcmZUb2tlbiI6ImQyNzQ0NGEwOWM2ODI5ODc0ZWM0MDQxZGNlNjY0YzA3MzkwNGVjZjItMTU4MDI0MTYzODc4Ny0wYzgxYzEyNjliYTM4OWM1NDJhYjFjNTgifSwibmJmIjoxNTgwMjQxNjM4LCJpYXQiOjE1ODAyNDE2Mzh9.LwK0g_UJ8R9INfBL5PQhciaAjYHA0gtzlRbLyu9K9LE' }
    }).then( resp => resp.json() )
        .then( obj => {

            parsed.imgLocation = obj.data.originalMetadata.country
            save(parsed, i)
        })
        .catch(err => {
            console.log('img error')
            save( parsed, i )
        })

    } catch(err) {
        save(parsed, i)
    }
    

}

const pages = Array(25).fill().map((_, i) => i)

const ps = pages.map( i => {

    return fetch(url + '&page-size=200&page=' + (i + 1)).then( resp => resp.json() )

} )

const flatten = arr => {
    return arr.reduce((interm, cur) => {
        return interm.concat(cur)
    }, [])
}

Promise.all(ps).then( arr => {

    const results = flatten(arr.map( data => data.response.results ))
    console.log(results)
    results.forEach(parse)

} )

// fetch(url).then( resp => resp.json() )
//     .then( data => {
        
//         const results = data.response.results

//         results.forEach(parse)

//     })
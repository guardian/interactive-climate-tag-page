import fetch from 'node-fetch'
import config from './config.json'
import fs from 'fs'
import nlp from 'compromise'

const url = `https://content.guardianapis.com/environment/climate-change?format=json&api-key=${config.key}&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all`

const out = []

const save = (obj, i) => {

    out[i] = obj

    fs.writeFileSync('shared/server/parsed_short.json', JSON.stringify(out, null, 2))

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
        'headers': { 'Cookie' : '_ga=GA1.3.1554421536.1567680633; cto_lwid=23c26aeb-8be8-48c9-a0d6-329e5fb53374; __gads=ID=2449a78b568fcae6:T=1567680633:S=ALNI_MbQ0SDZgWx77F5StCvApzjPoP-o2Q; _gid=GA1.3.1286121082.1580120300; permutive-session=%7B%22session_id%22%3A%22ad1081c1-bdb0-4ba9-87a1-bca51705c7c1%22%2C%22last_updated%22%3A%222020-01-28T09%3A36%3A05.258Z%22%7D; _gat=1; gutoolsAuth-assym=Zmlyc3ROYW1lPU5pa28mbGFzdE5hbWU9S29tbWVuZGEmZW1haWw9bmlrb2xhdXMua29tbWVuZGFAZ3VhcmRpYW4uY28udWsmYXZhdGFyVXJsPWh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BQXVFN21ELURZTFVqY2hfaUk0R3hqSVBfMlhiTXpncktEWm1MUTR2b3dpVEtnJnN5c3RlbT1tZWRpYS1zZXJ2aWNlJmF1dGhlZEluPW1lZGlhLXNlcnZpY2UmZXhwaXJlcz0xNTgwMjk2OTU1MDAwJm11bHRpZmFjdG9yPXRydWU=.qOs0Gc4YomW6vNwUQTo5rG7sh1Yn5HqoTUgAcg2rK39HK2paNnngL7KwV1w0ALvFT33YzEjlDsw4uryGUu6dvO08GnctTERe1V0fUFgfH3mnHZ2a+HdroypLzeeE7rV883djXUHe36GhQBeG3HSiDH7AV05e8g0+BXIZr12Ewx71cjYHnc3mzhtlinbFJ7B/X+I5wxmFLTeTEPftsfl7CtnOs9lUorhCdP657ubs1rUiJVRj7bNw6HjYKxYOTYDXUMaoHGXtVHa7sT5yVjJZJ258Xm2+/4z4lPGbyIpqbsECltjl4xShKuvxGIj8uBO6oOvqX3kIZgjjZpyDwmqp0wu7aOQt0b3EJ13kz2kCP6USMQ+AZgGo5oAGl3zFfYM9f/5s+OhcZ+zNvS+YMr1mpTlpzMh6Pd/RAiw4akEgQyNosbU1SCGSXYaqnW92f34eBXyllfEEe1GkoeaqgNHhJebmGWLTDR6C2bTZoCgxMLbbVcyUpDwGzf0xvnOcokF9mCpK9dAPFqN7jLqtPpWlO8XEaaJvxQMU4xk37Wg5DCZlsOIslvkW9GWY6e+/9iSJY0Nb2zBIZnpBJad6Jg3PH3y/hEAEYgaxNFncZkkdUbd/pN1xTmbA2yYuPuKIbmeTTifm1dcrYAOC0ObZjvsF06nw1Bcr1CWdHyyasluyulI=; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImNzcmZUb2tlbiI6ImIxYzQ3MzdlYWJhYjZmOTg2ZGEwNTQ5ZWI4NDRkZDk2Yzc1MjBkYTItMTU4MDI5MzM2MTk5MS1iMWQyNjYyMGZmNzM5MzU3YjcxMjk2ZWEifSwibmJmIjoxNTgwMjkzMzYxLCJpYXQiOjE1ODAyOTMzNjF9.ifqcbKPkGw355VqcmM3ylk3f-ySFWI3pwDbaQ8L2jVc' }
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

const pages = Array(1).fill().map((_, i) => i)

const ps = pages.map( i => {

    return fetch(url + '&page-size=100&page=' + (i + 1)).then( resp => resp.json() )

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
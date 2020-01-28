import fetch from 'node-fetch'
import config from './config.json'
import fs from 'fs'
import nlp from 'compromise'

const url = `https://content.guardianapis.com/environment/climate-change?format=json&api-key=${config.key}&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all`

const out = []

const save = (obj, i) => {

    out[i] = obj

    fs.writeFileSync('shared/server/parsed.json', JSON.stringify(out, null, 2))

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

    const url = mainMedia.assets[0].typeData.mediaApiUri
    console.log(url)

    fetch(url, {
        'headers': { 'Cookie' : '_ga=GA1.3.1554421536.1567680633; cto_lwid=23c26aeb-8be8-48c9-a0d6-329e5fb53374; __gads=ID=2449a78b568fcae6:T=1567680633:S=ALNI_MbQ0SDZgWx77F5StCvApzjPoP-o2Q; _gid=GA1.3.1286121082.1580120300; permutive-session=%7B%22session_id%22%3A%22ad1081c1-bdb0-4ba9-87a1-bca51705c7c1%22%2C%22last_updated%22%3A%222020-01-28T09%3A36%3A05.258Z%22%7D; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImNzcmZUb2tlbiI6ImQ3YTRjODM2NGM1MTc2MTE4NjQ2MDE4OWFkMWM0OTYwNjdkMmZkNzAtMTU4MDIwOTc3MTc4NC1kNDNjMWE2NGFjNTE4NzY3Njc0NzU1YWMifSwibmJmIjoxNTgwMjA5NzcxLCJpYXQiOjE1ODAyMDk3NzF9.Wlyb9Ba6px_V_f2tW-S5JeymK05PTNbYbF4u2BXg9Yo; gutoolsAuth=Zmlyc3ROYW1lPU5pa28mbGFzdE5hbWU9S29tbWVuZGEmZW1haWw9bmlrb2xhdXMua29tbWVuZGFAZ3VhcmRpYW4uY28udWsmYXZhdGFyVXJsPWh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BQXVFN21ELURZTFVqY2hfaUk0R3hqSVBfMlhiTXpncktEWm1MUTR2b3dpVEtnJnN5c3RlbT1tZWRpYS1zZXJ2aWNlJmF1dGhlZEluPW1lZGlhLXNlcnZpY2UsY29tcG9zZXImZXhwaXJlcz0xNTgwMjEyNTU4MDAwJm11bHRpZmFjdG9yPXRydWU=>>542061ad6b82a20c06c2937cb77e9cc70ec65b65; _gat=1; gutoolsAuth-assym=Zmlyc3ROYW1lPU5pa28mbGFzdE5hbWU9S29tbWVuZGEmZW1haWw9bmlrb2xhdXMua29tbWVuZGFAZ3VhcmRpYW4uY28udWsmYXZhdGFyVXJsPWh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BQXVFN21ELURZTFVqY2hfaUk0R3hqSVBfMlhiTXpncktEWm1MUTR2b3dpVEtnJnN5c3RlbT1tZWRpYS1zZXJ2aWNlJmF1dGhlZEluPW1lZGlhLXNlcnZpY2UsY29tcG9zZXImZXhwaXJlcz0xNTgwMjI5NzUxMDAwJm11bHRpZmFjdG9yPXRydWU=.b7BjFsu6eM/LB0G966ZcNrnM42aq1ulH4LzzqUdF086zn7mYDJFPl15+zIQYOBbUfhtpiw5cCHketc6OFBI17lon24kDZdsyRgDLJFCzpIlqep8o15zpJOk1cBbEG3lk96rWcpwo+veIVdiSg05OZL42NwnpDsr6qHolEDqrtHxpDpct6gIp8bLLhMEvZYz1fXWc/HLgVkNcD5ZDcwoCF3vLMpfZKfrTz8Utv+s8Kwq8DFAE993dWwbxkXtMd03sG/8DOizJ6kQ9M3mgXE9QGoSlSExINT1lNOF3esI4L6tzYaJVezDI08LuuMdQ5mXvIvLOlN/0oAsppw37mp3vx4zBIyGtVL7yZNSmbLyx3+2MbTqrTjZq/O6E9IgdTRKhh6LpvRwbfmRWUnkFssOq1FrvebjoGbu3sYxXW3M9ddJsIt7VEKbGdQLIbm6u42jtJL/IWs34Xp8DJfm9FYpco43MnyM6x7hzIrF5YuU9/gzsAafJ8j79mvkJZd2fmxKr1voI9DbfhETCINaIsAZgKrf31mrtdaTZeG6YLBHjqN3o/WIT5cgUehvJRiQAQEejRkw/x3MMCLIiNfFUrb5qK79ww6hkfay3g8pHCnV8suVAdKjKlXmC1XKm7dtCOjB037CAAFLzT5wm4G8pvzZuuEy3Pb1xkZa7+32xaX+/U4w=' }
    }).then( resp => resp.json() )
        .then( obj => {

            parsed.imgLocation = obj.data.originalMetadata.country
            save(parsed, i)
        })
        .catch(err => {
            console.log('img error')
            save( parsed, i )
        })
    

}

fetch(url).then( resp => resp.json() )
    .then( data => {
        
        const results = data.response.results

        results.forEach(parse)

    })
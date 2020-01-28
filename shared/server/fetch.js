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

    console.log(article.fields)

    const text = article.fields.body
    const mainMedia = article.elements.find( obj => obj.relation === 'main' )

    const textLocations = nlp(text).places().out('array')

    const parsed = { textLocations }

    const url = mainMedia.assets[0].typeData.mediaApiUri
    console.log(url)

    fetch(url, {
        'headers': { 'Cookie' : '_ga=GA1.3.1554421536.1567680633; cto_lwid=23c26aeb-8be8-48c9-a0d6-329e5fb53374; __gads=ID=2449a78b568fcae6:T=1567680633:S=ALNI_MbQ0SDZgWx77F5StCvApzjPoP-o2Q; _gid=GA1.3.1286121082.1580120300; permutive-session=%7B%22session_id%22%3A%22ad1081c1-bdb0-4ba9-87a1-bca51705c7c1%22%2C%22last_updated%22%3A%222020-01-28T09%3A36%3A05.258Z%22%7D; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImNzcmZUb2tlbiI6ImQ3YTRjODM2NGM1MTc2MTE4NjQ2MDE4OWFkMWM0OTYwNjdkMmZkNzAtMTU4MDIwOTc3MTc4NC1kNDNjMWE2NGFjNTE4NzY3Njc0NzU1YWMifSwibmJmIjoxNTgwMjA5NzcxLCJpYXQiOjE1ODAyMDk3NzF9.Wlyb9Ba6px_V_f2tW-S5JeymK05PTNbYbF4u2BXg9Yo; gutoolsAuth=Zmlyc3ROYW1lPU5pa28mbGFzdE5hbWU9S29tbWVuZGEmZW1haWw9bmlrb2xhdXMua29tbWVuZGFAZ3VhcmRpYW4uY28udWsmYXZhdGFyVXJsPWh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BQXVFN21ELURZTFVqY2hfaUk0R3hqSVBfMlhiTXpncktEWm1MUTR2b3dpVEtnJnN5c3RlbT1tZWRpYS1zZXJ2aWNlJmF1dGhlZEluPW1lZGlhLXNlcnZpY2UsY29tcG9zZXImZXhwaXJlcz0xNTgwMjEyNTU4MDAwJm11bHRpZmFjdG9yPXRydWU=>>542061ad6b82a20c06c2937cb77e9cc70ec65b65; gutoolsAuth-assym=Zmlyc3ROYW1lPU5pa28mbGFzdE5hbWU9S29tbWVuZGEmZW1haWw9bmlrb2xhdXMua29tbWVuZGFAZ3VhcmRpYW4uY28udWsmYXZhdGFyVXJsPWh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BQXVFN21ELURZTFVqY2hfaUk0R3hqSVBfMlhiTXpncktEWm1MUTR2b3dpVEtnJnN5c3RlbT1tZWRpYS1zZXJ2aWNlJmF1dGhlZEluPW1lZGlhLXNlcnZpY2UsY29tcG9zZXImZXhwaXJlcz0xNTgwMjE2MTYyMDAwJm11bHRpZmFjdG9yPXRydWU=.jks2XIAFm08SuwTCJEAaQ4fPSYrn0tasiDNBlHTsifuDU/SbsjJjwZ7/jGxyP++R8MG35PwrJSGtTmym5dgVN5OIQiYt6tqtvzjjR6BEKP8q6y1m1Arne8U3Vwy8q9F/WktmjrKaZqcLZzWaAoUAqKEFOvJHTStaU8TXTA/Ldlpo2q7NwyK5JDIqX1247SFQOyw2EStQe8oBtOBDgenpR8J5wFX2JW94hULBH1+Cxg13B32aRk+JcSUkI9KXQXhyKD+IF2/LwEDdj1KExz9hRV/T0tEOWBGq4kBkXtM6fljkPRaNpHcPQisXMAyMuVZxCb59VHFv68siHcEdNa7/uQBL0ZtK6FhQaTN5BStVq2T0eS82nF5HrSpOmqoABHs4PPaUpoobFFNOqzlWtaKI5Yul7k4pzBGmYlgbCQ4a7t00JWMG2NmH05oyMEvr+C60uynwgTaXbxLTxWNezInK0dlykacw8TbE6crXemeOg2WGKrQfdRzUIRcmI48A6BlxTmieZ8OIeVaUM3pPWez/EQkysmr8LOV43ZnozX6cPlPQUKkaOepFoOHjOcMyT8M6xr9oUliwh3/NhGiF9b4AvNtnT9YUIdEqOw6My3dkzQ7nnhH2B5mVxd9T8l1td1GGtCNCY0essAHLDgSfRaDWbltC+8Yof+WtMhyrhDLTcUE=' }
    }).then( resp => resp.json() )
        .then( obj => {

            parsed.imgLocation = obj.data.originalMetadata.country
            save(parsed, i)
        })
        .catch(err => save( parsed, i ))
    

}

fetch(url).then( resp => resp.json() )
    .then( data => {
        
        const results = data.response.results

        results.forEach(parse)

    })
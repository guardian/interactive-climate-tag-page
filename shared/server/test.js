import fetch from 'node-fetch'

fetch("https://api.media.gutools.co.uk/images/340120fd84e17768f9444b94bac70d143a7f6420", {"credentials":"include","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3","accept-language":"en-GB,en-US;q=0.9,en;q=0.8","cache-control":"no-cache","pragma":"no-cache","upgrade-insecure-requests":"1"},"referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"})
    .then( resp => resp.raw())
    .then( str => console.log(str) )
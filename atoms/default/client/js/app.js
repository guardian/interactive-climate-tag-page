
import { $ } from 'shared/js/util'

import articles from 'shared/server/located_short.json'

import React, { render } from 'react'
import App from './components/App'

const mapArticles = articles.slice(12, 20)

render(<App articles={articles.slice(12)} mapArticles={mapArticles} />, $('.cc-container'))
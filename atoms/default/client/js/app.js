
import { $ } from 'shared/js/util'

import articles from 'shared/server/located.json'

import React, { render } from 'react'
import App from './components/App'

render(<App articles={articles} />, $('.cc-container'))
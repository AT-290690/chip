import { readFileSync, writeFileSync, readdirSync } from 'fs'
const withRelPath = path => `./examples/${path}`
const files = readdirSync(withRelPath('programs/')).map(title => ({
  title,
  script: readFileSync(withRelPath(`programs/${title}`), 'utf8'),
}))
writeFileSync(
  withRelPath('snippets.js'),
  `export default ${JSON.stringify(files)}`
)

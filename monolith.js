import snippets from './examples/snippets.js'
import { compress } from './language/misc/compression.js'
import { removeNoCode } from './language/misc/helpers.js'
const scripts = []
const addScript = ({ title, script }) => {
  scripts.push({
    title: title.toUpperCase(),
    script: encodeURIComponent(
      LZUTF8.compress(compress(removeNoCode(script)).trim(), {
        outputEncoding: 'Base64',
      })
    ),
  })
  return addScript
}
const filterAlphabetic = text => text.replace(/[^A-Z]/gi, ' ')
const build = () => {
  document.body.innerHTML = ''
  const href = `https://at-290690.github.io/chip/`,
    mode = 'preview',
    fragment = document.createDocumentFragment()
  scripts.forEach(({ script, title }) => {
    const container = document.createElement('div'),
      p = document.createElement('p'),
      anchor = document.createElement('a')
    p.textContent = filterAlphabetic(title.toUpperCase())
    container.appendChild(p)
    anchor.href = `${href}${mode}.html?s=${script}`
    anchor.textContent = filterAlphabetic(script.toUpperCase()).replace(
      /[^A-Z]/gi,
      ' '
    )
    container.appendChild(anchor)
    fragment.appendChild(container)
  })
  document.body.appendChild(fragment)
}
snippets.forEach(addScript)
build()
// const getScripts = async (...scripts) => {
//   encodeURIComponent(
//     LZUTF8.compress(compress(source).trim(), {
//       outputEncoding: 'Base64',
//     })
//   )
//   return [
//     {
//       title: 'Grid of Random Buttons',
//       script:
//         'PC1bIjBhIjsiMWrEBWnEBWQiOyIwTyJdWzJQXTvEITRGIjsiMlUiOyIzbsQFTCI7IjXEKzRQIl1bMGHGJjNJxD1NxCtvxBxFxA9OxDBrxA%2FEPzJuIl1bMWrHVsUNacYNMmjELkbEEmRdOzo9W2EwOy0%2BW247MUZbKlsyaFtdO24nNMQZZcUZcHg7OjpbInRvcCI7M0lbcHhdOyJsZWZ0yg5yaWdoyw9ib3R0b23HECc0O349W2LFSmQwO2cwOy4uW2cwW107P1vFEjBdO2IwWz3ECy3EBTFdXTtnMCc15ACBacU3NEZbfD5bOj1bZjA7M0xbXV07M25bYTBbNV1dOzJVWzRFW107Mm9bZTBbMTBdXTsxTcQLxB0xTlvkALpzaXpl5QCOMV07InR5cGUiOyJzb2xp5AF9Y29sb3IiOyJ3aGl0ZSLEW2tbyA07NFVbInRyYW5zcGFyZW50xB80blvkAJJQ5ACM5ACDJzjkAKhj5QCoLi7kAKVoMDt85QC05QCdMm5bImYiJzTkAOQxxSY1acQjaTBbJzQ7aDAnM8QaNTtjMF07',
//     },
//   ]
// }
// getScripts('Grid of Random Buttons')
//   // .then(res => res.json())
//   .then(data => data.forEach(addScript))
//   .finally(build)

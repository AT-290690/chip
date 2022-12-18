import { decodeBase64 } from './language/misc/compression.js'
import { compileToJs } from './language/core/compiler.js'
import { treeShake, languageUtilsString, brrrHelpers } from './language/misc/utils.js'
import { wrapInBody, removeNoCode } from './language/misc/helpers.js'
import { parse } from './language/core/parser.js'
import Brrr from './language/extentions/Brrr.js'
const encoding = new URLSearchParams(location.search).get('s')
if (encoding) {
  const inlined = wrapInBody(
    removeNoCode(decodeBase64(decodeURIComponent(encoding)))
  )
  const { body, modules } = compileToJs(parse(inlined))
  const LIBRARY = treeShake(modules)
  const script = document.createElement('script')
  script.innerHTML = `const canvasContainer =  document.createElement('div')
      canvasContainer.id = 'canvas-container'
      document.body.appendChild(canvasContainer)
      const VOID = null
      const LOGGER = () => () => {}
      ${Brrr.toString()}
      ${brrrHelpers}
      ${languageUtilsString}
      ${LIBRARY}
      ${body}
      `
  document.body.appendChild(script)
}

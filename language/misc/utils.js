import { compileToJs } from '../core/compiler.js'
import { cell, parse } from '../core/parser.js'
import { tokens } from '../core/tokens.js'
import { STD, protolessModule } from '../extentions/extentions.js'
import { removeNoCode, wrapInBody } from './helpers.js'
import Brrr from '../extentions/Brrr.js'
export const languageUtilsString = `const _tco = func => (...args) => { let result = func(...args); while (typeof result === 'function') { result = result(); }; return result };
const _pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const _spread = (items) => Array.isArray(items[0]) ? items.reduce((acc, item) => [...acc, ...item], []) : items.reduce((acc, item) => ({ ...acc, ...item }), {});
const _scanLeft = (array, callback) => { for (let i = 0; i < array.length; ++i) callback(array[i], i, array); return array } 
const _scanRight = (array, callback) => {  for (let i = array.length - 1; i >= 0; --i) callback(array[i], i, array); return array }
const _mapLeft = (array, callback, copy = new Brrr()) => { for (let i = 0; i < array.length; ++i) copy.set(i, callback(array.at(i), i, array)); return array.balance() } 
const _mapRight = (array, callback, copy = new Brrr()) => {  for (let i = array.length - 1; i >= 0; --i) copy.set(i, callback(array.at(i), i, array)); return array.balance() } 
const _filter = (array, callback) => array.filter(callback) 
const _reduceLeft = (array, callback, out = []) => array.reduce(callback, out)
const _reduceRight = (array, callback, out = []) => array.reduceRight(callback, out)
const _findLeft = (array, callback) => array.find(callback)
const _findRight = (array, callback) => array.findLast(callback)
const _repeat = (n, callback) => { let out; for (let i = 0; i < n; ++i) out = callback(); return out }
const _every = (array, callback) => array.every(callback)
const _some = (array, callback) => array.some(callback)
const _append = (array, value) => array.append(value)
const _prepemd = (array, value) => array.prepend(value)
const _head = (array) => array.head()
const _tail = (array) => array.tail()
const _cut = (array) => array.cut()
const _chop= (array) => array.chop()
const _length = (array) => array.length
const _split = (string, separator) => Brrr.from(string.split(separator))
const _at = (array, index) => array.at(index)
const _set = (array, index, value) => array.set(index, value)
const call = (x, fn) => fn(x)
const printout = (...args) => console.log(...args)
const protolessModule = methods => { const env = Object.create(null); for (const method in methods) env[method] = methods[method]; return env };`

export const logBoldMessage = msg => console.log('\x1b[1m', msg)
export const logErrorMessage = msg =>
  console.log('\x1b[31m', '\x1b[1m', msg, '\x1b[0m')
export const logSuccessMessage = msg =>
  console.log('\x1b[32m', '\x1b[1m', msg, '\x1b[0m')
export const logWarningMessage = msg =>
  console.log('\x1b[33m', '\x1b[1m', msg, '\x1b[0m')

const findParent = ast => {
  let out = { fn: null, res: null }
  for (const prop in ast)
    if (Array.isArray(ast[prop]))
      for (const arg of ast[prop]) {
        if (arg.type === 'apply') out.fn = arg.operator.name
        const temp = findParent(arg)
        if (temp.res !== undefined) out.res = temp.res
      }
    else if (ast[prop] !== undefined) out.res = ast[prop]
  return out
}

export const runFromInterpreted = source => run(removeNoCode(source))
export const runFromCompiled = source => eval(compileModule(source))

export const exe = source => {
  const ENV = protolessModule(STD)
  ENV[';;tokens'] = protolessModule(tokens)
  const { result } = cell(ENV)(wrapInBody(source))
  return result
}
export const isBalancedParenthesis = sourceCode => {
  let count = 0
  const stack = []
  const str = sourceCode.replace(/"(.*?)"/g, '')
  const pairs = { ']': '[' }
  for (let i = 0; i < str.length; ++i)
    if (str[i] === '[') stack.push(str[i])
    else if (str[i] in pairs) if (stack.pop() !== pairs[str[i]]) count++
  return { str, diff: count - stack.length }
}
export const handleUnbalancedParens = sourceCode => {
  const parenMatcher = isBalancedParenthesis(sourceCode)
  if (parenMatcher.diff !== 0)
    throw new SyntaxError(
      `Parenthesis are unbalanced by ${parenMatcher.diff > 0 ? '+' : ''}${
        parenMatcher.diff
      } "]"`
    )
}
// -export const run = source => {
//   -  const sourceCode = removeNoCode(source.toString().trim())
//   -  handleUnbalancedParens(sourceCode)
//   -  return exe(sourceCode)
//   -}
//   +expo
export const run = source => {
  const sourceCode = removeNoCode(source.toString().trim())
  handleUnbalancedParens(sourceCode)
  return exe(sourceCode)
}

export const handleHangingSemi = source => {
  const code = source.trim()
  return code[code.length - 1] === ';' ? code : code + ';'
}

export const treeShake = modules => {
  let lib = ''
  const dfs = (modules, lib, LIBRARY) => {
    for (const key in modules) {
      if (key !== 'LIBRARY' && modules[key] !== undefined) {
        lib += '["' + key + '"]:{'
        for (const method of modules[key]) {
          if (LIBRARY[key]) {
            const current = LIBRARY[key][method]
            if (current) {
              if (typeof current === 'object') {
                lib += dfs({ [method]: modules[method] }, '', LIBRARY[key])
              } else {
                lib += '["' + method + '"]:'
                lib += current.toString()
                lib += ','
              }
            }
          }
        }
        lib += '},'
      }
    }
    return lib
  }
  lib += 'const LIBRARY = {' + dfs(modules, lib, STD.LIBRARY) + '}'
  return lib
}

export const compileModule = source => {
  const inlined = wrapInBody(removeNoCode(source))
  const { body, modules } = compileToJs(parse(inlined))
  const lib = treeShake(modules)
  return `const VOID = null;
${languageUtilsString}
${lib};
${body}`
}

export const compileHtml = (source, scripts = '') => {
  const inlined = wrapInBody(removeNoCode(source))
  const { body, modules } = compileToJs(parse(inlined))
  const lib = treeShake(modules)
  return `
<style>body { background: #0e0e0e } </style><body>
${scripts}
<script>
const VOID = null;
${languageUtilsString}
</script>
<script>${lib}</script>
<script> (() => { ${body} })()</script>
</body>`
}

export const interpredHtml = (
  source,
  utils = '../language/misc/utils.js',
  scripts = ''
) => {
  const inlined = wrapInBody(removeNoCode(source))
  return `<style>body { background: black } </style>
  ${Brrr.toString()}
  ${scripts}
<script type="module">
import { exe } from '${utils}'; 
  try { 
    exe('${inlined}') 
  } catch(err) {
    console.error(err.message) 
  }
</script>
</body>`
}

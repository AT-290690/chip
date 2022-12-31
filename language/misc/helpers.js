export const NoCodeRegExp = /[ ]+(?=[^"]*(?:"[^"]*"[^"]*)*$)+|\n|\t|;;.+/g
export const extractComments = source =>
  source.match(NoCodeRegExp).filter(x => x[0] === ';' && x[1] === ';')
export const removeNoCode = source => source.replaceAll(NoCodeRegExp, '')
export const wrapInBody = source => `..[${source}]`

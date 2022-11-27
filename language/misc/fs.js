import { writeFileSync } from 'fs'
import {
  compileHtml,
  dashCommentsToSemiComments,
  handleUnbalancedParens,
  interpredHtml,
  logErrorMessage,
  run,
} from './utils.js'

export const compile = (file, to, scripts) => {
  try {
    handleUnbalancedParens(file)
    const data = compileHtml(dashCommentsToSemiComments(file), scripts)
    if (data) writeFileSync(to, data)
  } catch (err) {
    logErrorMessage(err.message)
  }
}

export const interpred = file => {
  try {
    handleUnbalancedParens(file)
    console.log(run(dashCommentsToSemiComments(file)))
  } catch (err) {
    logErrorMessage(err.message)
  }
}

export const interpredBrowser = (file, to) => {
  try {
    handleUnbalancedParens(file)
    const data = interpredHtml(dashCommentsToSemiComments(file))
    if (data) writeFileSync(to, data)
  } catch (err) {
    logErrorMessage(err.message)
  }
}

import { CodeMirror } from './editor/cell.editor.bundle.js'
import { compress, decompress, prettier } from './language/misc/compression.js'
import { removeNoCode } from './language/misc/helpers.js'
const editor = CodeMirror(document.getElementById('comments-section'))
const onResize = () => {
  const bouds = document.body.getBoundingClientRect()
  editor.setSize(bouds.width - 5, bouds.height - 5)
}

const compressionStages = {
  count: 0,
  stages: [
    removeNoCode,
    compress,
    source =>
      encodeURIComponent(
        LZUTF8.compress(source.trim(), {
          outputEncoding: 'Base64',
        })
      ),
  ],
}
const decompressionStages = {
  count: 0,
  stages: [
    source =>
      LZUTF8.decompress(decodeURIComponent(source.trim()), {
        inputEncoding: 'Base64',
        outputEncoding: 'String',
      }),
    decompress,
    prettier,
  ],
}
document.getElementById('compress').addEventListener('click', () => {
  if (compressionStages.count >= compressionStages.stages.length)
    compressionStages.count = 0
  editor.setValue(
    compressionStages.stages[compressionStages.count](editor.getValue())
  )
  compressionStages.count++
})
document.getElementById('decompress').addEventListener('click', () => {
  if (decompressionStages.count >= decompressionStages.stages.length)
    decompressionStages.count = 0
  editor.setValue(
    decompressionStages.stages[decompressionStages.count](editor.getValue())
  )
  decompressionStages.count++
})

window.addEventListener('resize', onResize)
onResize()
editor.setValue(`;; mult two numbers
:= [mult two numbers; -> [
;; takes left and right operand
left; right; * [left; right]]];
;; call mult two numbers many times
mult two numbers [2;
mult two numbers [2;
  mult two numbers [2;
    mult two numbers [2;
      mult two numbers [2;
        mult two numbers [2;
          mult two numbers [2;
            mult two numbers [2;
              mult two numbers [2;
                mult two numbers [2;
                  mult two numbers [2;
                    mult two numbers [2; 2]]]]]]]]]]]]`)

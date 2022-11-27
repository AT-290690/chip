import { elements } from './common.js'
import { HyperLightEditor } from './editor.js'

HyperLightEditor(document.getElementById('comments-section'), {
  elements,
  onResize: editor => {
    const bouds = document.body.getBoundingClientRect()
    editor.setSize(bouds.width - 5, bouds.height - 5)
  },
  onPopupResize: popup => {
    const bouds = document.body.getBoundingClientRect()
    popup.setSize(bouds.width - 5, bouds.height / 3)
  },
})

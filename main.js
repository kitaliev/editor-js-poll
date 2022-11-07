import './style.styl'
import { setupField } from './editor.js'

document.querySelector('#app').innerHTML = `<div id="editorjs"></div>`

setupField(document.querySelector('#editorjs'))

import './style.styl'
import Poll from "./src/index.js";
import JsonViewer from 'json-viewer-js/src/jsonViewer.js';

document.querySelector('#app').innerHTML = `
  <div class="editor" id="editorjs"></div>
  <div class="output" id="output"></div>
`

let savedData = {
  blocks: [
    {
      type: "poll",
      data: {
        question: "Нравится ли мне FrontEnd?",
        multiple: false,
        quiz: false,
        answers: [{
          value: "Нет",
          checked: true,
        }, {
          value: "Да",
          checked: false,
        }, {
          value: "А?",
          checked: true,
        }]
      }
    }
  ]
}

new EditorJS({
  autofocus: true,
  data: savedData,
  onChange: (e) => {
    e.saver.save().then((res) => {
      document.querySelector('#output').innerHTML = '<pre></pre>'
      new JsonViewer({
        container: document.querySelector('#output pre'),
        data: JSON.stringify(res),
        theme: 'light',
        expand: true
      });
    });
  },
  tools: {
    poll: Poll,
  }
});


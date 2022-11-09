var t=[],e=[];!function(s,i){if(s&&"undefined"!=typeof document){var o,r=!0===i.prepend?"prepend":"append",a=!0===i.singleTag,l="string"==typeof i.container?document.querySelector(i.container):document.getElementsByTagName("head")[0];if(a){var n=t.indexOf(l);-1===n&&(n=t.push(l)-1,e[n]={}),o=e[n]&&e[n][r]?e[n][r]:e[n][r]=h()}else o=h();65279===s.charCodeAt(0)&&(s=s.substring(1)),o.styleSheet?o.styleSheet.cssText+=s:o.appendChild(document.createTextNode(s))}function h(){var t=document.createElement("style");if(t.setAttribute("type","text/css"),i.attributes)for(var e=Object.keys(i.attributes),s=0;s<e.length;s++)t.setAttribute(e[s],i.attributes[e[s]]);var o="prepend"===r?"afterbegin":"beforeend";return l.insertAdjacentElement(o,t),t}}(".editor-js-poll-plugin {\n  display: grid;\n  grid-gap: 16px;\n  background: #fff;\n  border-radius: 5px;\n}\n.editor-js-poll-plugin__header {\n  display: grid;\n  grid-gap: 8px;\n}\n.editor-js-poll-plugin__header-checks {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.editor-js-poll-plugin__checkbox {\n  display: flex;\n  align-items: center;\n  font-size: 0.875em;\n  gap: 2px;\n}\n.editor-js-poll-plugin__body {\n  display: grid;\n  grid-gap: 10px;\n}\n.editor-js-poll-plugin__answer {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.editor-js-poll-plugin__hidden {\n  display: none;\n}\n",{});class s{rootClass="editor-js-poll-plugin";constructor({data:t,api:e}){this.data=t,this.api=e}render(){this.root=document.createElement("div"),this.root.classList.add(this.rootClass),this.root.classList.add("cdx-block"),this.root.innerHTML=`<div class="${this.rootClass}__header">\n      <input class="${this.rootClass}__input cdx-input" placeholder="Вопрос" type="text" />\n      <div class="${this.rootClass}__header-checks">\n        <label class="${this.rootClass}__checkbox" title="Пользователь может выбрать несколько правильных ответов">\n          <input type="checkbox">\n          <span>Несколько ответов</span>\n        </label>\n        <label class="${this.rootClass}__checkbox" title="Опрос с правильными и неправильными ответами">\n          <input type="checkbox">\n          <span>Викторина</span>\n        </label>\n      </div>\n    </div>\n    <div class="${this.rootClass}__body"></div>`,this.data&&(this.root.querySelector(`.${this.rootClass}__header .${this.rootClass}__input`).value=this.data.question||"");let t=this.root.querySelector(`.${this.rootClass}__header .${this.rootClass}__checkbox:first-child input`);this.api.listeners.on(t,"change",(t=>{this.root.querySelectorAll(`.${this.rootClass}__body .${this.rootClass}__checkbox input`).forEach((e=>{e.setAttribute("type",t.target.checked?"checkbox":"radio")})),this.data.multiple=t.target.checked})),this.data&&(t.checked=this.data.multiple);let e=this.root.querySelector(`.${this.rootClass}__header .${this.rootClass}__checkbox:last-child input`);return this.data.quiz&&(e.checked=this.data.quiz),this.api.listeners.on(e,"change",(t=>{this.data.quiz=t.target.checked,this.root.querySelectorAll(`.${this.rootClass}__body .${this.rootClass}__checkbox`).forEach((e=>{t.target.checked?e.classList.remove(`${this.rootClass}__hidden`):e.classList.add(`${this.rootClass}__hidden`)}))})),this.data&&this.data.answers&&this.data.answers.forEach((t=>{t.value.trim().length&&this.root.querySelector(`.${this.rootClass}__body`).append(this.getAnswer(t.value,t.checked))})),this.data&&this.data.answers&&this.data.answers.length&&this.data.answers.reduce(((t,e)=>t+!e.value.trim().length?1:0),0).length||this.root.querySelector(`.${this.rootClass}__body`).appendChild(this.getAnswer()),this.root.querySelectorAll(`.${this.rootClass}__body .${this.rootClass}__answer`).forEach((t=>{this.api.listeners.on(t.querySelector(`.${this.rootClass}__checkbox input`),"change",(()=>{}),!1),this.api.listeners.on(t.querySelector(`.${this.rootClass}__input`),"input",(()=>{this.handleAnswerInput()}),!1)})),this.root}save(t){let e=Array.from(t.querySelectorAll(`.${this.rootClass}__body .${this.rootClass}__answer`)).map((t=>({value:t.querySelector(`.${this.rootClass}__input`).value,checked:t.querySelector(`.${this.rootClass}__checkbox input`).checked||!1})));return e=e.filter((t=>!!t.value.trim().length)),{question:t.querySelector(`.${this.rootClass}__header .${this.rootClass}__input`).value,multiple:t.querySelector(`.${this.rootClass}__header .${this.rootClass}__checkbox:first-child input`).checked||!1,quiz:t.querySelector(`.${this.rootClass}__header .${this.rootClass}__checkbox:last-child input`).checked||!1,answers:e}}handleAnswerInput(){if(this.root.querySelectorAll(`.${this.rootClass}__body .${this.rootClass}__input`).forEach((t=>{t.value.trim().length||t.parentNode.remove()})),!Array.from(this.root.querySelectorAll(`.${this.rootClass}__body .${this.rootClass}__input`)).reduce(((t,e)=>t+!e.value.trim().length?1:0),0)){let t=this.getAnswer();this.api.listeners.on(t.querySelector(`.${this.rootClass}__input`),"input",(()=>{this.handleAnswerInput()}),!1),this.api.listeners.on(t.querySelector(`.${this.rootClass}__checkbox input`),"input",(()=>{}),!1),this.root.querySelector(`.${this.rootClass}__body`).appendChild(t)}}getAnswer(t,e){let s=document.createElement("div");return s.classList.add(`${this.rootClass}__answer`),s.innerHTML=`<label class="${this.rootClass}__checkbox ${this.data.quiz?"":`${this.rootClass}__hidden`}" title="Правильный ответ"><input type="${this.data.multiple?"checkbox":"radio"}"></label>\n      <input type="text" class="${this.rootClass}__input cdx-input" placeholder="Вариант ответа" />`,s.querySelector(`.${this.rootClass}__checkbox input`).checked=e||!1,s.querySelector(`.${this.rootClass}__input`).value=t||"",s}static get toolbox(){return{title:"Опрос",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 22.75H3C2.59 22.75 2.25 22.41 2.25 22C2.25 21.59 2.59 21.25 3 21.25H21C21.41 21.25 21.75 21.59 21.75 22C21.75 22.41 21.41 22.75 21 22.75Z" fill="#292D32"/><path d="M5.6 8.38H4C3.45 8.38 3 8.83 3 9.38V18C3 18.55 3.45 19 4 19H5.6C6.15 19 6.6 18.55 6.6 18V9.38C6.6 8.82 6.15 8.38 5.6 8.38Z" fill="#292D32"/><path d="M12.8002 5.18994H11.2002C10.6502 5.18994 10.2002 5.63994 10.2002 6.18994V17.9999C10.2002 18.5499 10.6502 18.9999 11.2002 18.9999H12.8002C13.3502 18.9999 13.8002 18.5499 13.8002 17.9999V6.18994C13.8002 5.63994 13.3502 5.18994 12.8002 5.18994Z" fill="#292D32"/><path d="M19.9999 2H18.3999C17.8499 2 17.3999 2.45 17.3999 3V18C17.3999 18.55 17.8499 19 18.3999 19H19.9999C20.5499 19 20.9999 18.55 20.9999 18V3C20.9999 2.45 20.5499 2 19.9999 2Z" fill="#292D32"/></svg>'}}}export{s as default};
//# sourceMappingURL=index.js.map

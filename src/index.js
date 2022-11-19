require("./index.css").toString()

class Poll {
  rootClass = 'editor-js-poll-plugin';

  constructor({data, api, block }){
    this.data = data;
    this.api = api;
    this.blockAPI = block;
  }

  render(){
    this.root = document.createElement('div');
    this.root.classList.add(this.rootClass);
    this.root.classList.add('cdx-block');
    this.root.innerHTML = `<div class="${this.rootClass}__header">
      <input class="${this.rootClass}__input cdx-input" placeholder="Вопрос" type="text" />
      <div class="${this.rootClass}__header-checks">
        <label class="${this.rootClass}__checkbox" title="Пользователь может выбрать несколько правильных ответов">
          <input type="checkbox">
          <span>Несколько ответов</span>
        </label>
        <label class="${this.rootClass}__checkbox" title="Опрос с правильными и неправильными ответами">
          <input type="checkbox">
          <span>Викторина</span>
        </label>
      </div>
    </div>
    <div class="${this.rootClass}__body"></div>`;
    // Вопрос
    if (this.data) {
      this.root.querySelector(`.${this.rootClass}__header .${this.rootClass}__input`).value = this.data.question || '';
    }

    // Несколько ответов
    let multipleAnswersCheckbox = this.root.querySelector(`.${this.rootClass}__header .${this.rootClass}__checkbox:first-child input`);
    // Смена типа чекбокса ответа
    this.api.listeners.on(multipleAnswersCheckbox, 'change', (e) => {
      this.root.querySelectorAll(`.${this.rootClass}__body .${this.rootClass}__checkbox input`).forEach((input) => {
        input.setAttribute('type', e.target.checked ? 'checkbox' : 'radio')
      });
      this.data.multiple = e.target.checked;
    })
    if (this.data) {
      // Вставка из data
      multipleAnswersCheckbox.checked = this.data.multiple;
    }

    // Викторина
    let quizCheckbox = this.root.querySelector(`.${this.rootClass}__header .${this.rootClass}__checkbox:last-child input`);
    // Вставка из data
    if (this.data.quiz) {
      quizCheckbox.checked = this.data.quiz
    }

    this.api.listeners.on(quizCheckbox, 'change', (e) => {
      this.data.quiz = e.target.checked;
      this.root.querySelectorAll(`.${this.rootClass}__body .${this.rootClass}__checkbox`).forEach((input) => {
        input.setAttribute('type', multipleAnswersCheckbox.checked ? 'checkbox' : 'radio');
        if (!e.target.checked) {
          input.classList.add(`${this.rootClass}__hidden`)
        } else {
          input.classList.remove(`${this.rootClass}__hidden`)
        }
      });
    })

    // Ответы
    // Вставка ответов из data
    if (this.data && this.data.answers) {
      this.data.answers.forEach((answer) => {
        if (answer.value.trim().length) {
          this.root.querySelector(`.${this.rootClass}__body`).append(this.getAnswer(answer.value, answer.checked));
        }
      })
    }
    // Если нет ни одного ответа вставляем пустой
    if (!(this.data && this.data.answers && this.data.answers.length && this.data.answers.reduce((a, b) => a + !b.value.trim().length ? 1 : 0, 0).length)) {
      this.root.querySelector(`.${this.rootClass}__body`).appendChild(this.getAnswer());
    }

    // Слушатели полей ввода ответа
    this.root.querySelectorAll(`.${this.rootClass}__body .${this.rootClass}__answer`).forEach((input) => {
      // Чекбокс
      this.api.listeners.on(input.querySelector(`.${this.rootClass}__checkbox input`), 'change', () => {
        this.blockAPI.dispatchChange()
      }, false);
      // Input
      this.api.listeners.on(input.querySelector(`.${this.rootClass}__input`), 'input', () => {
        this.handleAnswerInput()
      }, false);
    })
    return this.root;
  }

  save(blockContent){
    let answers = Array.from(blockContent.querySelectorAll(`.${this.rootClass}__body .${this.rootClass}__answer`)).map((node) => ({
      value: node.querySelector(`.${this.rootClass}__input`).value,
      checked: node.querySelector(`.${this.rootClass}__checkbox input`).checked || false,
    }));
    answers = answers.filter(a => !!a.value.trim().length);
    return {
      question: blockContent.querySelector(`.${this.rootClass}__header .${this.rootClass}__input`).value,
      multiple: blockContent.querySelector(`.${this.rootClass}__header .${this.rootClass}__checkbox:first-child input`).checked || false,
      quiz: blockContent.querySelector(`.${this.rootClass}__header .${this.rootClass}__checkbox:last-child input`).checked || false,
      answers: answers,
    };
  }

  handleAnswerInput() {
    this.root.querySelectorAll(`.${this.rootClass}__body .${this.rootClass}__input`).forEach((input) => {
      if (!input.value.trim().length) {
        input.parentNode.remove()
      }
    })
    let inputs = Array.from(this.root.querySelectorAll(`.${this.rootClass}__body .${this.rootClass}__input`));
    let emptyInputs = inputs.reduce((a, b) => a + !b.value.trim().length ? 1 : 0, 0);
    if (!emptyInputs) {
      let input = this.getAnswer();
      this.api.listeners.on(input.querySelector(`.${this.rootClass}__input`), 'input', () => {
        this.handleAnswerInput()
      }, false);
      this.api.listeners.on(input.querySelector(`.${this.rootClass}__checkbox input`), 'input', () => {}, false);
      this.root.querySelector(`.${this.rootClass}__body`).appendChild(input);
    }
  }

  getAnswer(value, checked) {
    let root = document.createElement('div');
    root.classList.add(`${this.rootClass}__answer`);
    root.innerHTML = `<label class="${this.rootClass}__checkbox ${!this.data.quiz ? `${this.rootClass}__hidden` : ''}" title="Правильный ответ"><input name="${this.blockAPI?.id || ''}" type="${this.data.multiple ? 'checkbox' : 'radio'}"></label>
      <input type="text" class="${this.rootClass}__input cdx-input" placeholder="Вариант ответа" />`;
    root.querySelector(`.${this.rootClass}__checkbox input`).checked = checked || false;
    root.querySelector(`.${this.rootClass}__input`).value = value || '';
    return root;
  }

  static get toolbox() {
    return {
      title: 'Опрос',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 22.75H3C2.59 22.75 2.25 22.41 2.25 22C2.25 21.59 2.59 21.25 3 21.25H21C21.41 21.25 21.75 21.59 21.75 22C21.75 22.41 21.41 22.75 21 22.75Z" fill="#292D32"/><path d="M5.6 8.38H4C3.45 8.38 3 8.83 3 9.38V18C3 18.55 3.45 19 4 19H5.6C6.15 19 6.6 18.55 6.6 18V9.38C6.6 8.82 6.15 8.38 5.6 8.38Z" fill="#292D32"/><path d="M12.8002 5.18994H11.2002C10.6502 5.18994 10.2002 5.63994 10.2002 6.18994V17.9999C10.2002 18.5499 10.6502 18.9999 11.2002 18.9999H12.8002C13.3502 18.9999 13.8002 18.5499 13.8002 17.9999V6.18994C13.8002 5.63994 13.3502 5.18994 12.8002 5.18994Z" fill="#292D32"/><path d="M19.9999 2H18.3999C17.8499 2 17.3999 2.45 17.3999 3V18C17.3999 18.55 17.8499 19 18.3999 19H19.9999C20.5499 19 20.9999 18.55 20.9999 18V3C20.9999 2.45 20.5499 2 19.9999 2Z" fill="#292D32"/></svg>'
    };
  }
}

module.exports = Poll;
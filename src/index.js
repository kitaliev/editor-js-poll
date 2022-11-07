class Poll {
  render(){
    let root = document.createElement('div');
    let rootClass = 'editor-js-poll-plugin';
    root.classList.add(rootClass);
    return root.innerHTML = `<textarea class="${rootClass}__question"></textarea>
<div class="${rootClass}__answers">
    
</div>`;
  }
}
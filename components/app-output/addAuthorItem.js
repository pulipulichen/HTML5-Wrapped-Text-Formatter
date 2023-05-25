let addAuthorItem = function (item) {
  let template = $(`<div class="transable ui segments app-output-item">
  <div class="ui green inverted segment header">
      
    <div class="date">
      <i class="icon chevron circle down"></i>
      <i class="icon chevron circle up"></i>
      ${this.computedDate(item)}
    </div>
    <div class="text">
      ${item.text}
    </div>
    
  </div>
  <div class="ui segment content">
    <form class="ui grid form">
      <div class="sixteen wide column">
        <div class="field">
          <div class="ui fluid mini buttons">
            <button type="button" class="copy-original-text ui button">複製</button>
            <button type="button" class="remove-item ui button">移除</button>
          </div>
        </div>
        <div class="field">
          <textarea class="original-text"></textarea>
        </div>
      </div>
    </form>
  </div>
</div>`)
  template.prependTo(this.$refs.main)

  template.find('.original-text').val(item.text)

  let select = template.find('.trans-to-lang')
  this.langs.forEach((lang) => {
    select.append(`<option value="${lang.value}">${lang.text}</option>`)
  })
  select.val(item.transToLang)

  this.setupButtonEvents(template)

  setTimeout(() => {
    this.trans(template)
    template[0].scrollIntoView(({behavior: "smooth", block: "start", inline: "start"}))
  }, 50)

  return template
}
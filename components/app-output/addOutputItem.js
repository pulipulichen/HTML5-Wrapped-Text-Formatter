let addOutputItem = function (item) {
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
      <div class="eight wide column original-column">
        <div class="field">
          <div class="ui fluid mini buttons">
          <button type="button" class="copy-original-text-no-empty-lines ui button">複製無空白行原文</button>
          <button type="button" class="collapse-empty-lines ui button">刪除空白換行</button>
            <button type="button" class="expand-empty-lines ui button">加大空白換行</button>
            <button type="button" class="copy-original-text ui button">複製原文</button>
          </div>
        </div>
        <div class="inline fields">
          <div class=" inline tiny field">
            <label>
              Min
            </label>
            <input type="number" class="prompt-min prompt-limit" min="1" value="${this.promptMin}" />
          </div>
          <div class="tiny inline field">
            <label>
              Max
            </label>
            <input type="number" class="prompt-max prompt-limit" min="1" value="${this.promptMax}" />
          </div>
          <div class="tiny inline field">
            <label>
              改寫
            </label>
            <select class="prompt-modify">
              <option value="shorter">shorter</option>
              <option value="normal">normal</option>
              <option value="longer">longer</option>
            </select>
          </div>
          <div class="field">
            <div class="ui fluid mini buttons">
              <button type="button" class="copy-prompt-sentences-original ui button">列點</button>
              <button type="button" class="copy-prompt-keywords-original ui button">關鍵字</button>
              <a href="https://chat.openai.com/" target="chatgpt" class="ui button">ChatGPT</a>
            </div>
          </div>
        </div>
        <div class="field">
          <textarea class="original-text"></textarea>
        </div>
          
      </div>
      <div class="eight wide column trans-column">
        <div class="field">
          <div class="ui fluid mini buttons">
            <button type="button" class="copy-trans-text ui button">複製翻譯</button>
            <button type="button" class="copy-dual-text ui button">複製原文跟翻譯</button>
            <button type="button" class="remove-item ui button">移除</button>
          </div>
        </div>
        <div class="fields">
          <div class=" eight wide field">
            <div class="ui fluid mini buttons">
              <button type="button" class="copy-prompt-sentences-trans ui button">列點</button>
              <button type="button" class="copy-prompt-keywords-trans ui button">關鍵字</button>
              <a href="https://chat.openai.com/" target="chatgpt" class="ui button">ChatGPT</a>
            </div>
          </div>
          <div class="ui mini icon fluid input eight wide field">
            <input type="hidden" class="trans-from-lang" />
            <select class="trans-to-lang">
            </select>
            <i class="submit globe icon"></i>
          </div>
        </div>
        <div class="field">
          <textarea class="trans-text"></textarea>
        </div>
      </div>
    </form>
  </div>
</div>`)
  template.prependTo(this.$refs.main)

  template.find('.original-text').val(item.text)
  template.find('.prompt-modify').val(this.promptModify)

  let select = template.find('.trans-to-lang')
  this.langs.forEach((lang) => {
    select.append(`<option value="${lang.value}">${lang.text}</option>`)
  })
  select.val(item.transToLang)

  template.find('.trans-from-lang').val(item.transFromLang)

  if (item.transToLang === 'false') {
    template.find('.original-column').removeClass('seven').addClass('sixteen')
    template.find('.trans-column').remove()
  }
  else {
    setTimeout(() => {
      this.trans(template)

      if (this.db.localConfig.autoCopyText) {
        this.copyPlainString(item.text)
      }
      
    }, 50)
  }

  this.setupButtonEvents(template)

    

  return template
}
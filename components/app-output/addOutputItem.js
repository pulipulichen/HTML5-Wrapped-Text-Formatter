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
        <div class="inline fields prompt-controller">
          <div class=" inline tiny three wide field">
            <label>
              Min
            </label>
            <input type="number" class="prompt-min prompt-limit" min="1" value="${this.promptMin}" />
          </div>
          <div class="tiny inline three wide field">
            <label>
              Max
            </label>
            <input type="number" class="prompt-max prompt-limit" min="1" value="${this.promptMax}" />
          </div>
          <div class="tiny inline five wide field">
            <label>
              改寫
            </label>
            <select class="prompt-modify">
              <option value="shorter">shorter</option>
              <option value="normal">normal</option>
              <option value="longer">longer</option>
            </select>
          </div>
          <div class="tiny inline five wide field">
            <label>
              類型
            </label>
            <select class="prompt-type">
              <option value="sentences">句子</option>
              <option value="keywords">關鍵字</option>
              <option value="mindmap">心智圖</option>
              <option value="paragraphs">段落</option>
              <option value="quiz">選擇題</option>
              <option value="answer">申論題</option>
            </select>
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
        <div class="fields prompt-controller">

          <div class="tiny inline three wide field">
            <label>
              目標
            </label>
            <select class="prompt-input">
              <option value="original">原句</option>
              <option value="trans">翻譯</option>
            </select>
          </div>
          <div class=" eight wide field">
            <div class="ui fluid mini buttons">
              <button type="button" class="copy-prompt ui button">複製提示詞</button>
              <a href="https://chat.openai.com/" target="chatgpt" class="ui button" onclick="PopupUtils.openURLFullscreen(event)">ChatGPT</a>
              <a href="https://pulipulichen.github.io/HTML-Summernote-Editor/index.html" target="html_editor" class="ui button" onclick="PopupUtils.openURLFullscreen(event)">HTML Editor</a>
            </div>
          </div>
          <div class="ui mini icon fluid input five wide field">
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
  template.find('.prompt-type').val(this.promptType)
  template.find('.prompt-input').val(this.promptInput)

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
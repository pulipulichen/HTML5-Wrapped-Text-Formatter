let setupButtonEvents = function (template) {

  let component = this
  template.find('.header').click(function () {
    let itemTemplate = $(this).parents('.app-output-item:first')
    itemTemplate.toggleClass('collapsed')
  })

  template.find('.remove-item').click(function () {
    let itemTemplate = $(this).parents('.app-output-item:first')
    itemTemplate.remove()
  })

  template.find('.submit').click(function () {
    let itemTemplate = $(this).parents('.app-output-item:first')
    component.trans(itemTemplate)
  })

  template.find('textarea').change(function () {
    component.resizeTextarea(this)
  })

  this.setupEmptyLinesEvent(template)

  this.addClickEvent(template, '.copy-original-text', (itemTemplate, originalText, transText) => {
    this.copyPlainString(originalText)
  })

  this.addClickEvent(template, '.copy-original-text-no-empty-lines', (itemTemplate, originalText, transText) => {
    if (originalText.indexOf('\n\n') > -1) {
      while (originalText.indexOf('\n\n') > -1) {
        originalText = originalText.replace(/\n\n/g, '\n')
        originalText = originalText.trim()
      }
    }
    this.copyPlainString(originalText)
  })

  this.addClickEvent(template, '.copy-trans-text', (itemTemplate, originalText, transText) => {
    this.copyPlainString(transText)
  })

  this.addClickEvent(template, '.copy-dual-text', (itemTemplate, originalText, transText) => {
    this.copyPlainString(transText + '\n\n' + originalText)
  })


  let extractPromptMaxMin = function (itemTemplate) {
    let min = itemTemplate.find('.prompt-min').val()
    let max = itemTemplate.find('.prompt-max').val()
    let modify = itemTemplate.find('.prompt-modify').val()
    let type = itemTemplate.find('.prompt-type').val()
    let input = itemTemplate.find('.prompt-input').val()
    
    if (!min) {
      min = 3
    }
    if (!max) {
      max = 5
    }

    min = Number(min)
    max = Number(max)

    if (min > max) {
      let temp = max
      max = min
      min = temp
    }

    return {
      min, max, modify, type, input
    }
  }

  let _this = this
  let buildPrompt = function (itemTemplate, type, lang = 'en') {
    let {min, max, modify, input} = extractPromptMaxMin(itemTemplate)
    _this.promptMin = min
    _this.promptMax = max
    _this.promptModify = modify
    _this.promptType = type
    _this.promptInput = input
    // console.log(min, max, modify)

    let promptLeader = ``

    let modifyPrompt = ''
    if (modify === 'shorter') {
      modifyPrompt = ', shorter'
      if (lang !== 'en') {
        modifyPrompt = '，改寫得更短一些'
      }
    }
    else if (modify === 'very_short') {
      modifyPrompt = ', very short and simple'
      if (lang !== 'en') {
        modifyPrompt = '，改寫得非常短且簡單'
      }
    }
    else if (modify === 'longer') {
      modifyPrompt = ', longer'
      if (lang !== 'en') {
        modifyPrompt = '，改寫得更長一些'
      }
    }

    if (type === 'sentences') {
      let unit = 'sentences'
      
      if (min === 1 && max === 1) {
        unit = 'sentence'
      }

      if (lang !== 'en') {
        promptList = ''
      } 

      if (min === max) {
        promptLeader = `${min} ${unit} in a list${modifyPrompt}: `
        if (min === 1) {
          promptLeader = 'only ' + promptLeader
        }
        if (lang !== 'en') {
          promptLeader = `請使用正體中文(繁體中文)，將下面文字整理成${min}個句子，組成列點式清單${modifyPrompt}：`
        } 
      }
      else {
        promptLeader = `${min} to ${max} ${unit} in a list${modifyPrompt}: `
        if (lang !== 'en') {
          promptLeader = `請使用正體中文(繁體中文)，將下面文字整理成${min}到${max}個句子，組成列點式清單${modifyPrompt}：`
        } 
      }
    }
    else if (type === 'keywords') {
      let unit = 'keywords'
      if (min === 1 && max === 1) {
        unit = 'keyword'
      }
      if (min === max) {
        promptLeader = `${min} ${unit}${modifyPrompt}: `
        if (lang !== 'en') {
          promptLeader = `請使用正體中文，將下面文字整理成${min}個關鍵字${modifyPrompt}：`
        }
      }
      else {
        promptLeader = `${min} to ${max} ${unit}${modifyPrompt}: `
        if (lang !== 'en') {
          promptLeader = `請使用正體中文，將下面文字整理成${min}到${max}個關鍵字${modifyPrompt}：`
        }
      }
    }
    else if (type === 'paragraphs') {
      let unit = 'paragraphs'
      if (min === 1 && max === 1) {
        unit = 'paragraph'
      }
      if (min === max) {
        promptLeader = `Please format following text as ${min} ${unit}${modifyPrompt}: `
        if (lang !== 'en') {
          promptLeader = `請使用正體中文，將下面文字整理成${min}個段落${modifyPrompt}：`
        }
      }
      else {
        promptLeader = `Please format following text as ${min} to ${max} ${unit}${modifyPrompt}: `
        if (lang !== 'en') {
          promptLeader = `請使用正體中文，將下面文字整理成${min}到${max}個段落${modifyPrompt}：`
        }
      }
    }
    else if (type === 'mindmap') {
      
      promptLeader = `Please convert the following text into a mind map${modifyPrompt}, plain text, tab indented: `
      if (lang !== 'en') {
        promptLeader = `請使用正體中文，將下面文字整理成心智圖，使用純文字，用tab縮排${modifyPrompt}：`
      }
    }
    else if (type === 'quiz') {
      // let unit = 'options'
      if (min < 3) {
        min = 3
      }
      
      promptLeader = `Please build a quiz with ${min} options from the following text, and only one of the options is correct: `
      if (lang !== 'en') {
        promptLeader = `請使用正體中文，將下列文字改寫為選擇題，選項要有${min}個，其中只有一項是正確的：`
      }
    }
    else if (type === 'answer') {
      // let unit = 'options'
      if (min < 3) {
        min = 3
      }
      
      promptLeader = `Please create an answer question from the following text, and give an answer between 200 to 300 words: `
      if (lang !== 'en') {
        promptLeader = `請使用正體中文，將下列文字改寫為申論題，並且提供大約500字左右的答案。答案必須包含前言、本文及結論：`
      }
    }

    return promptLeader
  }
  
  this.addClickEvent(template, '.copy-prompt', (itemTemplate, originalText, transText, fromLang, toLang) => {

    let {min, max, modify, type, input} = extractPromptMaxMin(itemTemplate)

    let lang = fromLang
    let text = originalText
    if (input === 'trans') {
      lang = toLang
      text = transText
    }
    let promptLeader = buildPrompt(itemTemplate, type, lang)
    this.copyPlainString(promptLeader + '\n\n' + text)
  })
  // this.addClickEvent(template, '.copy-prompt-sentences-original', (itemTemplate, originalText, transText, fromLang, toLang) => {
  //   let promptLeader = buildPrompt(itemTemplate, 'sentences', fromLang)
  //   this.copyPlainString(promptLeader + '\n\n' + originalText)
  // })

  // this.addClickEvent(template, '.copy-prompt-keywords-original', (itemTemplate, originalText, transText, fromLang, toLang) => {
  //   let promptLeader = buildPrompt(itemTemplate, 'keywords', fromLang)
  //   this.copyPlainString(promptLeader + '\n\n' + originalText)
  // })

  // this.addClickEvent(template, '.copy-prompt-mindmap-original', (itemTemplate, originalText, transText, fromLang, toLang) => {
  //   let promptLeader = buildPrompt(itemTemplate, 'mindmap', fromLang)
  //   this.copyPlainString(promptLeader + '\n\n' + originalText)
  // })

  // this.addClickEvent(template, '.copy-prompt-sentences-trans', (itemTemplate, originalText, transText, fromLang, toLang) => {
  //   let promptLeader = buildPrompt(itemTemplate, 'sentences', toLang)
  //   this.copyPlainString(promptLeader + '\n\n' + transText)
  // })

  // this.addClickEvent(template, '.copy-prompt-keywords-trans', (itemTemplate, originalText, transText, fromLang, toLang) => {
  //   let promptLeader = buildPrompt(itemTemplate, 'keywords', toLang)
  //   this.copyPlainString(promptLeader + '\n\n' + transText)
  // })

  // this.addClickEvent(template, '.copy-prompt-mindmap-trans', (itemTemplate, originalText, transText, fromLang, toLang) => {
  //   let promptLeader = buildPrompt(itemTemplate, 'mindmap', toLang)
  //   this.copyPlainString(promptLeader + '\n\n' + transText)
  // })

  setTimeout(() => {
    this.resizeTextarea(template.find('.original-text')[0])
  }, 50)
}
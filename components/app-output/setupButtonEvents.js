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
      min, max, modify
    }
  }

  let _this = this
  let buildPrompt = function (itemTemplate, type, lang = 'en') {
    let {min, max, modify} = extractPromptMaxMin(itemTemplate)
    _this.promptMin = min
    _this.promptMax = max
    _this.promptModify = modify
    // console.log(min, max, modify)

    let promptLeader = ``

    let modifyPrompt = ''
    if (modify === 'shorter') {
      modifyPrompt = ', shorter'
      if (lang !== 'en') {
        modifyPrompt = '，更短一些'
      }
    }
    else if (modify === 'longer') {
      modifyPrompt = ', longer'
      if (lang !== 'en') {
        modifyPrompt = '，更長一些'
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
        if (lang !== 'en') {
          promptLeader = `整理成${min}個句子，組成清單${modifyPrompt}：`
        } 
      }
      else {
        promptLeader = `${min} to ${max} ${unit} in a list${modifyPrompt}: `
        if (lang !== 'en') {
          promptLeader = `整理成${min}到${max}個句子，組成清單${modifyPrompt}：`
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
          promptLeader = `整理成${min}個關鍵字${modifyPrompt}：`
        }
      }
      else {
        promptLeader = `${min} to ${max} ${unit}${modifyPrompt}: `
        if (lang !== 'en') {
          promptLeader = `整理成${min}到${max}個關鍵字${modifyPrompt}：`
        }
      }
    }

    return promptLeader
  }

  this.addClickEvent(template, '.copy-prompt-sentences-original', (itemTemplate, originalText, transText, fromLang, toLang) => {
    let promptLeader = buildPrompt(itemTemplate, 'sentences', fromLang)
    this.copyPlainString(promptLeader + '\n\n' + originalText)
  })

  this.addClickEvent(template, '.copy-prompt-keywords-original', (itemTemplate, originalText, transText, fromLang, toLang) => {
    let promptLeader = buildPrompt(itemTemplate, 'keywords', fromLang)
    this.copyPlainString(promptLeader + '\n\n' + originalText)
  })

  this.addClickEvent(template, '.copy-prompt-sentences-trans', (itemTemplate, originalText, transText, fromLang, toLang) => {
    let promptLeader = buildPrompt(itemTemplate, 'sentences', toLang)
    this.copyPlainString(promptLeader + '\n\n' + transText)
  })

  this.addClickEvent(template, '.copy-prompt-keywords-trans', (itemTemplate, originalText, transText, fromLang, toLang) => {
    let promptLeader = buildPrompt(itemTemplate, 'keywords', toLang)
    this.copyPlainString(promptLeader + '\n\n' + transText)
  })

  setTimeout(() => {
    this.resizeTextarea(template.find('.original-text')[0])
  }, 50)
}
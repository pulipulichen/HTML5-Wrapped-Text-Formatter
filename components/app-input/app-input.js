let appInput = {
  props: ['db'],
  components: {
    'app-config': httpVueLoader('./app-config/app-config.vue'),
  },
  data () {
    return {
      showInputPanel: true,
      enableDetectClipboard: true,
      lastClipbaordText: null,
      isDrafting: false
    }
  },
  mounted () {
    this.setupDetectClipboard()
    // setTimeout(() => {
      // console.log(this.db.localConfig, 2)
      // console.log(this.config)
      // console.log(this.db)
    // }, 3000)
    //this.testFormatText202210232207Chinese()

    // setTimeout(() => {
    //   this.testFormatText202210232208EnglishDash()
    // }, 1000)
    // console.log(this.isDrafting)

    setTimeout(() => {
      if (this.db.localConfig.input === '' && this.db.localConfig.lastInputText !== '') {
        this.db.localConfig.input = this.db.localConfig.lastInputText
      }
    }, 500)
  },
  computed: {
    transToLang () {
      let lang = this.db.localConfig.transToLang

      if (lang === 'auto') {
        if (this.detectLang.startsWith('zh')) {
          lang = 'en'
        }
        else {
          lang = 'zh-TW'
        }
      }

      return lang
    },
    transFromLang () {
      let lang = this.db.localConfig.transFromLang

      if (lang === 'auto') {
        lang = this.detectLang
      }

      return lang
    },
    detectLang () {
      let text = this.db.localConfig.input.trim().slice(0, 100)
      if (this.hasChinese(text)) {
        return 'zh-TW'
      }
      return 'en'
    },
  },
  watch: {
    'db.localConfig.input' (input) {
      if (input !== '' && this.$parent.inited === true) {
        this.isDrafting = true
        // console.log(this.isDrafting)
      }
    }
  },
  methods: {
    formatText: async function () {
      
      // console.log('formatText')

      let result = this.db.localConfig.input
      if (result === '') {
        let textFromClipboard = await this.getTextFromClipboard()
        if (textFromClipboard !== '') {
          result = textFromClipboard
          this.db.localConfig.input = result
        }
        else if (this.db.localConfig.lastInputText !== '') {
          result = this.db.localConfig.lastInputText
          this.db.localConfig.input = result
        }
        else {
          return false
        }
      }
      this.db.localConfig.lastInputText = result

      result = this.formatCorrectOCR(result)
      // console.log(result)
      result = this.formatConvertPunctuationMarks(result)
      result = this.formatJoinDash(result)
      result = this.formatJoinNewLine(result)
      result = this.formatRemoveQuote(result)
      result = this.formatRemoveQuoteSquareBrackets(result)
      result = this.formatRemoveDoubleSpaces(result)
      result = this.formatRemoveNumberNextToPeriod(result)
      result = this.formatConvertPunctuationMarks(result)
      // result = this.formatConvertQuotationToHalf(result)
      result = this.formatBreakSentence(result)
      result = this.formatAddPaddingLine(result)
      result = this.formatAutoCapitalize(result)
      result = this.formatAutoAppendPeriod(result)
      result = this.formatListItem(result)

      result = result.trim()

      this.$parent.$refs.AppOutput.addOutputItem({
        date: new Date(),
        text: result,
        transToLang: this.transToLang,
        transResult: ``
      })

      this.showInputPanel = false
      this.db.localConfig.input = ''
      this.enableDetectClipboard = false
      this.isDrafting = false
      // console.log(this.isDrafting)
    },
    formatAuthor () {
      this.showInputPanel = false
      
      let _source = this.db.localConfig.input
      this.db.localConfig.lastInputText = _source

      // 接下來做作者部分的重整
      // console.log(_source)
      // console.log(_source.indexOf(' ('))
      if (this.transFromLang.startsWith('zh')) {
        if (_source.indexOf('（') > -1) {
          _source = _source.slice(0, _source.indexOf('（'))
        }
          _source = _source.trim().split('、').map(name => name.trim()).join('\n')
      }

      else {
        if (_source.indexOf(' (') > -1) {
          _source = _source.substr(0, _source.indexOf(' (')).trim()
        }
        _source = _source.split(' and ').join(', ')
        let _authors = _source.split(',')
        let _outputAuthors = []
        // console.log(_authors)

        let _skipInterval = 2
        if (_authors.length % 2 === 1) {
          _skipInterval = 1
        }

        for (let _i = 0, _len = _authors.length; _i < _len; _i = _i + _skipInterval) {
          let _author = _authors[_i]
          if (_skipInterval === 2) {
            _author = _author + ', ' + _authors[(_i + 1)]
          }
          // console.log(_author)
          _author = _author.split('&').join('')
          let _nameSeperator = _author.indexOf(', ')
          if (_nameSeperator > -1) {
            let _lastName = _author.substr(0, _nameSeperator).trim()
            let _firstName = _author.slice(_nameSeperator + 1, _author.length).trim()
            // _author = _firstName + ' ' + _lastName
            _author = _lastName + '\t' + _firstName
          }
          _author = _author.trim()
          _outputAuthors.push(_author)
        }
        _source = _outputAuthors.join('\n')
      }

      this.$parent.$refs.AppOutput.addAuthorItem({
        date: new Date(),
        text: _source
      })
    },
    setupDetectClipboard () {
      let detectTimer
      window.addEventListener('focus', async () => {
        if (this.db.localConfig.detectClipboard && 
            this.enableDetectClipboard && 
            !this.isDrafting) {
          this.getInputFromClipboard()
        }

        if (this.isDrafting === true) {
          if (!(await this.appendClipboardToInput() ) && 
            this.db.localConfig.input.endsWith('\n') === false) {
            this.db.localConfig.input = this.db.localConfig.input + '\n'
          }
        }
      })

      window.addEventListener('blur', () => {
        if (this.enableDetectClipboard === true) {
          return false
        }

        clearTimeout(detectTimer)
        setTimeout(() => {
          this.enableDetectClipboard = true
        }, 1000)
      })
    },
    getInputFromClipboard: async function () {
      let text = await this.getTextFromClipboard()
      if (this.isClipboardAllow(text) === false) {
        return false
      }

      if (this.lastClipbaordText === text) {
        return false
      }
      // console.log('Pasted content: ', text);

      this.lastClipbaordText = text
      this.db.localConfig.input = text
      
      if (this.db.localConfig.pasteClipboardAndTrans) {
        this.formatText()
        setTimeout(() => {
          this.db.localConfig.input = text
          this.isDrafting = false
        }, 50)
        
      }
      else {
        this.showInputPanel = true
      }
    },
    appendClipboardToInput: async function () {
      // console.log(this.isDrafting)
      if (!this.db.localConfig.detectClipboard || this.isDrafting === false) {
        return false
      }

      let text = await this.getTextFromClipboard()
      if (this.isClipboardAllow(text) === false) {
        return false
      }
      if (this.lastClipbaordText.trim() === text.trim() || 
        this.db.localConfig.input.trim() === text.trim()) {
        return false
      }

      if (text.trim() === this.db.localConfig.input.trim()) {
        return false
      }

      if (!this.db.localConfig.input.endsWith('\n')) {
        this.db.localConfig.input = this.db.localConfig.input + '\n'
      }

      if (this.lastClipbaordText.trim() !== this.db.localConfig.input.trim()) {
        this.db.localConfig.input = this.db.localConfig.input + text
      }
      else {
        this.db.localConfig.input = text + '\n'
        this.isDrafting = false
      }
        

      this.lastClipbaordText = text

      return true
    },
    getTextFromClipboard () {
      return new Promise((resolve, reject) => {
        navigator.clipboard.readText()
        .then(resolve)
        .catch(err => {
          reject('Failed to read clipboard contents: ' + err);
        });
      })
    },
    isClipboardAllow (text) {
      if (text.length < this.db.localConfig.detectClipboardMinLength) {
        return false
      }

      text = text.trim()

      if (text.indexOf(' ') === -1 && 
        (text.indexOf('，') === -1 || text.indexOf('。') === -1)) {
        return false
      }

      // 如果文字是輸出結果中的某幾行，那我們不動
      let recentOutputs = $('.app-output').children().slice(0, 3)
      // console.log(recentOutputs.length, recentOutputs.find('textarea').length)
      let textareaList = recentOutputs.find('textarea')
      // let outputTexts = []
      for (let i = 0; i < textareaList.length; i++) {
        let value = textareaList.eq(i).val()
        if (value.indexOf(text) > -1) {
          return false
        }
      }
      
      return true
    },
    hasChinese (text) {
      return /[\u4e00-\u9fa5]/.test(text)
    },
    
    
    // formatConvertQuotationToHalf (text) {
    //   if (!this.db.localConfig.convertQuotationToHalf) {
    //     return text
    //   }

    //   return text
    // },
    
    removeSpaceInChinese (text) {
      //https://blog.miniasp.com/post/2019/01/02/Common-Regex-patterns-for-Unicode-characters
      // return text.replace(/([\u4e00-\u9fa5\uFF01-\uFF5E\u3000-\u3003\u3008-\u300F\u3010-\u3011\u3014-\u3015\u301C-\u301E][\s]+[\u4e00-\u9fa5\uFF01-\uFF5E\u3000-\u3003\u3008-\u300F\u3010-\u3011\u3014-\u3015\u301C-\u301E])/g, (match) => {
      //   return match[0] + match[2]
      // })
      return this.replaceInChinese(text, '[\\s]+')
    },
    replaceInChinese (text, from, to = '') {
      //https://blog.miniasp.com/post/2019/01/02/Common-Regex-patterns-for-Unicode-characters
      const hanRange = `\\u4e00-\\u9fa5\\uFF01-\\uFF5E\\u3000-\\u3003\\u3008-\\u300F\\u3010-\\u3011\\u3014-\\u3015\\u301C-\\u301E`
      
      text = text.replace(new RegExp(`(([0-9${hanRange}]|^)${from}([0-9${hanRange}]|$))`, 'g'), (match) => {
        if (match === from) {
          return to
        }
        if (match[0] === from[0]) {
          return to + match[(match.length - 1)]
        }
        if (match.slice(-1) === from.slice(-1)) {
          return match[0] + to
        }
        return match[0] + to + match[(match.length - 1)]
      })

      text = text.replace(new RegExp(`(([a-zA-Z]|^)${from}[${hanRange}])`, 'g'), (match) => {
        if (match[0] === from[0]) {
          return to + match[(match.length - 1)]
        }
        return match[0] + to + match[(match.length - 1)]
      })
      text = text.replace(new RegExp(`([${hanRange}]${from}([a-zA-Z]|$))`, 'g'), (match) => {
        if (match.slice(-1) === from.slice(-1)) {
          return match[0] + to
        }
        return match[0] + to + match[(match.length - 1)]
      })

      return text
    },
    processTextNotBrackets (text, handler) {
      let output = []
      let isHalf = true
      let leftPos = text.indexOf('(')
      if (leftPos === -1) {
        isHalf = false
        leftPos = text.indexOf('（')
      }
      // console.log({isHalf, leftPos})
      if (leftPos === -1) {
        return handler(text)
      }

      let splitor = ['(', ')']
      if (isHalf === false) {
        splitor = ['（', '）']
      }
     
      // console.log(text.split(splitor[0]))
      text.split(splitor[0]).forEach((t, i) => {
        // console.log(t, i)
        if (i === 0) {
          t = handler(t)
          output.push(t)
          return true
        }

        // let pos = t.lastIndexOf(splitor[1])
        let pos = t.indexOf(splitor[1])
        if (pos === -1) {
          output.push(splitor[0] + t)
          return true
        }

        let partInBrackets = t.slice(0, pos)
        let partOutBrackets = t.slice(pos + 1)
        partOutBrackets = handler(partOutBrackets)

        output.push(splitor[0] + partInBrackets + splitor[1] + partOutBrackets)
      })

      // console.log(output)

      return output.join('')
    },
    stripNl: function (_word) {
      return _word.split('\n').join('')
    },
    replaceAndTrim (text, char) {
      text = text.split(char + ' ').join(char + '\n')
      text = text.split(char + ' \n').join(char + '\n')
      return text
    },
    
    str_replace: function (_search, _replace, _subject, _count) {
      return _subject.split(_search).join(_replace)
    },
    formatCorrectOCR,
    formatConvertPunctuationMarks,
    formatJoinDash,
    formatJoinNewLine,
    formatRemoveQuote,
    formatRemoveQuoteSquareBrackets,
    formatRemoveDoubleSpaces,
    formatRemoveNumberNextToPeriod,
    formatBreakSentence,
    formatAddPaddingLine,
    formatAutoCapitalize,
    formatAutoAppendPeriod,
    formatListItem
  }
}

module.exports = appInput
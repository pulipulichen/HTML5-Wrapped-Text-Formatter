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

      // this.test20230601()
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
    formatText,
    formatAuthor,
    setupDetectClipboard,
    getInputFromClipboard,
    appendClipboardToInput,
    getTextFromClipboard () {
      return new Promise((resolve, reject) => {
        navigator.clipboard.readText()
        .then(resolve)
        .catch(err => {
          reject('Failed to read clipboard contents: ' + err);
        });
      })
    },
    isClipboardAllow,
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
      
      // return this.replaceInChinese(text, '[\\s]+')
      return this.replaceInChinese(text, '[ ]+')
    },
    replaceInChinese,
    processTextNotBrackets,
    stripNewLine: function (_word) {
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
    formatListItem,
    test20230601() {
      setTimeout(() => {
        this.formatText()
      }, 1000)
    }
  },  // methods
  
}

module.exports = appInput
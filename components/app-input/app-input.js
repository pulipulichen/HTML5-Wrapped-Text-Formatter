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
      result = this.formatConvertPunctuationMarks(result)
      // result = this.formatConvertQuotationToHalf(result)
      result = this.formatBreakSentence(result)
      result = this.formatAddPaddingLine(result)

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
    formatCorrectOCR (_source) {
      if (!this.db.localConfig.correctOCR) {
        return _source
      }

      Object.keys(this.db.config.OCRCorrectList).forEach((from) => {
        let to = this.db.config.OCRCorrectList[from]
        // _source = _source.split('ﬀ').join('ff')
        _source = _source.replace(new RegExp(from, 'g'), to)
      })

      // console.log(_source)

      if (this.transFromLang.startsWith('zh')) {
        _source = this.replaceInChinese(_source, '\\. ', '')
        // console.log(_source)
        // _source = this.replaceInChinese(_source, 'J。', '」。')
        _source = _source.replace(/\sJ。/g, '」。')
        _source = this.replaceInChinese(_source, 'J。', '」。')
      }
      
      // _source = _source.split('ﬁ').join('fi')

      do {
        _source = _source.split('  ').join(' ')
      }
      while (_source.indexOf('  ') > -1)

      // console.log('2')

      do {
        _source = _source.split('\t').join(' ')
      }
      while (_source.indexOf('\t') > -1)

      // console.log(_source)

      return _source.trim()
    },
    formatJoinDash (text) {
      if (!this.db.localConfig.joinDash) {
        return text
      }

      // if (this.transFromLang === 'en') {
        while (text.indexOf(' \n') > -1) {
          // _source = _googleTransUtils.str_replace(' \n', '\n', _source)
          text = text.split(' \n').join('\n')
        }
        // _source = _googleTransUtils.str_replace('-\n', '', _source)
        text = text.split('-\n').join('')

        text = text.replace(/[a-zA-Z]\-[\s]+[a-zA-Z]/g, (match) => {
          return match[0] + match[3]
        })
      // }

      return text
    },
    formatJoinNewLine (text) {
      if (!this.db.localConfig.joinNewLine) {
        return text
      }

      // 解決中文換行問題
      text = text.replace(/\n[\u4e00-\u9fa5]/g, function (_word) {
        // alert(_word);
        return _word.split('\n').join('')
      })

      text = text.split('\n').join(' ')

      return text
    },
    formatRemoveQuote (text) {
      if (!this.db.localConfig.removeQuote) {
        return text
      }

      let output = []
      let isHalf = true
      let leftPos = text.indexOf('(')
      if (leftPos === -1) {
        isHalf = false
        leftPos = text.indexOf('(')
      }
      if (leftPos === -1) {
        return text
      }

      let splitor = ['(', ')']
      if (isHalf === false) {
        splitor = ['（', '）']
      }
     
      text.split(splitor[0]).forEach((t, i) => {
        // console.log(t, i)
        if (i === 0) {
          output.push(t)
          return true
        }

        let pos = t.lastIndexOf(splitor[1])
        if (pos === -1) {
          output.push(splitor[0] + t)
          return true
        }

        // let partInBrackets = t.slice(0, pos)
        let partOutBrackets = t.slice(pos + 1)

        output.push(partOutBrackets)
      })

      text = output.join('')

      while (text.indexOf('  ') > -1) {
        text = text.replace(/  /g, ' ')
      }

      if (this.transFromLang.startsWith('zh')) {
        text = this.removeSpaceInChinese(text)
        // console.log(text)
      }
      

      return text
    },
    // formatConvertQuotationToHalf (text) {
    //   if (!this.db.localConfig.convertQuotationToHalf) {
    //     return text
    //   }

    //   return text
    // },
    formatConvertPunctuationMarks (text) {
      if (!this.db.localConfig.convertPunctuationMarks) {
        return text
      }

      if (this.transFromLang.startsWith('zh')) {
        // console.log(text)
        text = this.processTextNotBrackets(text, (t) => {
          t = t.replace(/\, /g, '，')
          t = t.replace(/\,/g, '，')

          // 修正數字的問題
          t = t.replace(/[0-9]，[0-9]/g, (matched) => matched[0] + matched[2])

          t = t.replace(/\?/g, '？')
          t = t.replace(/\:/g, '：')
          t = t.replace(/\;/g, '；')
          t = this.replaceInChinese(t, ';', '；')
          
          // t = t.replace(/([\u4e00-\u9fa5]\s[\u4e00-\u9fa5])/g, (match) => {
          //   return match[0] + match[2]
          // })
          t = this.removeSpaceInChinese(t)
          t = this.replaceInChinese(t, '{', '《')
          t = this.replaceInChinese(t, '}', '》')
          
          return t
        })
      }

      text = text.split('’').join("'")
      text = text.split('”').join('"')
      text = text.split('“').join('"')

      return text
    },
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
        leftPos = text.indexOf('(')
      }
      if (leftPos === -1) {
        return handler(text)
      }

      let splitor = ['(', ')']
      if (isHalf === false) {
        splitor = ['（', '）']
      }
     
      text.split(splitor[0]).forEach((t, i) => {
        // console.log(t, i)
        if (i === 0) {
          t = handler(t)
          output.push(t)
          return true
        }

        let pos = t.lastIndexOf(splitor[1])
        if (pos === -1) {
          output.push(splitor[0] + t)
          return true
        }

        let partInBrackets = t.slice(0, pos)
        let partOutBrackets = t.slice(pos + 1)
        partOutBrackets = handler(partOutBrackets)

        output.push(splitor[0] + partInBrackets + splitor[1] + partOutBrackets)
      })

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
    formatBreakSentence (text) {
      if (!this.db.localConfig.breakSentence) {
        return text
      }

      let _source = text
      
      if (this.transFromLang.startsWith('zh')) {
        _source = _source.split('• ').join('\n\n• ')
        _source = _source.split('。').join('。 \n\n')
        _source = _source.split('。」 ').join('。」 \n\n')

        _source = _source.split('； ').join('； \n\n')
        _source = this.str_replace('；', '；\n\n', _source)

        _source = this.str_replace('（ ', ' (', _source)
        _source = this.str_replace('  ( ', ' (', _source)
        _source = this.str_replace(' ）', ') ', _source)
        _source = this.str_replace(')  ', ') ', _source)

        _source = _source.replace(/\n，\n/g, '\n')

        _source = _source.replace(/\n\n」/g, '」\n\n')
      }

      if (this.transFromLang === 'en') {
        _source = this.processTextNotBrackets(_source, (_s) => {
          _s = this.replaceAndTrim(_s, '.')
          
          _s = this.replaceAndTrim(_s, ':')
          _s = this.replaceAndTrim(_s, '?')
          _s = this.replaceAndTrim(_s, ';')

          _s = this.replaceAndTrim(_s, `.'`)
          _s = this.replaceAndTrim(_s, `."`)
          _s = this.replaceAndTrim(_s, `; '`)

          _s = _s.split('• ').join('\n• ')

          // The two different basic philosophies are (1) to strive for an exhaustive list of resources and (2) to be more selective by carefully evaluating documents before linking them into the system.
          // _s = _s.replace(/\s\([0-9]+\)\s/g, (match) => {
          //   return '\n' + match.slice(1)
          // })
          
          // _s = this.replaceAndTrim(_s, `-`)
          
          
        //   _s = _s.split(".' ").join(".'\n")
        // // _s = _googleTransUtils.str_replace(": ", ": \n\n\n", _s);
        //   _s = _s.split('; ').join('; \n\n')

          // _s = _googleTransUtils.str_replace("e.g. \n\n", "e.g. ", _s); //舉例
          _s = _s.replace(/e\.g\. \n\n[^A-Z]/g, this.stripNl)

          // _s = _googleTransUtils.str_replace("i.e. \n\n", "i.e. ", _s); //即
          _s = _s.replace(/i\.e\. \n\n[^A-Z]/g, this.stripNl)

          // _s = _googleTransUtils.str_replace("et al. \n\n", "et al. ", _s); //等
          _s = _s.replace(/et al\. \n\n[^A-Z]/g, this.stripNl)
          // _s = _googleTransUtils.str_replace("etc. \n\n", "etc. ", _s); //等
          _s = _s.replace(/etc\. \n\n[^A-Z]/g, this.stripNl)

          // _s = _s.split('." ').join('." \n\n')
          _s = _s.split('." \n\n(').join('." (')

          _s = _s.replace(/p\. \n\n\d/g, function (_word) {
            // alert(_word);
            return _word.split('\n').join('')
          })

          _s = _s.split('–').join('– \n\n')

          _s = _s.replace(/[0-9]+\. \n\n[A-Z]/g, function (_word) {
            return '\n\n' + _word.split('\n').join('')
          })
          
          return _s
        })

        
        
        _source = _source.replace(/\d; \n\n/g, function (_word) {
          // alert(_word);
          return _word.split('\n').join('')
        })

        
      }
      
      // 20221023-2352 每一行都做trim
      _source = _source.split('\n').map(line => {
        line = line.trim()
        if (line.endsWith(' .')) {
          line = line.slice(0, -2) + '.'
        }
        if (line.endsWith(' ;')) {
          line = line.slice(0, -2) + ';'
        }
        return line
      }).join('\n')

      // 20221023-2239 把數字斷回來
      _source = _source.replace(/\n[0-9]+.\n/g, (match) => {
        return '\n' + match.trim() + ' '
      })

        // for (var _i = 1; _i < 10; _i++) {
        //    _source = _googleTransUtils.str_replace(" (" + _i + ")", " \n\n(" + _i + ")", _source);
        // }

      // console.log(_source)

      _source = _source.split('\n ').join('\n')
      
      // console.log(_source)

      _source = _source.trim()
      while (_source.indexOf('\n\n\n') > -1) {
        _source = _source.split('\n\n\n').join('\n\n')
        _source = _source.trim()
      }
      
      return _source
    },
    formatAddPaddingLine (text) {
      text = text.trim()
      if (!this.db.localConfig.addPaddingLine) {
        while (text.indexOf('\n\n') > -1) {
          text = text.replace(/\n\n/g, '\n')
        }
        return text
      }

      text = text.split('\n').join('\n\n')

      while (text.indexOf('\n\n\n') > -1) {
        text = text.split('\n\n\n').join('\n\n')
        text = text.trim()
      }

      return text
    },
    str_replace: function (_search, _replace, _subject, _count) {
      return _subject.split(_search).join(_replace)
    }
  }
}

module.exports = appInput
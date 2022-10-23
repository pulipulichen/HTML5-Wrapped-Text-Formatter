let appInput = {
  props: ['db'],
  components: {
    'app-config': httpVueLoader('./app-config/app-config.vue'),
  },
  data () {
    return {
      enableDetectClipboard: true,
      lastClipbaordText: null
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
    this.testFormatText202210232208EnglishDash()
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
  },
  methods: {
    formatText () {
      
      // console.log('formatText')

      let result = this.db.localConfig.input

      result = this.formatCorrectOCR(result)
      result = this.formatConvertPunctuationMarks(result)
      result = this.formatJoinDash(result)
      result = this.formatJoinNewLine(result)
      result = this.formatRemoveQuote(result)
      // result = this.formatConvertQuotationToHalf(result)
      result = this.formatBreakSentence(result)
      result = this.formatAddPaddingLine(result)

      result = result.trim()

      this.db.output.unshift({
        date: new Date(),
        text: result,
        transToLang: this.transToLang,
        transResult: ``
      })

      this.db.localConfig.showInputPanel = false
      this.db.localConfig.input = ''
      this.enableDetectClipboard = false
    },
    testFormatText202210232207Chinese () {
      this.db.localConfig.input = `在國內,語言學 (linguistics) 或 語言科學 (linguistic science) 仍 然是一門相當陌生而新奇的學間。不但一般社會大眾對語言學素昧平 生 , 就是大多數從事語文 (不管是中文、中語或外文、外語) 教學的 人對於語言學研究的目標、方法以及對語言教學的可能貢獻都不甚了 解。其實,人類對語言的關心與興趣有相當久遠的歷史。早在公元前 四世紀,印度的高僧巴尼尼 (Panini) LA} WX (Sanskrit) 經書的讀 音留下了相當精密而明確的描述;而在差不多與此同時,希臘的哲儒 柏拉圖 (Plato, 427-347 B.C.) 與哲學家亞里斯多德 (Aristotle, 384-322 B.C.) 也發表了不少有關語言方面的論述。及至羅馬帝國 (Roman Empire, 27 B.C.) 興起,拉丁文遂成為支配全歐洲政治、經濟、法 律、文化、社會與學術的 共通語 (lingua franca)。各地學者爭相研究 拉丁文法,並試圖在拉丁文法的間架上建立起 地方語 (vernacular) 的文法來。到了十九世紀末葉,大英帝國 (the British Empire) 的國 威與影響力獲得空前的伸展,英語在國際上的地位遂取代了從前的拉 丁文與法語,一時各國研究英語語法的學者 (如 O. Jespersen, G_O. Curme, H. Poutsma, E. Kruisinga 等) 人才輩出。一九三零年代前後 , 凌國 結構學派 (structuralistb 語言學家 (其代表人物為E. Sapir BEL. Bloomfield) 從事北美印地安語言的研究,並以自認為科學的方法逐`
      this.formatText()
    },
    testFormatText202210232208EnglishDash () {
      this.db.localConfig.input = `The  following  general  steps  are  suggested  for  constructing  a  thesaurus: 
1.  Identify  the  subject  field.  The  boundaries  of  the  subject  field  should 
be  clearly  defined  and  the  parameters  set  to  indicate  which areas  will 
be  emphasized  and  which  will  be  given  only  cursory  treatment.
2.  Identify  the  nature  of  the  literature  to  be  indexed.  Is  it  primarily 
journal  literature?  Or  does  it  consist  of  books,  reports,  conference 
papers,  etc.?  Is  it  retrospective  or  current?  If  it  is  retrospective,  then 
it  will  be  more  complex  to  make  changes  in  the  thesaurus.  Will  most 
of  the  material  be  on  the  Web? 
3.  Identify  the  users.  What  are  their  information  needs?  Will  they  be 
doing  their  own  searching  or  will  someone  do  it  for  them?  Will  their 
questions  be  broad  or  specific? 
4.  Identify  the  file  structure.  Will  this  be  a  pre-coordinated  or  post- 
coordinated  system? 
5.  Consult  published  indexes,  glossaries,  dictionaries,  and  other  tools 
in  the  subject  areas  for  the  raw vocabulary.  This  should  not be  done 
necessarily  with  the  idea  of  copying  terms,  but  such  perusal  can  in- 
crease  the  thesaurus  designer’s  understanding  of  the  terminology 
and  semantic  relationships  in  the  field. 
6.  Cluster  the  terms. 
7.  Establish  term  relationships. `
      this.formatText()
    },
    formatAuthor () {
      this.db.localConfig.showInputPanel = false
      console.log('formatAuthor')
    },
    setupDetectClipboard () {
      let detectTimer
      window.addEventListener('focus', () => {
        if (this.db.localConfig.detectClipboard) {
          this.getInputFromClipboard()
        }
      })

      window.addEventListener('blur', () => {
        if (this.enableDetectClipboard === true) {
          return false
        }

        clearTimeout(detectTimer)
        setTimeout(() => {
          this.enableDetectClipboard = true
        }, 5000)
      })
    },
    getInputFromClipboard () {
      navigator.clipboard.readText()
        .then(text => {
          if (this.lastClipbaordText === text) {
            return false
          }
          // console.log('Pasted content: ', text);

          this.lastClipbaordText = text
          this.db.localConfig.input = text
          
          if (this.db.localConfig.pasteClipboardAndTrans) {
            this.formatText()
          }
          else {
            this.db.localConfig.showInputPanel = true
          }
        })
        .catch(err => {
          console.error('Failed to read clipboard contents: ', err);
        });
    },
    hasChinese (text) {
      return /[\u4e00-\u9fa5]/.test(text)
    },
    formatCorrectOCR (_source) {
      if (!this.db.localConfig.correctOCR) {
        return _source
      }

      _source = _source.split('ﬀ').join('ff')
      _source = _source.split('ﬁ').join('fi')

      do {
        _source = _source.split('  ').join(' ')
      }
      while (_source.indexOf('  ') > -1)

      // console.log('2')

      do {
        _source = _source.split('\t').join(' ')
      }
      while (_source.indexOf('\t') > -1)

      return _source.trim()
    },
    formatJoinDash (text) {
      if (!this.db.localConfig.joinDash) {
        return text
      }

      if (this.transFromLang === 'en') {
        while (text.indexOf(' \n') > -1) {
          // _source = _googleTransUtils.str_replace(' \n', '\n', _source)
          text = text.split(' \n').join('\n')
        }
        // _source = _googleTransUtils.str_replace('-\n', '', _source)
        text = text.split('-\n').join('')
      }

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

      text = text.replace(/\n\d+$/g, '')
      text = text.replace(/\n\d+ /g, '\n')

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
        text = this.processTextNotBrackets(text, (t) => {
          t = t.replace(/\, /g, '，')
          t = t.replace(/\,/g, '，')
          t = t.replace(/([\u4e00-\u9fa5]\s[\u4e00-\u9fa5])/g, (match) => {
            return match[0] + match[2]
          })

          return t
        })
      }

      text = text.split('’').join("'")
      text = text.split('”').join('"')
      text = text.split('“').join('"')

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
        console.log(t, i)
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
      
      if (!this.db.localConfig.addPaddingLine) {
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
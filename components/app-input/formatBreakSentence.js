let formatBreakSentence = function (text) {
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
    _source = _source.replace(/\n^\n/g, '\n')

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
      _s = _s.replace(/e\.g\. \n\n[^A-Z]/g, this.stripNewLine)

      // _s = _googleTransUtils.str_replace("i.e. \n\n", "i.e. ", _s); //即
      _s = _s.replace(/i\.e\. \n\n[^A-Z]/g, this.stripNewLine)

      // _s = _googleTransUtils.str_replace("et al. \n\n", "et al. ", _s); //等
      _s = _s.replace(/et al\. \n\n[^A-Z]/g, this.stripNewLine)
      // _s = _googleTransUtils.str_replace("etc. \n\n", "etc. ", _s); //等
      _s = _s.replace(/etc\. \n\n[^A-Z]/g, this.stripNewLine)
      
      // console.log(_s.split('\n'))
      _s = _s.replace(/\s[A-Z]\.\n[A-Z]/g, function (_word) {
        // console.log(_word)
        return _word.split('\n').join(' ')
      })

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
}
let formatAuthor = function () {
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
}
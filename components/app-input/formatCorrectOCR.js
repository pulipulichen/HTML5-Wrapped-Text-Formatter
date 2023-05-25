let formatCorrectOCR = function (_source) {
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
}
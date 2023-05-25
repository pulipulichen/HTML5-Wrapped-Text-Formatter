let formatJoinDash = function (text) {
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
}
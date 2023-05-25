let formatRemoveNumberNextToPeriod = function (text) {
  if (!this.db.localConfig.removeNumberNextToPeriod || 
      this.transFromLang !== 'en') {
    return text
  }
  
  // console.log(text)
  text = text.replace(/\.\d+ /g, '. ')
  text = text.replace(/\.\d+$/g, '.')
  text = text.replace(/\."\d+ /g, '." ')
  text = text.replace(/\."\d+$/g, '."')
  text = text.replace(/\.'\d+ /g, '.\' ')
  text = text.replace(/\.'\d+$/g, '.\'')

  text = text.replace(/\?\d+ /g, '. ')
  text = text.replace(/\?\d+$/g, '.')

  text = text.replace(/\?"\d+ /g, '?" ')
  text = text.replace(/\?"\d+$/g, '?"')
  text = text.replace(/\?'\d+ /g, '?\' ')
  text = text.replace(/\?'\d+$/g, '?\'')
  // console.log(text) 

  while (text.indexOf('  ') > -1) {
    text = text.replace(/  /g, ' ')
  }

  return text
}
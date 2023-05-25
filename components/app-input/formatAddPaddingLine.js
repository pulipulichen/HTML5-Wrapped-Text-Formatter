let formatAddPaddingLine = function (text) {
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
}
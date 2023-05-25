let formatRemoveDoubleSpaces = function (text) {
  if (!this.db.localConfig.removeDoubleSpaces) {
    return text
  }
  
  while (text.indexOf('  ') > -1) {
    text = text.replace(/  /g, ' ')
  }

  return text
}
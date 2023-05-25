let formatAutoCapitalize = function (text) {
      
  if (!this.db.localConfig.autoCapitalize || this.hasChinese(text)) {
    return text
  }
  
  text = text.split('\n').map(line => {
    if (line.length === 0) {
      return line
    }
    line = line.trim()
    let firstChar = line.slice(0, 1)
    firstChar = firstChar.toUpperCase()
    line = firstChar + line.slice(1)

    return line
  }).join('\n')

  return text
}
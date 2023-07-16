let formatAutoAppendPeriod = function (text) {
      
  if (!this.db.localConfig.autoAppendPeriod) {
    return text
  }
  
  text = text.split('\n').map(line => {
    if (line.length === 0) {
      return line
    }

    line = line.trim()
    if (this.hasChinese(line) === false && 
        line.indexOf(' ') === -1) {
      return line
    }

    let lastChar = line.slice(-1)
    // console.log(lastChar)
    
    if (".。'\":;：–；…」?？!！]".indexOf(lastChar) === -1) {
      if ('，'.indexOf(lastChar) !== -1) {
        line = line.slice(0, -1)
      }
      if (this.hasChinese(line)) {
        line = line + '。'
      }
      else {
        line = line + '.'
      }
    }

    return line
  }).join('\n')

  return text
}
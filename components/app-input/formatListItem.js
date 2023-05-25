let formatListItem = function (text) {
      
  if (!this.db.localConfig.removeListItem) {
    return text
  }
  
  let rules = [
    '• ',
    ' '
  ]

  text = text.split('\n').map(line => {
    if (line.length === 0) {
      return line
    }

    line = line.trim()
    
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i]

      if (line.startsWith(rule)) {
        line = line.slice(rule.length).trim()

        return line
      }
    }

    return line
  }).join('\n')

  return text
}
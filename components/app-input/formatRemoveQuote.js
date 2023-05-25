let formatRemoveQuote = function (text) {
  if (!this.db.localConfig.removeQuote) {
    return text
  }

  let output = []
  let isHalf = true
  let leftPos = text.indexOf('(')
  if (leftPos === -1) {
    isHalf = false
    leftPos = text.indexOf('（')
  }
  if (leftPos === -1) {
    return text
  }

  let splitor = ['(', ')']
  if (isHalf === false) {
    splitor = ['（', '）']
  }
 
  text.split(splitor[0]).forEach((t, i) => {
    // console.log(t, i)
    if (i === 0) {
      output.push(t)
      return true
    }

    let pos = t.lastIndexOf(splitor[1])
    if (pos === -1) {
      output.push(splitor[0] + t)
      return true
    }

    // let partInBrackets = t.slice(0, pos)
    let partOutBrackets = t.slice(pos + 1)

    output.push(partOutBrackets)
  })

  text = output.join('')

  while (text.indexOf('  ') > -1) {
    text = text.replace(/  /g, ' ')
  }

  if (this.transFromLang.startsWith('zh')) {
    text = this.removeSpaceInChinese(text)
    // console.log(text)
  }
  

  return text
}
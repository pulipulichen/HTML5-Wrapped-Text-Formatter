let formatJoinNewLine = function (text) {
  // console.log(this.db.localConfig.joinNewLine)
  if (!this.db.localConfig.joinNewLine) {
    return text
  }

  while (text.indexOf(`\n\n\n`) > -1) {
    text = text.split('\n\n\n').join('\n\n')
  }

  text = text.split('\n\n').map(t => {
    // console.log(t)

    // 解決中文換行問題
    t = t.replace(/\n[\u4e00-\u9fa5]/g, function (_word) {
      // alert(_word);
      return _word.split('\n').join('')
    })

    t = t.split('\n').join(' ')

    return t
  }).join('\n\n')

  // while (text.indexOf(`\n\n\n`) > -1) {
  //   text = text.split('\n\n\n').join('\n\n')
  // }
  // text = text.split('\n').join(' ')

  return text
}
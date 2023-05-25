let formatJoinNewLine = function (text) {
  if (!this.db.localConfig.joinNewLine) {
    return text
  }

  // 解決中文換行問題
  text = text.replace(/\n[\u4e00-\u9fa5]/g, function (_word) {
    // alert(_word);
    return _word.split('\n').join('')
  })

  text = text.split('\n').join(' ')

  return text
}
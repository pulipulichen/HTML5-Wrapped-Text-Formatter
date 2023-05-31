let isClipboardAllow = function (text) {
  if (text.length < this.db.localConfig.detectClipboardMinLength) {
    return false
  }

  text = text.trim()

  if (text.indexOf(' ') === -1 && 
    (text.indexOf('，') === -1 || text.indexOf('。') === -1)) {
    return false
  }

  // 如果文字是輸出結果中的某幾行，那我們不動
  let recentOutputs = $('.app-output').children().slice(0, 3)
  // console.log(recentOutputs.length, recentOutputs.find('textarea').length)
  let textareaList = recentOutputs.find('textarea')
  // let outputTexts = []
  for (let i = 0; i < textareaList.length; i++) {
    let value = textareaList.eq(i).val()
    if (value.indexOf(text) > -1) {
      return false
    }
  }
  
  return true
}
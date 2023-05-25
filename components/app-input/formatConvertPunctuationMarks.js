let formatConvertPunctuationMarks = function (text) {
  if (!this.db.localConfig.convertPunctuationMarks) {
    return text
  }

  if (this.transFromLang.startsWith('zh')) {
    // console.log(text)
    text = this.processTextNotBrackets(text, (t) => {
      t = t.replace(/\, /g, '，')
      t = t.replace(/\,/g, '，')

      // 修正數字的問題
      t = t.replace(/[0-9]，[0-9]/g, (matched) => matched[0] + matched[2])

      t = t.replace(/\?/g, '？')
      t = t.replace(/\:/g, '：')
      t = t.replace(/\;/g, '；')
      t = t.replace(/。\^/g, '。')
      t = this.replaceInChinese(t, ';', '；')
      t = this.replaceInChinese(t, '\\?', '？')
      
      // t = t.replace(/([\u4e00-\u9fa5]\s[\u4e00-\u9fa5])/g, (match) => {
      //   return match[0] + match[2]
      // })
      t = this.removeSpaceInChinese(t)
      t = this.replaceInChinese(t, '{', '《')
      t = this.replaceInChinese(t, '}', '》')
      
      // console.log(t)
      t = this.replaceInChinese(t, 'j，', '」，')          
      t = this.replaceInChinese(t, 'j。', '」。')          

      return t
    })
  }

  text = text.split('’').join("'")
  text = text.split('”').join('"')
  text = text.split('“').join('"')

  // console.log(text.split('\n^\n'))
  // text = text.replace(/\n^\n/g, '\n')

  return text
}
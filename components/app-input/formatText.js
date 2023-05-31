let formatText = async function () {
      
  // console.log('formatText')

  let result = this.db.localConfig.input
  if (result === '') {
    let textFromClipboard = await this.getTextFromClipboard()
    if (textFromClipboard !== '') {
      result = textFromClipboard
      this.db.localConfig.input = result
    }
    else if (this.db.localConfig.lastInputText !== '') {
      result = this.db.localConfig.lastInputText
      this.db.localConfig.input = result
    }
    else {
      return false
    }
  }
  this.db.localConfig.lastInputText = result

  result = this.formatCorrectOCR(result)
  // console.log(result)
  result = this.formatConvertPunctuationMarks(result)
  result = this.formatJoinDash(result)
  result = this.formatJoinNewLine(result)
  result = this.formatRemoveQuote(result)
  result = this.formatRemoveQuoteSquareBrackets(result)
  result = this.formatRemoveDoubleSpaces(result)
  result = this.formatRemoveNumberNextToPeriod(result)
  result = this.formatConvertPunctuationMarks(result)
  // result = this.formatConvertQuotationToHalf(result)
  result = this.formatBreakSentence(result)
  result = this.formatAddPaddingLine(result)
  result = this.formatAutoCapitalize(result)
  result = this.formatAutoAppendPeriod(result)
  result = this.formatListItem(result)

  result = result.trim()

  this.$parent.$refs.AppOutput.addOutputItem({
    date: new Date(),
    text: result,
    transFromLang: this.transFromLang,
    transToLang: this.transToLang,
    transResult: ``
  })

  this.showInputPanel = false
  this.db.localConfig.input = ''
  this.enableDetectClipboard = false
  this.isDrafting = false
  // console.log(this.isDrafting)
}
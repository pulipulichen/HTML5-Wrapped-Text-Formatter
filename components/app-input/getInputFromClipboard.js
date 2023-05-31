let getInputFromClipboard = async function () {
  let text = await this.getTextFromClipboard()
  if (this.isClipboardAllow(text) === false) {
    return false
  }

  if (this.lastClipbaordText === text) {
    return false
  }
  // console.log('Pasted content: ', text);

  this.lastClipbaordText = text
  this.db.localConfig.input = text
  
  if (this.db.localConfig.pasteClipboardAndTrans) {
    this.formatText()
    setTimeout(() => {
      this.db.localConfig.input = text
      this.isDrafting = false
    }, 50)
    
  }
  else {
    this.showInputPanel = true
  }
}
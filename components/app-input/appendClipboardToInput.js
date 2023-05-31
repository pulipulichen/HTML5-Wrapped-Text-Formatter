let appendClipboardToInput = async function () {
  // console.log(this.isDrafting)
  if (!this.db.localConfig.detectClipboard || this.isDrafting === false) {
    return false
  }

  let text = await this.getTextFromClipboard()
  if (this.isClipboardAllow(text) === false) {
    return false
  }
  if (this.lastClipbaordText.trim() === text.trim() || 
    this.db.localConfig.input.trim() === text.trim()) {
    return false
  }

  if (text.trim() === this.db.localConfig.input.trim()) {
    return false
  }

  if (!this.db.localConfig.input.endsWith('\n')) {
    this.db.localConfig.input = this.db.localConfig.input + '\n'
  }

  if (this.lastClipbaordText.trim() !== this.db.localConfig.input.trim()) {
    this.db.localConfig.input = this.db.localConfig.input + text
  }
  else {
    this.db.localConfig.input = text + '\n'
    this.isDrafting = false
  }
    

  this.lastClipbaordText = text

  return true
}
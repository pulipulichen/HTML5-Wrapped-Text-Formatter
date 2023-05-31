let setupDetectClipboard = function () {
  let detectTimer
  window.addEventListener('focus', async () => {
    if (this.db.localConfig.detectClipboard && 
        this.enableDetectClipboard && 
        !this.isDrafting) {
      this.getInputFromClipboard()
    }

    if (this.isDrafting === true) {
      if (!(await this.appendClipboardToInput() ) && 
        this.db.localConfig.input.endsWith('\n') === false) {
        this.db.localConfig.input = this.db.localConfig.input + '\n'
      }
    }
  })

  window.addEventListener('blur', () => {
    if (this.enableDetectClipboard === true) {
      return false
    }

    clearTimeout(detectTimer)
    setTimeout(() => {
      this.enableDetectClipboard = true
    }, 1000)
  })
}
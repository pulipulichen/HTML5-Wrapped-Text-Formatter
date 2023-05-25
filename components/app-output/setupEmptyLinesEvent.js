let setupEmptyLinesEvent = function (template) {
  this.addClickEvent(template, '.collapse-empty-lines', (itemTemplate, originalText, transText) => {
    if (originalText.indexOf('\n\n') > -1) {
      while (originalText.indexOf('\n\n') > -1) {
        originalText = originalText.replace(/\n\n/g, '\n')
        originalText = originalText.trim()
      }

      while (transText && transText.indexOf('\n\n') > -1) {
        transText = transText.replace(/\n\n/g, '\n')
        transText = transText.trim()
      }
      
      itemTemplate.find('.original-text').val(originalText)
      if (transText) {
        itemTemplate.find('.trans-text').val(transText)
      }
      itemTemplate.removeClass('expended-empty-lines')
      itemTemplate.find('.original-text').select()
    }
  })

  this.addClickEvent(template, '.expand-empty-lines', (itemTemplate, originalText, transText) => {
    if (originalText.indexOf('\n\n') == -1) {
      while (originalText.indexOf('\n') > -1 && originalText.indexOf('\n\n') == -1) {
        originalText = originalText.replace(/\n/g, '\n\n')
        originalText = originalText.trim()
      }

      while (originalText.indexOf('\n\n\n') > -1) {
        originalText = originalText.replace(/\n\n\n/g, '\n\n')
        originalText = originalText.trim()
      }

      while (transText && transText.indexOf('\n') > -1 && transText.indexOf('\n\n') == -1) {
        transText = transText.replace(/\n/g, '\n\n')
        transText = transText.trim()
      }

      while (transText && transText.indexOf('\n\n\n') > -1) {
        transText = transText.replace(/\n\n\n/g, '\n\n')
        transText = transText.trim()
      }

      itemTemplate.find('.original-text').val(originalText)
      if (transText) {
        itemTemplate.find('.trans-text').val(transText)
      }
      
      itemTemplate.addClass('expended-empty-lines')
      itemTemplate.find('.original-text').select()
    }
  })

  if (template.find('.original-text').val().trim().indexOf('\n\n') > -1) {
    template.addClass('expended-empty-lines')
  }
}
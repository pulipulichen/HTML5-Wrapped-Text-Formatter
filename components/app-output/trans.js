let trans = async function (itemTemplate) {
  let _source = itemTemplate.find('.original-text').val()
  if (_source.trim() === '') {
    return false
  }

  while (this.transTextarea.classList.contains('wait')) {
    await this.sleep()
  }

  _source = itemTemplate.find('.original-text').val()

  this.transTextarea.value = ''
  this.transTextarea.classList.add('wait')
  /*
  let win = window.open('transTemp.html', '_blank', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=10,height=10,left=1000000,top=10000000')
  $(win).load(function () {
    // console.log($(win.document.body).find('#source').length)
    $(win.document.head).find('title').html(_source)
    $(win.document.body).find('#source').html(_source)
    $(win.document.body).find('#originalSource').val(_source)
  })
  */
  // 改用iframe
  let iframe = this.transIframe
  let iframewindow= iframe.contentWindow? iframe.contentWindow : iframe.contentDocument.defaultView;
  let iframeBody = $(iframewindow.document.body)
  iframeBody.find('#source').html(_source)
  iframeBody.find('#originalSource').val(_source)
  //console.log(this.value)
  iframewindow.setGoogleTransCookie(itemTemplate.find('.trans-to-lang').val())
  iframewindow.googleTranslateElementInit()

  while (this.transTextarea.value === '') {
    await this.sleep()
  }

  let result = this.transTextarea.value
  this.transTextarea.value = ''
  this.transTextarea.classList.remove('wait')

  // console.log(this.transTextarea.value)

  // this.item.transResult = result
  let transTextarea = itemTemplate.find('.trans-text')[0]
  transTextarea.value = result
  setTimeout(() => {
    this.resizeTextarea(transTextarea)
  }, 50)
  
  itemTemplate.removeClass('transable')
  // console.log($(iframewindow.document.body).find('#source').length)
}

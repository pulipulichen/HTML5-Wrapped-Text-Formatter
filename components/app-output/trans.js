let trans = async function (itemTemplate) {
  let _source = itemTemplate.find('.original-text').val()
  if (_source.trim() === '') {
    return false
  }

  // console.log('trans', 1)

  while (this.transTextarea.classList.contains('wait')) {
    await this.sleep()
  }

  // console.log('trans', 2)

  _source = itemTemplate.find('.original-text').val()

  this.transTextarea.value = ''
  this.transTextarea.classList.add('wait')

  // console.log('trans', 3)
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

  // console.log('trans', 4)

  iframeBody.find('#source').html(_source)
  iframeBody.find('#originalSource').val(_source)

  // console.log('trans', 5, itemTemplate.find('.trans-to-lang').val())
  //console.log(this.value)
  iframewindow.setGoogleTransCookie(itemTemplate.find('.trans-to-lang').val())
  
  iframewindow.googleTranslateElementInit()

  // console.log('trans', 6)

  while (this.transTextarea.value === '') {
    await this.sleep()
  }

  // console.log('trans', 7)

  let result = this.transTextarea.value
  this.transTextarea.value = ''
  this.transTextarea.classList.remove('wait')

  // console.log('trans', 8)

  // console.log(this.transTextarea.value)

  // this.item.transResult = result
  let transTextarea = itemTemplate.find('.trans-text')[0]
  transTextarea.value = result
  setTimeout(() => {
    this.resizeTextarea(transTextarea)
  }, 50)

  // console.log('trans', 9)
  
  itemTemplate.removeClass('transable')
  // console.log($(iframewindow.document.body).find('#source').length)
}

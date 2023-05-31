PopupUtils = {
  open: function (options = {}) {
    let {
      windowName = 'popup' + (new Date()).getTime(),
      cssURL,
      bodyHTML,
      title = window.document.title,
      size = 'fullscreen' // 'fullscreen', 'left', 'right'
    } = options
    
    let top = 0
    let left = 0
    let width = window.screen.availWidth
    let height = window.screen.availHeight
    
    
    if (size === 'left') {
      width = parseInt(width / 2, 10)
    }
    else if (size === 'right') {
      width = parseInt(width / 2, 10)
      left = width
    }
    
    let parameters = [
      'toolbar=no',
      'location=no',
      'status=no',
      'menubar=no',
      'scrollbars=yes',
      'resizable=yes',
      'width=' + width,
      'height=' + height,
      'top=' + top,
      'left=' + left
    ]
    //console.log(windowName)
    let win = window.open('', windowName, parameters.join(','))
    
    // ------------------------------
    
    let isReady = false
    
    let doc = win.document
    
    if (cssURL) {
      
      var head  = doc.getElementsByTagName('head')[0];
      var link  = doc.createElement('link');
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = cssURL
      //link.media = 'all';
      head.appendChild(link);
    }
    
    if (bodyHTML) {
      doc.body.innerHTML = bodyHTML
      isReady = true
    }
    
    if (title) {
      doc.title = title
    }
    
    win.setHTML = (html) => {
      doc.body.innerHTML = html
      isReady = true
    }
    
    win.clearHTML = () => {
      doc.body.innerHTML = ''
    }
    
    win.setTitle = (title) => {
      doc.title = title
    }
    
    let waitReady = async () => {
      while (isReady === false) {
        await this.sleep()
      }
    }
    
    win.scrollToCenter = async () => {
      //console.log('1')
      await waitReady()
      //console.log('2', win.document.body.scrollWidth, win.innerWidth)
      let scrollLeft =  parseInt((win.document.body.scrollWidth - win.innerWidth) / 2, 10)
      //console.log(scrollLeft)
      win.scrollTo(scrollLeft, null)
    }
    
    win.scrollToTop = async () => {
      await waitReady()
      win.scrollTo(null, 0)
    }
    return win
  },
  sleep: function (ms = 50) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  openURLFullscreen (event) {
    event.preventDefault()
    // console.log(event)
    let url = event.target.href

    // https://stackoverflow.com/a/189931

    var popup = window.open(url, url, "width="+screen.availWidth+",height="+screen.availHeight);
    if (popup == null)
       alert('Please change your popup settings');
    else  {
      popup.moveTo(0, 0);
      // popup.resizeTo(screen.availWidth, screen.availHeight);
    }
  }
}
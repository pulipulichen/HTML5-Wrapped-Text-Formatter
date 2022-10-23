let appOutputItem = {
  props: ['db', 'item'],
  data () {
    return {
      showItem: true,
      // transResult: '',
      transIframe: document.getElementById('transTempIframe'),
      transTextarea: document.getElementById('waitForTrans'),
      isWaiting: false,
      transable: true
    }
  },
  mounted () {
    // setTimeout(() => {
    
    // this.resizeTransTextarea()
    setTimeout(() => {
      this.resizeOriginalTextarea()
      
      // this.item.transResult = ''
      if (this.item.transResult === '') {
        this.trans()
      }
      // console.log('gogogo')
    }, 1000)
    // }, 50)
  },
  computed: {
    date () {
      let date = this.item.date

      let hh = this.paddingZero(date.getHours())
      let mm = this.paddingZero(date.getMinutes())
      let ss = this.paddingZero(date.getSeconds())
      return `${hh}:${mm}:${ss}`
    },
    langs () {
      let langs = this.db.config.langs.filter(lang => lang.value !== 'auto')
      return langs
    }
  },
  watch: {
    'item.text' () {
      this.resizeOriginalTextarea()
      this.transable = true
    },
    'item.transResult' () {
      this.resizeTransTextarea()
    },
    'item.transToLang' () {
      this.transable = true
    }
  },
  methods: {
    paddingZero (value) {
      if (value < 10) {
        value = '0' + value
      }
      return value
    },
    resizeOriginalTextarea () {
      this.resizeTextarea(this.$refs.originalText)
    },
    resizeTransTextarea () {
      this.resizeTextarea(this.$refs.transText)
    },
    resizeTextarea (element) {
      element.style.height = "1px";
      
      // let base = 2
      element.style.height = ( 10 + (element.scrollHeight) ) + "px";
      // console.log(element, (element.scrollHeight), element.style.height)
    },
    sleep: function (ms = 500) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    trans: async function () {
      let _source = this.item.text
      if (_source.trim() === '') {
        return false
      }

      while (this.transTextarea.classList.contains('wait')) {
        await this.sleep()
      }

      _source = this.item.text

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
      iframewindow.setGoogleTransCookie(this.item.transToLang)
      iframewindow.googleTranslateElementInit()

      while (this.transTextarea.value === '') {
        await this.sleep()
      }

      let result = this.transTextarea.value
      this.transTextarea.value = ''
      this.transTextarea.classList.remove('wait')

      // console.log(this.transTextarea.value)

      this.item.transResult = result
      setTimeout(() => {
        this.resizeTransTextarea()
      }, 50)
      
      this.transable = false
      // console.log($(iframewindow.document.body).find('#source').length)
    }
  }
}

module.exports = appOutputItem
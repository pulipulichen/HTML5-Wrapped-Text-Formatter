let appOutput = {
  props: ['db'],
  // components: {
  //   'app-output-item': httpVueLoader('./app-output-item/app-output-item.vue'),
  // },
  data () {
    return {
      transIframe: document.getElementById('transTempIframe'),
      transTextarea: document.getElementById('waitForTrans'),
      promptMin: 3,
      promptMax: 5,
      promptModify: 'normal',
      promptType: 'sentences',
      promptInput: 'original',
    }
  },
  mounted () {
  },
  computed: {
    langs () {
      let langs = this.db.config.langs.filter(lang => (lang.value !== 'auto' && lang.value !== 'false'))
      return langs
    }
  },
  watch: {
  },
  methods: {
    addOutputItem,
    addAuthorItem,
    setupButtonEvents,
    setupEmptyLinesEvent,
    addClickEvent (template, selector, callback) {
      template.find(selector).click(function () {
        let itemTemplate = $(this).parents('.app-output-item:first')
        let originalText = itemTemplate.find('.original-text').val()
        let transText = itemTemplate.find('.trans-text').val()
        let transFromLang = itemTemplate.find('.trans-from-lang').val()
        let transToLang = itemTemplate.find('.trans-to-lang').val()
        callback(itemTemplate, originalText, transText, transFromLang, transToLang)
      })
    },
    computedDate (item) {
      let date = item.date

      let hh = this.paddingZero(date.getHours())
      let mm = this.paddingZero(date.getMinutes())
      let ss = this.paddingZero(date.getSeconds())
      return `${hh}:${mm}:${ss}`
    },
    paddingZero (value) {
      if (value < 10) {
        value = '0' + value
      }
      return value
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
    trans,
    copyPlainString: function (text) {
      if (!navigator.clipboard) {
        this.fallbackCopyTextToClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(function () {
        //console.log('Async: Copying to clipboard was successful!');
      }, function (err) {
        //console.error('Async: Could not copy text: ', err);
      });
    },
    fallbackCopyTextToClipboard(text) {
      var textArea = document.createElement("textarea");
      textArea.value = text;
  
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
  
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
  
      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
  
      document.body.removeChild(textArea);
    },
  }
}

module.exports = appOutput
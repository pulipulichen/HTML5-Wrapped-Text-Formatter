let appOutput = {
  props: ['db'],
  // components: {
  //   'app-output-item': httpVueLoader('./app-output-item/app-output-item.vue'),
  // },
  data () {
    return {
      transIframe: document.getElementById('transTempIframe'),
      transTextarea: document.getElementById('waitForTrans'),
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
    addOutputItem (item) {
      let template = $(`<div class="transable ui segments app-output-item">
      <div class="ui green inverted segment header">
          
        <div class="date">
          <i class="icon chevron circle down"></i>
          <i class="icon chevron circle up"></i>
          ${this.computedDate(item)}
        </div>
        <div class="text">
          ${item.text}
        </div>
        
      </div>
      <div class="ui segment content">
        <form class="ui grid form">
          <div class="seven wide column original-column">
            <div class="field">
              <div class="ui fluid mini buttons">
                <button type="button" class="collapse-empty-lines ui button">刪除空白換行</button>
                <button type="button" class="expand-empty-lines ui button">加大空白換行</button>
                <button type="button" class="copy-original-text ui button">複製原文</button>
                <button type="button" class="copy-trans-text ui button">複製翻譯</button>
                <button type="button" class="copy-dual-text ui button">複製原文跟翻譯</button>
                <button type="button" class="remove-item ui button">移除</button>
              </div>
            </div>
            <div class="field">
              <textarea class="original-text"></textarea>
            </div>
              
          </div>
          <div class="nine wide column trans-column">
            <div class="ui mini icon fluid input field">
              <select class="trans-to-lang">
              </select>
              <i class="submit globe icon"></i>
            </div>
            <div class="field">
              <textarea class="trans-text"></textarea>
            </div>
          </div>
        </form>
      </div>
    </div>`)
      template.prependTo(this.$refs.main)

      template.find('.original-text').val(item.text)

      let select = template.find('.trans-to-lang')
      this.langs.forEach((lang) => {
        select.append(`<option value="${lang.value}">${lang.text}</option>`)
      })
      select.val(item.transToLang)
      if (item.transToLang === 'false') {
        template.find('.original-column').removeClass('seven').addClass('sixteen')
        template.find('.trans-column').remove()
      }
      else {
        setTimeout(() => {
          this.trans(template)

          if (this.db.localConfig.autoCopyText) {
            this.copyPlainString(item.text)
          }
          
        }, 50)
      }

      this.setupButtonEvents(template)

        

      return template
    },
    addAuthorItem (item) {
      let template = $(`<div class="transable ui segments app-output-item">
      <div class="ui green inverted segment header">
          
        <div class="date">
          <i class="icon chevron circle down"></i>
          <i class="icon chevron circle up"></i>
          ${this.computedDate(item)}
        </div>
        <div class="text">
          ${item.text}
        </div>
        
      </div>
      <div class="ui segment content">
        <form class="ui grid form">
          <div class="sixteen wide column">
            <div class="field">
              <div class="ui fluid mini buttons">
                <button type="button" class="copy-original-text ui button">複製</button>
                <button type="button" class="remove-item ui button">移除</button>
              </div>
            </div>
            <div class="field">
              <textarea class="original-text"></textarea>
            </div>
          </div>
        </form>
      </div>
    </div>`)
      template.prependTo(this.$refs.main)

      template.find('.original-text').val(item.text)

      let select = template.find('.trans-to-lang')
      this.langs.forEach((lang) => {
        select.append(`<option value="${lang.value}">${lang.text}</option>`)
      })
      select.val(item.transToLang)

      this.setupButtonEvents(template)

      setTimeout(() => {
        this.trans(template)
        template[0].scrollIntoView(({behavior: "smooth", block: "start", inline: "start"}))
      }, 50)

      return template
    },
    setupButtonEvents (template) {

      let component = this
      template.find('.header').click(function () {
        let itemTemplate = $(this).parents('.app-output-item:first')
        itemTemplate.toggleClass('collapsed')
      })

      template.find('.remove-item').click(function () {
        let itemTemplate = $(this).parents('.app-output-item:first')
        itemTemplate.remove()
      })

      template.find('.submit').click(function () {
        let itemTemplate = $(this).parents('.app-output-item:first')
        component.trans(itemTemplate)
      })

      template.find('textarea').change(function () {
        component.resizeTextarea(this)
      })

      this.setupEmptyLinesEvent(template)

      this.addClickEvent(template, '.copy-original-text', (itemTemplate, originalText, transText) => {
        this.copyPlainString(originalText)
      })

      this.addClickEvent(template, '.copy-trans-text', (itemTemplate, originalText, transText) => {
        this.copyPlainString(transText)
      })

      this.addClickEvent(template, '.copy-dual-text', (itemTemplate, originalText, transText) => {
        this.copyPlainString(transText + '\n\n' + originalText)
      })

      setTimeout(() => {
        this.resizeTextarea(template.find('.original-text')[0])
      }, 50)
    },
    setupEmptyLinesEvent (template) {
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
          while (originalText.indexOf('\n\n') == -1) {
            originalText = originalText.replace(/\n/g, '\n\n')
            originalText = originalText.trim()
          }

          while (originalText.indexOf('\n\n\n') > -1) {
            originalText = originalText.replace(/\n\n\n/g, '\n\n')
            originalText = originalText.trim()
          }

          while (transText && transText.indexOf('\n\n') == -1) {
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
    },
    addClickEvent (template, selector, callback) {
      template.find(selector).click(function () {
        let itemTemplate = $(this).parents('.app-output-item:first')
        let originalText = itemTemplate.find('.original-text').val()
        let transText = itemTemplate.find('.trans-text').val()
        callback(itemTemplate, originalText, transText)
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
    trans: async function (itemTemplate) {
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
    },
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
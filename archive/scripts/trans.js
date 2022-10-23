/* minifyOnSave */

const DEBUG = false

let submitToGoogleTrans = function (_form) {
  try {
    // var _source = $("#source").val();
    /**
     * [_source 表單輸入的文字]
     * @type {String}
     */
    var _source = _form.source.value
    // console.log(_source)
    _source = _source.trim()

    if (_source === '') {
      return false
    }

    // 正規表示法
    // http://programmermagazine.github.io/201307/htm/article2.html

    // console.log('1')

    // 過濾一些錯誤的詞彙
    _source = _source.split('ﬀ').join('ff')
    _source = _source.split('ﬁ').join('fi')

    do {
      _source = _source.split('  ').join(' ')
    }
    while (_source.indexOf('  ') > -1)

    // console.log('2')

    do {
      _source = _source.split('\t').join(' ')
    }
    while (_source.indexOf('\t') > -1)

    // console.log('3')

    if (_form.replace_fulltype.checked) {
      _source = _source.split('’').join("'")
      _source = _source.split('”').join('"')
      _source = _source.split('“').join('"')
    }

    // console.log('4')

    if (_form.trim_dash.checked) {
      while (_source.indexOf(' \n') > -1) {
        // _source = _googleTransUtils.str_replace(' \n', '\n', _source)
        _source = _source.split(' \n').join('\n')
      }
      // _source = _googleTransUtils.str_replace('-\n', '', _source)
      _source = _source.split('-\n').join('')
    }

    // console.log('5')

    if (_form.trim_nl.checked) {
      // 解決中文換行問題
      _source = _source.replace(/\n[\u4e00-\u9fa5]/g, function (_word) {
        // alert(_word);
        return _word.split('\n').join('')
      })

      _source = _source.split('\n').join(' ')
    }

    // console.log('6')

    if (_form.sentence_nl.checked) {
      _source = _source.split('. ').join('. \n\n')
      _source = _source.split('• ').join('\n\n• ')
      _source = _source.replace(/p\. \n\n\d/g, function (_word) {
        // alert(_word);
        return _word.split('\n').join('')
      })
      var stripNl = function (_word) {
        return _word.split('\n').join('')
      }

      // _source = _googleTransUtils.str_replace("e.g. \n\n", "e.g. ", _source); //舉例
      _source = _source.replace(/e\.g\. \n\n[^A-Z]/g, stripNl)

      // _source = _googleTransUtils.str_replace("i.e. \n\n", "i.e. ", _source); //即
      _source = _source.replace(/i\.e\. \n\n[^A-Z]/g, stripNl)

      // _source = _googleTransUtils.str_replace("et al. \n\n", "et al. ", _source); //等
      _source = _source.replace(/et al\. \n\n[^A-Z]/g, stripNl)
      // _source = _googleTransUtils.str_replace("etc. \n\n", "etc. ", _source); //等
      _source = _source.replace(/etc\. \n\n[^A-Z]/g, stripNl)

      _source = _source.split('–').join('– \n\n')
      _source = _source.split('。').join('。 \n\n')
      _source = _source.split('." ').join('." \n\n')
      _source = _source.split('." \n\n(').join('." (')
      _source = _source.split('。」 ').join('。」 \n\n')
      _source = _source.split(".' ").join(".' \n\n")
      // _source = _googleTransUtils.str_replace(": ", ": \n\n\n", _source);
      _source = _source.split('; ').join('; \n\n')
      _source = _source.replace(/\d; \n\n/g, function (_word) {
        // alert(_word);
        return _word.split('\n').join('')
      })
      _source = _source.split('； ').join('； \n\n')
      _source = _googleTransUtils.str_replace('；', '；\n\n', _source)

      _source = _googleTransUtils.str_replace('（ ', ' (', _source)
      _source = _googleTransUtils.str_replace('  ( ', ' (', _source)
      _source = _googleTransUtils.str_replace(' ）', ') ', _source)
      _source = _googleTransUtils.str_replace(')  ', ') ', _source)

      // for (var _i = 1; _i < 10; _i++) {
      //    _source = _googleTransUtils.str_replace(" (" + _i + ")", " \n\n(" + _i + ")", _source);
      // }
      _source = _source.split('\n ').join('\n')

      _source = _source.replace(/[0-9]+\. \n\n[A-Z]/g, function (_word) {
        return '\n\n' + _word.split('\n').join('')
      })
    }

    // console.log('7')

    if (_form.trim_citation.checked) {
      _source = _source.replace(/\n\d+$/g, '')
      _source = _source.replace(/\n\d+ /g, '\n')
    }

    // console.log('8')

    while (_source.indexOf('  ') > -1) {
      _source = _source.split('  ').join(' ')
    }

    // console.log('9')

    while (_source.indexOf('\n ') > -1) {
      _source = _source.split('\n ').join('\n')
    }

    // console.log('10')

    while (_source.indexOf('. \n\n.') > -1) {
      _source = _source.split('. \n\n.').join('..')
    }

    // console.log('11')

    while (_source.indexOf('\n\n\n\n') > -1) {
      _source = _source.split('\n\n\n\n').join('\n\n')
    }

    // 替換名字縮寫的問題 例如Pudding C. 不換行
    _source = _source.replace(/[A-Z]\. \n\n/g, function (_word) {
      // alert(_word);
      return _word.split('\n').join('')
    })
    
    //console.log('12')

    _source = $.trim(_source)

    /*
    if (_trim_style === "enable_trim_nl") {
        _source = _googleTransUtils.trim_nl(_source);
    }
    else if (_trim_style === "enable_trim_dash") {
        _source = _googleTransUtils.str_replace("-\n", " ", _source);
    }
    else if (_trim_style === "enable_trim_nl_with_blank") {
        _source = _googleTransUtils.str_replace("\n", " ", _source);
    }
    else if (_trim_style === "enable_trim_nl_dash") {
        _source = _googleTransUtils.str_replace("-\n", "", _source);
        _source = _googleTransUtils.str_replace("\n", " ", _source);
    }
    */

    // https://translate.google.com.tw/#en/zh-TW/While

    if ($(_form).attr('submit_type') === 'submit_authors') {
      // 接下來做作者部分的重整
      // console.log(_source)
      // console.log(_source.indexOf(' ('))
      if (_source.indexOf(' (') > -1) {
        _source = _source.substr(0, _source.indexOf(' (')).trim()
      }
      _source = _source.split(' and ').join(', ')
      let _authors = _source.split(',')
      let _outputAuthors = []
      console.log(_authors)

      let _skipInterval = 2
      if (_authors.length % 2 === 1) {
        _skipInterval = 1
      }

      for (let _i = 0, _len = _authors.length; _i < _len; _i = _i + _skipInterval) {
        let _author = _authors[_i]
        if (_skipInterval === 2) {
          _author = _author + ', ' + _authors[(_i + 1)]
        }
        // console.log(_author)
        _author = _author.split('&').join('')
        let _nameSeperator = _author.indexOf(', ')
        if (_nameSeperator > -1) {
          let _lastName = _author.substr(0, _nameSeperator).trim()
          let _firstName = _author.slice(_nameSeperator + 1, _author.length).trim()
          // _author = _firstName + ' ' + _lastName
          _author = _lastName + '\t' + _firstName
        }
        _author = _author.trim()
        _outputAuthors.push(_author)
      }
      _source = _outputAuthors.join('\n')
    }

    // 移除括號內的資料
    if (_form.trim_citation.checked) {
      _source = _source.replace(/\[.*?\]/g, '')
      _source = _source.replace(/\(.*?\)/g, '')
      _source = _source.replace(/\{.*?\}/g, '')
    }

    // 最後再檢視一次空格的問題
    do {
      _source = _source.split('  ').join(' ')
    }
    while (_source.indexOf('  ') > -1)


    var oriSource = _source
    _source = encodeURIComponent(_source)

    var baseUrl = 'https://translate.google.com.tw/#' +
      _form.source_lang.value +
      '/' +
      _form.target_lang.value +
      '/'
    var _url = baseUrl + _source

    var outputStyle = _form.output_style.value
    // alert([outputStyle, _url]);

    if (_form.test_output.checked) {
      // $(".google_trans_20140526 .test-output .test-div textarea").slideUp();

      var testOutput = $('.google_trans_20140526 .test-output').show()
      var testDiv = $("<div class='test-div panel panel-success'></div>").prependTo(testOutput)

      // -----------
      var _d = new Date()
      var _h = _d.getHours()
      var _m = _d.getMinutes()
      var _s = _d.getSeconds()

      // <span class="glyphicon glyphicon-resize-full" style="float:right"></span>
      // <span class="glyphicon glyphicon-resize-small" style="float:right"></span>

      var _preview = oriSource
      _preview = _googleTransUtils.str_replace('\n', ' ', _preview)

      $("<div class='animated panel-heading togglable'></div>")
        .html('<span class="glyphicon glyphicon-chevron-up" style="float:right"></span>' +
          '<span class="glyphicon glyphicon-chevron-down" style="float:right"></span>' +
          "<div class='heading-text'>" +
          '<strong>' + _h + ':' + _m + ':' + _s + '</strong> ' + _preview + '</div> ')
        .click(function () {
          _googleTransUtils.toggle_panel(this)
        })
        .appendTo(testDiv)

      _googleTransUtils.toggle_panel($('.google_trans_20140526 .input-div .panel-heading.togglable'))

      // -----------

      let btnPanel = $('<div style="display: inline-block; text-align:center"></div>')

      // console.log([_form.source_lang.value, _form.target_lang.value])
      let _btn = $('<select class="form-control"></select>')
        // .attr('source_lang', _form.source_lang.value)

      let _langSetting = [
        ['zh-TW', '正體中文'],
        ['zh-CN', '简体中文'],
        ['ja', '日本語'],
        ['en', 'English']]
      for (let _i = 0; _i < _langSetting.length; _i++) {
        _btn.append('<option value="' + _langSetting[_i][0] + '">' + _langSetting[_i][1] + '</option>')
      }

      _btn.attr('target_lang', _form.target_lang.value)
        // .html('翻譯')
        // .attr('pulipuli_base_url', baseUrl)
        .val(_form.target_lang.value)
        .change(function () {
          // 改用POST試試看
          /*
          var baseUrl = $(this).attr('pulipuli_base_url')
          var _url = baseUrl + $(this).parent().next().val()
          //alert(_url);
          // window.open(_url, '_blank')
          window.open(_url, '_blank', 'height=600,width=800,scrollbars=no')
          */
          let _source = $(this).parents('.test-div').find('textarea.source').val()
          $(this).parents('.test-div').find('textarea.note').addClass('wait-trans')

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
          let iframe = $('#transTempIframe')[0]
          let iframewindow= iframe.contentWindow? iframe.contentWindow : iframe.contentDocument.defaultView;
          let iframeBody = $(iframewindow.document.body)
          iframeBody.find('#source').html(_source)
          iframeBody.find('#originalSource').val(_source)
          //console.log(this.value)
          iframewindow.setGoogleTransCookie(this.value)
          iframewindow.googleTranslateElementInit()
          // console.log($(iframewindow.document.body).find('#source').length)

        }).appendTo(btnPanel)

        if ($(_form).attr('submit_type') !== 'submit_authors') {

          $('<button type="button" class="btn btn-success btn-block"></button>')
            .html('複製')
            .click(function () {
              if (document.cookie === '') {
                document.cookie = "googtrans=/en/zh-TW";
              }

              // 先取得後面兩個資料吧
              let content = []
              $(this).parents('.test-div:first').find('textarea').each((index, element) => {
                content.push(element.value)
              })

              content = content.join('\n\n').trim()
              // console.log(content)

              if (content === '') {
                return
              }

              // 複製它
              let copyInput = $('#copyInput')
              if (copyInput.length === 0) {
                copyInput = $('<textarea id="copyInput" style="position:absolute; top: -999px"></textarea>')
                  .appendTo('body')
              }
              copyInput.val(content)
              copyInput.eq(0).select();
              document.execCommand("copy");
            })
            .appendTo(btnPanel)
        }

      var _textarea = $("<textarea class='animated source original panel-body'></textarea>")
        .val(oriSource)
        // .css('width', 'calc(50% - 25px)')
        .click(function () { this.select() })
        .appendTo(testDiv)

      var _textareaNode = $("<textarea class='animated source trans panel-body note loading'></textarea>")
        // .css('width', 'calc(50% - 25px)')
        .click(function () { this.select() })
        .appendTo(testDiv)

      if ($(_form).attr('submit_type') === 'submit_authors') {
        testDiv.addClass('submit_authors')
      }

      btnPanel.appendTo(testDiv)

      var hideInputDiv = function () {
        $('.input-div .panel-body').slideUp()
      }

      $(function () {
        _textarea.autosize()
        _textareaNode.autosize()
        _textarea.focus()
        _textarea.click()
        _textarea.click(hideInputDiv)
        _textareaNode.click(hideInputDiv)
        btnPanel.click(hideInputDiv)
        $('.google-trans-title').hide()
      })

      if (_form.window_open_output.checked) {
        // console.log('okok')
        setTimeout(() => _btn.change(), 500)
        window.scrollTo(0, 0)
      }
    } else {
      // _source = encodeURIComponent(_source);
      if (outputStyle === 'blank') {
        window.open(_url, '_blank')
      } else if (outputStyle === 'iframe') {
        var _heading = _form.subject.value

        var _time = (new Date()).getTime()

        _heading = _time + ' ' + _heading

        var _iframe = _googleTransUtils.create_iframe(_url, _heading)
        _iframe.prependTo('.google_trans_20140526 .output')
      }
    }
  } catch (_e) {
    console.log(_e)
  }

  /*

    else if (outputStyle === "iframe") {
        window.open(_url, "_blank");
    }
    */

  $(_form.source).val('')

  return false
} // var _submitToGoogleTrans = function (_form) {

$(() => {
  $('#submitToGoogleTransForm').submit(function (_event) {
    return submitToGoogleTrans(this, _event)
  })
  $('#submitToGoogleTransForm :submit').click(function () {
    $('#submitToGoogleTransForm').attr('submit_type', this.name)
    // console.log(this.name)
  })
})

var _googleTransUtils = {
  /**
   * 取代字串
   * @param {String} _search 要被取代的字串
   * @param {String} _replace 要取而代之的字串
   * @param {String} _subject 進行處理的字串
   * @param {number} _count 最多的處理次數
   * @returns {String}
   */
  str_replace: function (_search, _replace, _subject, _count) {
    return _subject.split(_search).join(_replace)

    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Gabriel Paderni
    // +   improved by: Philip Peterson
    // +   improved by: Simon Willison (http://simonwillison.net)
    // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   bugfixed by: Anton Ongson
    // +      input by: Onno Marsman
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    tweaked by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   input by: Oleg Eremeev
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Oleg Eremeev
    // %          note 1: The count parameter must be passed as a string in order
    // %          note 1:  to find a global variable in which the result will be given
    // *     example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
    // *     returns 1: 'Kevin.van.Zonneveld'
    // *     example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
    // *     returns 2: 'hemmo, mars'

    /*
    let _i = 0
    let _j = 0
    let _temp = ''
    let _repl = ''
    let _sl = 0
    let _fl = 0
    let _f = [].concat(_search)
    let _r = [].concat(_replace)
    let _s = [].concat(_subject)
    let _ra = _r instanceof Array
    let _sa = _s instanceof Array

    if (_count) {
      this.window[_count] = 0
    }

    for (_i = 0, _sl = _s.length; _i < _sl; _i++) {
      if (_s[_i] === '') {
        continue
      }
      for (_j = 0, _fl = _f.length; _j < _fl; _j++) {
        _temp = _s[_i] + ''
        _repl = _ra ? (_r[_j] !== undefined ? _r[_j] : '') : _r[0]
        _s[_i] = (_temp).split(_f[_j]).join(_repl)
        if (_count && _s[_i] !== _temp) {
          this.window[_count] += (_temp.length - _s[_i].length) / _f[_j].length
        }
      }
    }
    return _sa ? _s : _s[0]
    */
  },
  trim_nl: function (_str) {
    return this.str_replace('\n', '', _str)
  },
  trim_nl_dash: function (_str) {
    return this.str_replace('-\n', '', _str)
  },
  toggle_panel: function (_heading, isClose) {
    _heading = $(_heading)
    var _body = _heading.nextAll()

    var hiddenClassname = 'heading_hidden'

    if (isClose === undefined) {
      isClose = (_body.filter(':visible').length > 0)
    }

    if (isClose) {
      _body.slideUp(function () {
        _heading.addClass(hiddenClassname)
      })
    } else {
      _body.slideDown(function () {
        _heading.removeClass(hiddenClassname)
      })
    }
    // _body.toggle(500);
  },
  create_iframe: function (_url, _heading) {
    var _panel = $('<div></div>').addClass('panel panel-success')

    var panelHeading = $('<div></div>')
      .addClass('panel-heading togglable')
      .appendTo(_panel)
      .click(function () {
        _googleTransUtils.toggle_panel(this)
      })

    $('<div></div>')
      .addClass('panel-title')
      .html(_heading)
      .appendTo(panelHeading)

    var _body = $('<div></div>')
      .addClass('panel-body')
      .appendTo(_panel)

    $('<iframe src="' + _url + '&output=embed" class="iframe" />')
      .appendTo(_body)

    return _panel
  }
}

$(function () {
  var inputTextarea = $('.input-textarea')
    // .autosize()
    .focus()

  var resizeTextarea = function () {
    var _height = window.innerHeight
    _height = _height - 300
    if (_height < 30) {
      _height = 30
    }
    // alert(_height);

    inputTextarea.height(_height)
  }

  resizeTextarea()
  $(window).resize(function () {
    resizeTextarea()
  })

  inputTextarea.keydown(function (_e) {
    // console.log(_e)
    if (_e.ctrlKey && _e.keyCode === 13) {
      // Ctrl-Enter pressed
      // console.log($('.google_trans_20140526 form .submit_trans').length)
      $('.google_trans_20140526 form .submit_trans').click()
    } else if (_e.altKey && _e.keyCode === 13) {
      // Ctrl-Enter pressed
      // console.log($('.google_trans_20140526 form .submit_trans').length)
      $('.google_trans_20140526 form .submit_authors').click()
    }
  })

  // ---------------------------------------

  let _blurTimer

  $(window).blur(function () {
    if (DEBUG === true) {
      return false
    }

    if ($('[name="auto_reopen"]').prop("checked") === false) {
      return false
    }

    _blurTimer = setTimeout(() => {
      // return;
      var _heading = $('.input-div .panel-heading.togglable')
      _googleTransUtils.toggle_panel(_heading, false)

      var _source = $('.input-div [name="source"]')
      var sourceValue = _source.val()
      // alert([sourceValue, sourceValue.substr(sourceValue.length - 1, 1) !== "\n"]);
      if (sourceValue !== '' && sourceValue.substr(sourceValue.length - 1, 1) !== '\n') {
        _source.val(sourceValue + '\n')
      }
    }, 3000)
  })

  $(window).focus(() => {
    clearTimeout(_blurTimer)
  })

  // ---------------------------------------

  var hideInputDiv = function () {
    var _heading = $('.input-div .panel-heading.togglable')
    _heading.click()
  }

  $('.output-container .page-header').click(hideInputDiv)

  // autosize用法：
  // http://www.jacklmoore.com/autosize/
})

// 自動啟動
$(() => {
  if (DEBUG === true) {
    $('.submit_trans').click()
  }
})

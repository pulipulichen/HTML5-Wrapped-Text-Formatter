/**
 * Bootstrap 樣板
 * http://getbootstrap.com/components/#panels
 */
let submitToGoogleTrans = function (_form) {
  try {
    // var _source = $("#source").val();
    var _source = _form.source.value
    _source = $.trim(_source)

    if (_source === '') {
      return false
    }

    // 正規表示法
    // http://programmermagazine.github.io/201307/htm/article2.html

    _source = _googleTransUtils.str_replace('\t', ' ', _source)
    while (_source.indexOf('  ') > -1) {
      _source = _googleTransUtils.str_replace('  ', ' ', _source)
    }

    if (_form.replace_fulltype.checked) {
      _source = _googleTransUtils.str_replace('’', "'", _source)
      _source = _googleTransUtils.str_replace('”', '"', _source)
      _source = _googleTransUtils.str_replace('“', '"', _source)
    }

    if (_form.trim_dash.checked) {
      while (_source.indexOf(' \n') > -1) {
        _source = _googleTransUtils.str_replace(' \n', '\n', _source)
      }
      _source = _googleTransUtils.str_replace('-\n', '', _source)
    }

    if (_form.trim_nl.checked) {
      // 解決中文換行問題
      _source = _source.replace(/\n[\u4e00-\u9fa5]/g, function (_word) {
        // alert(_word);
        return _googleTransUtils.str_replace('\n', '', _word)
      })

      _source = _googleTransUtils.str_replace('\n', ' ', _source)
    }

    if (_form.sentence_nl.checked) {
      _source = _googleTransUtils.str_replace('. ', '. \n\n', _source)
      _source = _googleTransUtils.str_replace('• ', '\n\n• ', _source)
      _source = _source.replace(/p\. \n\n\d/g, function (_word) {
      // alert(_word);
        return _googleTransUtils.str_replace('\n', '', _word)
      })
      var stripNl = function (_word) {
        return _googleTransUtils.str_replace('\n', '', _word)
      }

      // _source = _googleTransUtils.str_replace("e.g. \n\n", "e.g. ", _source); //舉例
      _source = _source.replace(/e\.g\. \n\n[^A-Z]/g, stripNl)

      // _source = _googleTransUtils.str_replace("i.e. \n\n", "i.e. ", _source); //即
      _source = _source.replace(/i\.e\. \n\n[^A-Z]/g, stripNl)

      // _source = _googleTransUtils.str_replace("et al. \n\n", "et al. ", _source); //等
      _source = _source.replace(/et al\. \n\n[^A-Z]/g, stripNl)
      // _source = _googleTransUtils.str_replace("etc. \n\n", "etc. ", _source); //等
      _source = _source.replace(/etc\. \n\n[^A-Z]/g, stripNl)

      _source = _googleTransUtils.str_replace('。', '。 \n\n', _source)
      _source = _googleTransUtils.str_replace('." ', '." \n\n', _source)
      _source = _googleTransUtils.str_replace('." \n\n(', '." (', _source) // 等
      _source = _googleTransUtils.str_replace('。」 ', '。」 \n\n', _source)
      _source = _googleTransUtils.str_replace(".' ", ".' \n\n", _source)
      // _source = _googleTransUtils.str_replace(": ", ": \n\n\n", _source);
      _source = _googleTransUtils.str_replace('; ', '; \n\n', _source)
      _source = _source.replace(/\d; \n\n/g, function (_word) {
        // alert(_word);
        return _googleTransUtils.str_replace('\n', '', _word)
      })
      _source = _googleTransUtils.str_replace('； ', '； \n\n', _source)
      _source = _googleTransUtils.str_replace('；', '；\n\n', _source)

      _source = _googleTransUtils.str_replace('（ ', ' (', _source)
      _source = _googleTransUtils.str_replace('  ( ', ' (', _source)
      _source = _googleTransUtils.str_replace(' ）', ') ', _source)
      _source = _googleTransUtils.str_replace(')  ', ') ', _source)

      // for (var _i = 1; _i < 10; _i++) {
      //    _source = _googleTransUtils.str_replace(" (" + _i + ")", " \n\n(" + _i + ")", _source);
      // }
      _source = _googleTransUtils.str_replace('\n ', '\n', _source)

      _source = _source.replace(/[0-9]+\. \n\n[A-Z]/g, function (_word) {
        return '\n\n' + _googleTransUtils.str_replace('\n', '', _word)
      })
    }

    if (_form.trim_citation.checked) {
      _source = _source.replace(/\n\d+$/g, '')
      _source = _source.replace(/\n\d+ /g, '\n')
    }

    while (_source.indexOf('  ') > -1) {
      _source = _googleTransUtils.str_replace('  ', ' ', _source)
    }

    while (_source.indexOf('\n ') > -1) {
      _source = _googleTransUtils.str_replace('\n ', '\n', _source)
    }

    while (_source.indexOf('. \n\n.') > -1) {
      _source = _googleTransUtils.str_replace('. \n\n.', '..', _source)
    }

    while (_source.indexOf('\n\n\n\n') > -1) {
      _source = _googleTransUtils.str_replace('\n\n\n\n', '\n\n', _source)
    }

    // 替換名字縮寫的問題 例如Pudding C. 不換行
    _source = _source.replace(/[A-Z]\. \n\n/g, function (_word) {
      // alert(_word);
      return _googleTransUtils.str_replace('\n', '', _word)
    })

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

      $("<button type='button'></button>")
        .html('翻譯')
        .attr('pulipuli_base_url', baseUrl)
        .click(() => {
          var baseUrl = $(this).attr('pulipuli_base_url')
          var _url = baseUrl + $(this).next().val()
          // alert(_url);
          window.open(_url, '_blank')
        })
        // .css("float", "left")
        .appendTo(testDiv)

      var _textarea = $("<textarea class='animated source panel-body'></textarea>")
        .val(oriSource)
        .css('width', 'calc(100% - 50px)')
        .click(() => {
          this.select()
        })
        .appendTo(testDiv)

      var hideInputDiv = function () {
        $('.input-div .panel-body').slideUp()
      }

      $(function () {
        _textarea.autosize()
        _textarea.focus()
        _textarea.click()
        _textarea.click(hideInputDiv)
        $('.google-trans-title').hide()
      })
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
  $('#submitToGoogleTransForm').submit(() => {
    return submitToGoogleTrans(this)
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
  },
  trim_nl: function (_str) {
    return this.str_replace('\n', '', _str)
  },
  trim_nl_dash: function (_str) {
    return this.str_replace('-\n', '', _str)
  },
  toggle_panel: function (_heading, isClose) {
    _heading = $(_heading)
    var _body = _heading.next()

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
    console.log(_e)
    if (_e.ctrlKey && _e.keyCode === 13) {
      // Ctrl-Enter pressed
      $('.google_trans_20140526 form').submit()
    }
  })

  $(window).blur(function () {
    // return;
    var _heading = $('.input-div .panel-heading.togglable')
    _googleTransUtils.toggle_panel(_heading, false)

    var _source = $('.input-div [name="source"]')
    var sourceValue = _source.val()
    // alert([sourceValue, sourceValue.substr(sourceValue.length - 1, 1) !== "\n"]);
    if (sourceValue !== '' && sourceValue.substr(sourceValue.length - 1, 1) !== '\n') {
      _source.val(sourceValue + '\n')
    }
  })

  var hideInputDiv = function () {
    var _heading = $('.input-div .panel-heading.togglable')
    _heading.click()
  }

  $('.output-container .page-header').click(hideInputDiv)

  // autosize用法：
  // http://www.jacklmoore.com/autosize/
})

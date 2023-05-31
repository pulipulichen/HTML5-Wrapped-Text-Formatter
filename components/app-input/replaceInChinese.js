let replaceInChinese = function (text, from, to = '') {
  //https://blog.miniasp.com/post/2019/01/02/Common-Regex-patterns-for-Unicode-characters
  const hanRange = `\\u4e00-\\u9fa5\\uFF01-\\uFF5E\\u3000-\\u3003\\u3008-\\u300F\\u3010-\\u3011\\u3014-\\u3015\\u301C-\\u301E`
  
  text = text.replace(new RegExp(`(([0-9${hanRange}]|^)${from}([0-9${hanRange}]|$))`, 'g'), (match) => {
    if (match === from) {
      return to
    }
    if (match[0] === from[0]) {
      return to + match[(match.length - 1)]
    }
    if (match.slice(-1) === from.slice(-1)) {
      return match[0] + to
    }
    return match[0] + to + match[(match.length - 1)]
  })

  text = text.replace(new RegExp(`(([a-zA-Z]|^)${from}[${hanRange}])`, 'g'), (match) => {
    if (match[0] === from[0]) {
      return to + match[(match.length - 1)]
    }
    return match[0] + to + match[(match.length - 1)]
  })
  text = text.replace(new RegExp(`([${hanRange}]${from}([a-zA-Z]|$))`, 'g'), (match) => {
    if (match.slice(-1) === from.slice(-1)) {
      return match[0] + to
    }
    return match[0] + to + match[(match.length - 1)]
  })

  return text
}
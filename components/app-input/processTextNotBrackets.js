let processTextNotBrackets = function (text, handler) {
      let output = []
      let isHalf = true
      let leftPos = text.indexOf('(')
      if (leftPos === -1) {
        isHalf = false
        leftPos = text.indexOf('（')
      }
      // console.log({isHalf, leftPos})
      if (leftPos === -1) {
        return handler(text)
      }

      let splitor = ['(', ')']
      if (isHalf === false) {
        splitor = ['（', '）']
      }
     
      // console.log(text.split(splitor[0]))
      text.split(splitor[0]).forEach((t, i) => {
        // console.log(t, i)
        if (i === 0) {
          t = handler(t)
          output.push(t)
          return true
        }

        // let pos = t.lastIndexOf(splitor[1])
        let pos = t.indexOf(splitor[1])
        if (pos === -1) {
          output.push(splitor[0] + t)
          return true
        }

        let partInBrackets = t.slice(0, pos)
        let partOutBrackets = t.slice(pos + 1)
        partOutBrackets = handler(partOutBrackets)

        output.push(splitor[0] + partInBrackets + splitor[1] + partOutBrackets)
      })

      // console.log(output)

      return output.join('')
    }
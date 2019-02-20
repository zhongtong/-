const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//canvas绘制多行文本换行
function canvasBreakLine(text,ctx,wrapperWidth,fontSize){
  let lineArray = []
  let textareaWidth = Math.floor(wrapperWidth / fontSize)
  while (text.length > 0) {
    let temp = text.substr(0, textareaWidth)
    while (ctx.measureText(temp).width < wrapperWidth && textareaWidth < text.length){
      textareaWidth ++
      temp = text.substr(0, textareaWidth)
    }
    temp = text.substr(0, textareaWidth)
    lineArray.push(temp)
    text = text.substr(textareaWidth)
    textareaWidth = Math.floor(wrapperWidth / fontSize)
  }
  return lineArray
}
module.exports = {
  formatTime: formatTime,
  canvasBreakLine: canvasBreakLine
}

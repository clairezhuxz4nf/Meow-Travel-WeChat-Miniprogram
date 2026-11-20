const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function toDate(value) {
  const parts = value.split('-').map(Number)
  return new Date(parts[0], parts[1] - 1, parts[2])
}

function formatDateLabel(value) {
  const date = toDate(value)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${WEEKDAYS[date.getDay()]}`
}

function shortDate(value) {
  const date = toDate(value)
  return `${date.getMonth() + 1}.${date.getDate()}`
}

function compareDate(left, right) {
  return toDate(left).getTime() - toDate(right).getTime()
}

module.exports = {
  compareDate,
  formatDateLabel,
  shortDate,
  toDate
}


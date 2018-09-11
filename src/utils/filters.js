function saveDate (value) {
  if (!value) return ''
  return value.slice(0, 10)
}
export { saveDate }

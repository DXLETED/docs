export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const res = [...list]
  const [removed] = res.splice(startIndex, 1)
  res.splice(endIndex, 0, removed)
  return res
}

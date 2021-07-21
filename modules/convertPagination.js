const convertPagination = function (resource, currentPage) {
  // 分頁
  // 在文章頁面，articles = resource
  console.log('convertPagination start')
  const totalResult = resource.length
  const perpage = 3
  const pageTotal = Math.ceil(totalResult / perpage)

  if (currentPage > pageTotal) {
    currentPage = pageTotal
  }

  const minItem = (currentPage - 1) * perpage + 1 // 4
  const maxItem = currentPage * perpage // 6

  const data = []
  resource.forEach(function (item, i) {
    let itemNum = i + 1
    if (itemNum >= minItem && itemNum <= maxItem) {
      data.push(item)
    }
  })
  const page = {
    pageTotal,
    currentPage,
    hasPre: currentPage > 1,
    hasNext: currentPage < pageTotal,
  }

  console.log('page', page)
  // 分頁結束
  return {
    page,
    data
  }
}

module.exports = convertPagination
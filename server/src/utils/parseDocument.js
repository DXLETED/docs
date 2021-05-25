const objectPath = require('object-path')

const parseDocument = (tpl, data) =>
  tpl
    .replace(/\$\$([a-zA-Z|.]*)(.*?)\$\$([a-zA-Z|.]*)/g, (_, path, tpl) =>
      objectPath
        .get(data, path)
        .map(el => parseDocument(tpl, el))
        .join('')
    )
    .replace(/\$_/g, data)
    .replace(/\$([a-zA-Z|.]*)/g, (_, path) => objectPath.get(data, path))

module.exports = parseDocument

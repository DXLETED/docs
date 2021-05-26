const objectPath = require('object-path')

const parseDocument = (tpl, data) =>
  tpl
    // Множественное поле | $$multipleField<li>$_</li>$$multipleField
    .replace(/\$\$([a-zA-Z|.]*)(.*?)\$\$([a-zA-Z|.]*)/g, (_, path, tpl) =>
      objectPath
        .get(data, path)
        .map(el => parseDocument(tpl, el))
        .join('')
    )
    // <root> элемент | $_
    .replace(/\$_/g, data)
    // Элемент | $field
    .replace(/\$([a-zA-Z|.]*)/g, (_, path) => objectPath.get(data, path))

module.exports = parseDocument

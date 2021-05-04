module.exports = validation => (req, res, next) => {
  if (validation.validate(req.body).error) return res.status(400).json({ err: 'not_valid' })
  next()
}

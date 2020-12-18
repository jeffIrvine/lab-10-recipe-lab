module.exports = (req, res, next) => {
  const err = new Error(`Not Found id: ${req.params.id}`);
  err.status = 404;
  next(err);
};

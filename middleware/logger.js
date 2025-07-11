module.exports = (req, res, next) => {
  const user = req.user ? `@${req.user.username}` : "anonymous";
  console.log(`[${req.method}] ${req.url} - ${user}`);
  next();
};
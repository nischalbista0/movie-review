const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "auth token not present" });
  token = token.split(" ")[1];

  jwt.verify(token, process.env.SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: err.message });
    req.user = payload;
    next();
  });
};

module.exports = { verifyUser };

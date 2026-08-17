const authorization = (...role) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!req.user) {
      return res.status(401).send({ message: "User not authenticated" });
    }
    if (!role.includes(req.user.role)) {
      return res.status(401).send({ message: "you are  an unauthorized user" });
    }

    next();
  };
};
module.exports = authorization;

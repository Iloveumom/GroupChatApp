const getMe = (req, res) => {
  res.json({
    userId: req.user.id
  });
};
module.exports={getMe};

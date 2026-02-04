const getMe = (req, res) => {
  res.json({
    userId: req.user.id,
    name:req.user.name,
    email:req.user.email
  });
};
module.exports={getMe};

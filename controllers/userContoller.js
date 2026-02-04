const User=require('../models/User');
const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const addSignupdetail=async(req,res)=>{
    const {name,email,phone,password}=req.body;    
    bcrypt.hash(password,10,async (err,hash)=>{
            try
            {
                if(err)
                {
                    throw new Error("sothing wrong");
                }
                    await User.create({
                    name,email,phone,password:hash
                        });
                     res.status(201).json({message:"registration success"});

                    }
                    catch(err)
                    {
                    
                        if (err.name === "SequelizeUniqueConstraintError")
                            {
                                res.status(409).json({ message: "Email already exists" });
                                return;
                            }
                            res.status(500).json({error:err.message});
                        }
    })

};

const checkLogindetail = async (req, res) => {
  try {
    const { emailorphone, password } = req.body;

    if (!emailorphone || !password) {
      return res.status(400).json({
        message: "Email/Phone and password required"
      });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: emailorphone },
          { phone: emailorphone }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(500).json({
        message: "Password not found for this user"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user.id, user.email, user.phone);

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


const generateToken = (id, email, phone) => {
  return jwt.sign(
    { signupId: id, email, phone },
    process.env.JWT_SECRET
  );
};
// Get all users
const getAllUsers = async (req, res) => {
  try {
  

    const users = await User.findAll({
      
      }
    );
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const findUserById=async (userId)=>{

  try { 
      const user = await User.findByPk(userId);
      return user;
    }
    catch(err)
    {
      console.log(err);
      res.status(500).json({ error: "user not Found"});
    }
}
module.exports = { checkLogindetail ,addSignupdetail,getAllUsers,findUserById};
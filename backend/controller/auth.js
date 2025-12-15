const userModel = require("./../db/userSchema");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const saltRounds = 10;

async function signUp(req, res) {
  try {
    const { username, email, password } = req.body;

    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        const user = {
          username,
          email,
          password: hash,
        };

         const result = new userModel(user).save();

        res.send({
          message: "signup successfully",
          user,
          status: 200,
        });
      });
    });
  } 

  catch (err) {
    res.send({
      err,
      status: 500,
      message: "sorry! server is not responding",
    });
  }
}

// async function login(req, res) {
//   try{
//     const {email, password } =  req.body;


//     if(!email || !password){
//       return res.status(400).send({
//         status: 401,
//         message: "Email or Password is missing"
//       });
//     }


//     const dbUser = await userModel.findOne({email});
//     console.log(dbUser, "here is a user")

//     if(!dbUser) {
//       return res.status(401).send({
//           status: 401,
//           message: "User not found"
//       })
//     }

//      const isPasswordValid = await bcrypt.compare(password, dbUser.password);
//      if(!isPasswordValid){
//        return res.status(401).send({
//         status: 401,
//         message: "Invalid password"
//         });
//      }

//      const token = jwt.sign({
//       id: dbUser._id,
//       email: dbUser.email, 
//       role: dbUser.role
//      },

//      process.env.JWTSECRETKEY,
//      { expiresIn: "1d" }

//      );

//      console.log(token);

//      res.cookie("jwtToken", token, {
//        httpOnly: true,
//        maxAge: 24 * 60 * 60 * 1000 //
//      });

//      res.status(200).json({
//   status: 200,
//   message: "Login successful",
//   token,
//   dbUser
// });



//   }

//   catch (err) {
//    res.send({
//     err,
//     status: 500,
//     message: "sorry! server is not responding",
//    })
//   }
// }

// module.exports = { signUp, login};




async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 401,
        message: "Email or Password is missing"
      });
    }

    const dbUser = await userModel.findOne({ email });
    console.log(dbUser, "here is a user");

    if (!dbUser) {
      return res.status(401).json({
        status: 401,
        message: "User not found"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        id: dbUser._id,
        email: dbUser.email,
        role: dbUser.role
      },
      process.env.JWTSECRETKEY,
      { expiresIn: "1d" }
    );

    console.log(token);

    // Optional: set cookie
    res.cookie("jwtToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      status: 200,
      message: "Login successful",
      token,
      dbUser
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server not responding",
      err
    });
  }
}



module.exports = { signUp, login};
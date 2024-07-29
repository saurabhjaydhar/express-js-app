import bcryptpkg from 'bcryptjs';
import User from "../model/user-model.js";
import joipkg from 'joi';
import { jwtSign, comparePassword } from "../services/auth-service.js";

export const register = async (req, res) => {
  const { object, string } = joipkg;

  const schema = object({
    role: string().required(),
    name: string().required(),
    email: string().email().required(),
    password: string().required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const { genSalt, hash } = bcryptpkg;
  const salt = await genSalt(10);
  const hashedPassword = await hash(value.password, salt);

  const existingUser = await User.findOne({
    email: value.email,
    role: value.role,
  });

  if (existingUser) {
    res.status(400).json({
      message: "Already registered",
      data: {},
    });
  } else {
    await User.create({
      role: value.role,
      name: value.name,
      email: value.email,
      password: hashedPassword,
    })
      .then((userData) => {
        const email = userData.email;
        const userId = userData._id;
        const token = jwtSign(userId, email);

        userData.token = token;

        var jsondata = JSON.parse(JSON.stringify(userData));
        delete jsondata.password;

        if (jsondata) {
          res.status(201).send({
            message: "Registered successfully",
            data: jsondata,
          });
        } else {
          res.status(401).send({
            message: "Something went wrong",
            data: error,
          });
        }
      })
      .catch((error) => {
        res.status(401).send({
          message: "Something went wrong",
          data: error,
        });
      });
  }
};

export const login = async (req, res) => {
  const schema = object({
    email: string().email().required(),
    role: string().required(),
    password: string().required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(value.password, salt);

  const user = await User.findOne({
    email: value.email,

    password: hashedPassword,
  })
    .then(async (userData) => {
      if (userData) {
        const userId = userData._id;
        const email = userData.email;
        const isRole = value.role == userData.role;
        if (!isRole) {
          return res.status(401).send({
            message: "Can't login with this role",
            data: error,
          });
        }
        const token = jwtSign(userId, email);

        userData.token = token;

       
    
        var isCorrectPassword = await comparePassword(
          value.password,
          userData.password
          // '$2a$10$5eIRk4ADDRNOyEOjTRtsbujTfq66xsxW7RPy9BwKibc3AoCJFfGm3m',
          // '$2a$10$KPhCfJNA4Ebp9zRlmuYIs.F3D4Yjal9snC2zftcGG9bl5S4cErCNu',
        );
    

        if (isCorrectPassword) {
          // var jsondata = userData;
          // jsondata['password'] = '';
          var jsondata = JSON.parse(JSON.stringify(userData));
          delete jsondata.password;

        

          return res.status(201).json({
            message: "Logged in successfully",
            data: jsondata,
          });
        } else {
          return res.status(401).json({
            message: "Wrong Password!",
            data: error,
          });
        }
       
      } else {
        return res.status(401).json({
          message: "Email not found ",
          data: error,
        });
      }
    })
    .catch((error) => {});
};

export const changePassword = async (req, res) => {
  const schema = object({
    email: string().email().required(),
    password: string().required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  // const { email, id } = req;
  // const { password } = req.body;

  const user = await User.findOne({ email: value.email });
  // console.log(user);

  if (user) {
    if (value.password == user.password) {
      return res.status(400).json({
        message: "Old and new pasassword are same",
      });
    }
    await User.findByIdAndUpdate(
      { _id: user._id },
      {
        $set: {
          password: value.password,
        },
      }
    );
    const updatedUser = await User.findById({ _id: user._id });
    res
      .status(200)
      .json({ message: "Password updated successfully", data: updatedUser });
  } else {
    res.status(400).json({ message: "User not found" });
  }
};


export default {
  login,
  register,
  changePassword,
 
};
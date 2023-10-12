const User = require('../models/user');
const Admin = require('../models/admin');
const Rides = require('../models/rides');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');



const registerNewUser = async (req, res) => {
  const hashPass = await bcrypt.hash(req.body.password, saltRounds)
  req.body.password= hashPass
  req.body.confirmPassword = hashPass
  const userExist = await User.exists({phoneNumber:req.body.phoneNumber})
  if(userExist){
      res.status(409).json({msg: "Phone Number already exists"})
  }else{
      const data = await User.create(req.body)
      if(data){
        console.log(data)
       res.json({msg: "User registered successfully"})
      }
  }
 
  }
 const loginUser = async (req,res) => {
  const data = await User.findOne({phoneNumber:req.body.phoneNumber})
  if(!data){
       return res.status(404).json({"msg": "user not found"})
      }else{
        const isMatched = await bcrypt.compare( req.body.password,data.password )
        if(isMatched){
          const token = jwt.sign({ phoneNumber : req.body.phoneNumber}, process.env.SECRET_KEY);
          res.json({isLoggedIn : true , msg: "Login Success" , token, userDetails:data})
        }else{
          res.status(401).json({msg : "creds error"})
        }
      }
 } 
 const updateUsersDetails = async (req,res) =>{
  const data = await User.findByIdAndUpdate(req.params.id , req.body)
 if(data){
  res.json({
    msg:"User details edited"
  })
 }
}
const getUserById = async(req,res)=>{
  const data = await User.findById(req.params.id)
  if(data){
  res.json({userDetails:data})
  }
}
const uploadImage = async (req, res) => {
  // save the file name that multer has uploaded
  if (req.file?.filename) {
    await User.findByIdAndUpdate(req.params.id, {
      $set: { avatarImage: req.file?.filename },
    });
  }
  res.json({
    msg: "image uploaded",
  });
};
const getUserImage = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if userId is defined and is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const userInfo = await User.findById(userId);

    if (!userInfo) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if userInfo.avatarImage is a valid string
    if (
      typeof userInfo.avatarImage !== "string" ||
      userInfo.avatarImage.trim() === ""
    ) {
      return res
        .status(404)
        .json({ error: "Avatar image not found for the user" });
    }

    const imagePath = path.join(
      __dirname,
      "../../uploads/avatar",
      userInfo.avatarImage
    );

    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const registerVehicleInfo =async (req, res)=>{
  const adminExist = await Admin.exists({vehicle:req.body.vehicle,pricePerUnitKm:req.body.pricePerUnitKm})
  if(adminExist){
      res.status(409).json({msg: "Vehicle Info already exists"})
  }else{
      const data = await Admin.create(req.body)
      if(data){
       res.json({msg: "Vehicle registered successfully"})
      }
  }
}
const getVehicleInfo = async(req,res)=>{
  const data = await Admin.find();
  if(data){
  res.json(data)
  }
}

const getRides = async(req,res) =>{
   try{
      const data = await Rides.find({status:req.query.status})
     if(data) res.json({rideList:data})
    }
   catch(error){
    console.log(error);
   }
}

module.exports = {registerNewUser,loginUser , updateUsersDetails ,
   getUserById, uploadImage , getUserImage , registerVehicleInfo, getVehicleInfo,
  getRides};    

import bcrypt, { compare } from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import { verifyGmailExists } from '../lib/verify.js'

export const signup = async (req, res) => {
     const { fullName, email, password } = req.body;
     try {
          if (!email.endsWith("@gmail.com")) {
               return res.status(400).json({ message: "Only Gmail accounts are allowed" });
           }
   
           // Validate if the Gmail address actually exists
           const emailExists = await verifyGmailExists(email);
           if (!emailExists) {
               return res.status(400).json({ message: "This Gmail account does not exist" });
           }
           if (!/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/.test(password)) {
               return res.status(400).json({ 
                   message: "Password must be at least 8 characters long and contain both letters and digits" 
               });
           }
           

          const user = await User.findOne({ email });
          if (user) {
               return res.status(400).json({ message: "Email Already Exists" });
          }

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          const newUser = new User({
               fullName,
               email,
               password: hashedPassword,
          });

          await newUser.save();

          if (!newUser._id) {
               return res.status(500).json({ message: "User ID is missing" });
          }

          generateToken(newUser._id, res);

          return res.status(201).json({
               _id: newUser._id,
               fullName: newUser.fullName,
               email: newUser.email,
               profilePic: newUser.profilePic,
          });
     
     } catch (error) {
          console.log("Error in internal Controller:", error.message);
          res.status(500).json({ message: "Internal Server Error" });
     }
};

export const login = async (req, res) => {
     const {email, password} = req.body;
     try {
          const user = await User.findOne({email});
          if(!user){
               return res.status(400).json({ message: 'Invalid Credential' });
          }

         const isPasswordCorrect = await bcrypt.compare(password, user.password);
         if(!isPasswordCorrect){
          return res.status(400).json({ message: 'Invalid credential' });
         }

         generateToken(user._id, res);

         return res.status(200).json({
              _id: user._id,
              fullName: user.fullName,
              email: user.email,
              profilePic: user.profilePic,
         });
         
     } catch (error) {
          console.log('Error in login controller', error.message);
          res.status(500).json({ message: 'Internal Server Error' });
     }
}

export const logout = (req, res) => {
     try {
          res.cookie('jwt', '', {maxAge: 0});
          res.status(200).json({ message: 'logged out Successfully' })
     } catch (error) {
          console.log('Error in logout controller', error.message),
          res.status(500).json({ message: 'Internal Server Error' })
     }
     
};


export const updateProfile = async (req, res) => {
     try {
       const { profilePic } = req.body;
       const userId = req.user._id;
   
       if (!profilePic) {
         return res.status(400).json({ message: "Profile pic is required" });
       }
   
       const uploadResponse = await cloudinary.uploader.upload(profilePic);
       const updatedUser = await User.findByIdAndUpdate(
         userId,
         { profilePic: uploadResponse.secure_url },
         { new: true }
       );
   
       res.status(200).json(updatedUser);
     } catch (error) {
       console.log("error in update profile:", error);
       res.status(500).json({ message: "Internal server error" });
     }
   };

export const checkAuth = (req, res) =>{
     try {
          res.status(200).json(req.user);
     } catch (error) {
          console.log('Error in checkAuth Controller', error.message);
          res.status(500).json({ message: 'Internal Server Error' });
     }
}
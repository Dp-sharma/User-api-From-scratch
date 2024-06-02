const Student = require('../models/userModels');
const Blacklist = require('../models/blacklist');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const Student_register = async(req,res,next)=>{
    try {
        console.log('Received POST /api/register request');
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                success:false,
                msg:"Errors",
                errors: result.array()
            })
        } 
        console.log('Taking data from request')
        const {name,email,password} = req.body;

        const isExists =  await Student.findOne({email});
        if(isExists){
            return res.status(400).json({
                success: false,
                msg: 'Email Already Exists!'
            });
        }
        console.log('hashing the password')
       const hashpassword = await bcrypt.hash(password, 10);
        console.log('hashing completed')
        
        
        
        const student = new Student({
            name,
            email,
            password:hashpassword
        })
        console.log('the hased password saved in user data')
        console.log('saving The data in database')
        const studentData = await student.save();
        const accessToken = await generateAccessToken({ user:studentData });

        res.cookie("jwtoken",accessToken,{
            expires:new Date(Date.now()+2340000000),
            httpOnly:true
        })
        console.log('Student Registered in')
        res.redirect('/myprofile');
        // return res.status(200).json({
        //     success: true,
        //     msg: 'Registered Successfully!',
        //     user: studentData
        // });
        
        
    } catch (error) {
        console.log('this is last error')
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}


const generateAccessToken = async (user) => {
    console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);  // Log the secret key
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });
    return token;
};

const Student_login = async(req,res, next)=>{
    try {
        console.log('Received POST /api/login request');
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                success:false,
                msg:"Errors",
                errors: errors.array()
            })
        } 
        console.log('Getting data from the body');
        const { email, password } = req.body;
        console.log('Finding the data in database');
        const studentData = await Student.findOne({ email });
        console.log(studentData)
        if(!studentData){
            return res.status(401).json({
                success: false,
                msg: 'Email is Incorrect!'
            });
        }
        console.log('Comparing the password');
        const passwordMatch = await bcrypt.compare(password, studentData.password);

        if(!passwordMatch){
            return res.status(401).json({
                success: false,
                msg: 'Password is Incorrect!'
            });
        }
        console.log('Generating the token');
        const accessToken = await generateAccessToken({ user:studentData });

        res.cookie("jwtoken",accessToken,{
            expires:new Date(Date.now()+2340000000),
            httpOnly:true
        })
        console.log('Student logged in')
        res.redirect('/myprofile');
        // return res.status(200).json({
        //     success: true,
        //     msg: 'Login Successfully!',
        //     user: studentData,
        //     accessToken: accessToken,
        //     tokenType: 'Bearer'
        // })
    
    } catch (error) {
        console.log('This is last error')
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}
const Student_logout = async(req, res) =>{
    try{

        const token = req.cookies.jwtoken ;

        if (!token) {
            res.status(400).json({
                success:false,
                msg:"you are already logged out"
            })
        }
        // const bearer = token.split(' ');
        // const bearerToken = bearer[1];

        const newBlacklist = new Blacklist({
            token:token
        });

        await newBlacklist.save();

        res.clearCookie('jwtoken', { path: '/' });

        // res.setHeader('Clear-Site-Data', '"cookies","storage"');
        console.log('your are logged out')

        res.redirect('/login')
        // return res.status(200).json({
        //     success: true,
        //     msg: 'You are logged out!'
        // });

    }catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}
module.exports= {
    Student_register,
    Student_login,
    Student_logout
}






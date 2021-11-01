const User = require('../models/userModel');
const bcrypt = require('bcryptjs')
exports.signUp = async(req, res) => {
    try {
        const { userName, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            userName,
            password: hashPassword
        })
        req.session.user = newUser;

        return res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    } catch(e){
        console.log(e)
        return res.status(400).json({
            status: "fail",
        })
    }
}

exports.logIn = async(req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({
            userName,
        })
        if(!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            })

        }
        const isCorrect = await bcrypt.compare(password, user.password);
        if(isCorrect) {
            req.session.user = user;
            return res.status(200).json({
                status: 'success',
                data: {
                    user: user
                }
            })
        }
        return res.status(400).json({
            status: "fail",
            message: "Incorrect username and password"
        })
    } catch(e){
        console.log(e)
        res.status(400).json({
            status: "fail",
        })
    }
}
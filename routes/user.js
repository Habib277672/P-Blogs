const { Router } = require('express');
const User = require('../models/user')

const router = Router()

// Get Routes
router.get('/signin', (req, res) => {
    res.render('signIn')
})

router.get('/signup', (req, res) => {
    res.render('signUp')
})

// Post Routes
router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        await User.create({
            fullName,
            email,
            password
        })
        return res.redirect('/user/signin')
    } catch (error) {
        // Handles duplicate email or validation errors
        return res.render('signUp', {
            error: "Email already exists or invalid input"
        })
    }
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await User.matchPasswordAndGenerateToken(email, password)
        return res.cookie("token", token).redirect('/')
    } catch (error) {
        console.log(error)
        // FIX: was res.render('signin') — wrong case, file is signIn.ejs
        return res.render('signIn', {
            error: "Incorrect Email & Password"
        })
    }
})

router.get('/signout', (req, res) => {
    res.clearCookie('token').redirect("/")
})

module.exports = router;

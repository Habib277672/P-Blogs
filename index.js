require('dotenv').config()

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const Blog = require('./models/blog')

const { connectMongoDB } = require('./connection')
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const { checkForAuthCookie } = require('./middlewares/auth')

const app = express()
const PORT = process.env.PORT || 8000;

// ✅ Use __dirname — required for Vercel serverless
app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, 'views'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(checkForAuthCookie('token'))

// ✅ Connect inside each request for serverless (Vercel)
app.use(async (req, res, next) => {
    await connectMongoDB(process.env.MONGO_URL)
    next();
})

app.get('/', async (req, res) => {
    try {
        const allBlogs = await Blog.find({}).sort({ createdAt: -1 })
        res.render('home', {
            user: req.user,
            blogs: allBlogs,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})

app.use('/user', userRoute)
app.use('/blog', blogRoute)

// ✅ Only listen locally — Vercel handles this in production
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server Started Successfully on Port: ${PORT}`))
}

// ✅ Export app for Vercel
module.exports = app;
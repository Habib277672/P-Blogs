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

connectMongoDB(process.env.MONGO_URL)

app.set("view engine", "ejs")
app.set("views", path.resolve('./views'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(checkForAuthCookie('token'))

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({})
    res.render('home', {
        user: req.user,
        blogs: allBlogs,
    })
})

app.use('/user', userRoute)

app.use('/blog', blogRoute)


app.listen(PORT, () => console.log(`Server Started Successfully on Port: ${PORT}`))

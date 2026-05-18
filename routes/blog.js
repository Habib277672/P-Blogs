const { Router } = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path')

const Blog = require('../models/blog')
const Comment = require('../models/comments')

const router = Router()

// ✅ Cloudinary config — works on Vercel (no local filesystem needed)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'p-blogs',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
});

const upload = multer({ storage });

router.get("/addblog", (req, res) => {
    // ✅ Redirect to signin if not logged in
    if (!req.user) return res.redirect('/user/signin')
    return res.render('addBlog', {
        user: req.user
    })
})

router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy');
        const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy')
        return res.render('blog', {
            user: req.user,
            blog: blog,
            comments: comments
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})

router.post("/comment/:blogId", async (req, res) => {
    try {
        await Comment.create({
            content: req.body.content,
            blogId: req.params.blogId,
            createdBy: req.user._id,
        })
        return res.redirect(`/blog/${req.params.blogId}`)
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})

router.post("/", upload.single('coverImage'), async (req, res) => {
    try {
        const blog = await Blog.create({
            title: req.body.title,
            body: req.body.body,
            createdBy: req.user._id,
            // ✅ Cloudinary returns full https URL in req.file.path
            coverImageURL: req.file ? req.file.path : null,
        })
        return res.redirect(`/blog/${blog._id}`)
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong');
    }
})

module.exports = router;
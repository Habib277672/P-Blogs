const { Router } = require('express');
const multer = require('multer')
const path = require('path')

const Blog = require('../models/blog')
const Comment = require('../models/comments')

const router = Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, path.resolve(`./public/uploads`))
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        return cb(null, fileName)
    }
})

const upload = multer({ storage })

router.get("/addblog", (req, res) => {
    return res.render('addBlog', {
        user: req.user
    })
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy')
    // console.log(blog)
    // console.log(comments)
    return res.render('blog', {
        user: req.user,
        blog: blog,
        comments: comments
    })
})

router.post("/comment/:blogId", async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    })

    return res.redirect(`/blog/${req.params.blogId}`)
})

router.post("/", upload.single('coverImageURL'), async (req, res) => {

    try {
        const blog = await Blog.create({
            title: req.body.title,
            body: req.body.body,
            createdBy: req.user._id,
            coverImageURL: `/uploads/${req.file.filename}`,
        })

        return res.redirect(`/blog/${blog._id}`)

    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong');
    }

})

module.exports = router;

// create web server
// create a new comment
// get all comments
// get a comment
// update a comment
// delete a comment

const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

// create a new comment
router.post('/', async (req, res) => {
    const comment = new Comment({
        comment: req.body.comment,
        commenter: req.body.commenter
    });

    try {
        const newComment = await comment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// get all comments
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get a comment
router.get('/:id', getComment, (req, res) => {
    res.json(res.comment);
});

// update a comment
router.patch('/:id', getComment, async (req, res) => {
    if (req.body.comment != null) {
        res.comment.comment = req.body.comment;
    }

    try {
        const updatedComment = await res.comment.save();
        res.json(updatedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// delete a comment
router.delete('/:id', getComment, async (req, res) => {
    try {
        await res.comment.remove();
        res.json({ message: 'Deleted comment' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getComment(req, res, next) {
    let comment;
    try {
        comment = await Comment.findById(req.params.id);
        if (comment == null) {
            return res.status(404).json({ message: 'Cannot find comment' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.comment = comment;
    next();
}

module.exports = router;
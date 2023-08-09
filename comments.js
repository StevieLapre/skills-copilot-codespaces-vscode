// Create webserver
const express = require('express');
const router = express.Router();
// Require the database
const db = require('../db');
// Require the utility functions
const utils = require('../utils');
// Require the middleware
const middleware = require('../middleware');

// Route: /comments
// Method: GET
// Desc: Get all the comments
router.get('/', (req, res) => {
    // Get the query
    const query = req.query;
    // Check if the query is empty
    if (Object.keys(query).length === 0) {
        // Get all the comments
        db.getComments()
            .then(comments => {
                // Check if the comments exist
                if (comments.length > 0) {
                    // Send the comments
                    res.status(200).json(comments);
                } else {
                    // Send the error
                    res.status(404).json({
                        message: 'No comments found'
                    });
                }
            })
            .catch(err => {
                // Send the error
                res.status(500).json({
                    message: 'Server error',
                    error: err
                });
            });
    } else {
        // Get the comments by query
        db.getCommentsByQuery(query)
            .then(comments => {
                // Check if the comments exist
                if (comments.length > 0) {
                    // Send the comments
                    res.status(200).json(comments);
                } else {
                    // Send the error
                    res.status(404).json({
                        message: 'No comments found'
                    });
                }
            })
            .catch(err => {
                // Send the error
                res.status(500).json({
                    message: 'Server error',
                    error: err
                });
            });
    }
});

// Route: /comments
// Method: POST
// Desc: Create a new comment
router.post('/', middleware.authenticate, (req, res) => {
    // Get the comment
    const comment = req.body;
    // Check if the comment is empty
    if (Object.keys(comment).length === 0) {
        // Send the error
        res.status(400).json({
            message: 'Comment cannot be empty'
        });
    } else {
        // Check if the comment has all the required fields
        if (!comment.hasOwnProperty('author') || !comment.hasOwnProperty('content') || !comment.hasOwnProperty('post')) {
const express = require('express');
const router = express.Router({mergeParams : true});
const CatchAsync = require('../helpers/CatchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review.js');
const {validatereview , isLogedIn , isRevAuthor} = require('../middleware.js')
const reviews = require('../controller/reviews')





router.post('/' , isLogedIn , validatereview, CatchAsync(reviews.postReview));

router.delete('/:reviewId', isLogedIn , isRevAuthor , CatchAsync(reviews.deleteReview));

module.exports = router;
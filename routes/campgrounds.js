const express = require('express');
const router = express.Router();
const {isLogedIn , validateCatch , isAuthor} = require('../middleware')
const CatchAsync = require('../helpers/CatchAsync');
const ExpressError = require('../helpers/ExpressError');
const Campground = require('../models/campground');
const campgrounds = require('../controller/campgrounds');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage});



router.route('/')
    .get(CatchAsync(campgrounds.index))
    .post(isLogedIn, upload.array('image') , validateCatch , CatchAsync(campgrounds.showNewCamp));

router.get('/new' , isLogedIn , campgrounds.renderNewForm);

router.route('/:id')
    .get(CatchAsync(campgrounds.showCamp))
    .put( isLogedIn , isAuthor , upload.array('image')  , validateCatch , CatchAsync(campgrounds.updatedCamp))
    .delete(isLogedIn , isAuthor , CatchAsync(campgrounds.deleteCamp));

router.get('/:id/edit' , isLogedIn , isAuthor ,CatchAsync(campgrounds.editCamp))

    

module.exports = router;
const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' ,{campgrounds})
};

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new')
};

module.exports.showNewCamp = async(req,res,next)=>{
    const campground = new Campground(req.body.campground);
    campground.images=req.files.map( f => ({url : f.path, filename : f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success' , 'you successfully made new campground');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.showCamp = async (req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error','cannot be found , this campground may be deleted');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show' , {campground})
};

module.exports.editCamp = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit' , {campground})
};

module.exports.updatedCamp = async(req,res)=>{
    const{id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id , {...req.body.campground} , {new:true});
    const imgs = req.files.map( f => ({url : f.path, filename : f.filename}))
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImage){
        for(let filename of req.body.deleteImage){
          await  cloudinary.uploader.destroy(filename);
        }
       await campground.updateOne({$pull: {images : { filename : { $in : req.body.deleteImage}}}});
    }
    req.flash('success' , 'you successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.deleteCamp = async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    if(!campground){
        req.flash('error','cannot be found , this campground may be deleted');
        res.redirect('/campgrounds');
    }
    res.redirect('/campgrounds')
}
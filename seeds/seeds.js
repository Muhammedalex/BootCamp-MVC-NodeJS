const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors , places} = require('./seedHelpers');


mongoose.connect('mongodb://127.0.0.1:27017/Yelp-Camp',{
    useNewUrlParser : true,
    useUnifiedTopology : true
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error:"));
db.once('open',()=>{
    console.log('Database connected');
});

const sample = (array)=> array[Math.floor(Math.random()*array.length)];

const seedDB = async ()=>{
    await Campground.deleteMany({});
    for( i=0 ; i<=50 ; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random() *20)+10;
    const camp = new Campground({
        author : '6532941196a33039ea7abf87',
        location:`${cities[random1000].city}, ${cities[random1000].state}`, 
        title:`${sample(descriptors)} ${sample(places)}`,
        description : 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor sit animi sed eum, necessitatibus incidunt ratione accusantium, repellendus sequi rerum omnis aliquid quas consequuntur blanditiis quae ad inventore maiores deleniti.',
        price,
        images :  [
        {
            url: 'https://res.cloudinary.com/drd5ccixg/image/upload/v1697962945/YelpCamp/p5glvvmnoydoifjwthyi.jpg',
            filename: 'YelpCamp/p5glvvmnoydoifjwthyi',
        },
        {
            url: 'https://res.cloudinary.com/drd5ccixg/image/upload/v1697962847/YelpCamp/vms3mdsh8hjsam1yynpc.avif',
            filename: 'YelpCamp/vms3mdsh8hjsam1yynpc',
        }
    ]
      
    });
    await camp.save();
    }
    
};


seedDB().then(()=>{
    mongoose.connection.close();
});
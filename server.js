const express= require('express');
const app=express();
//geting data from databse
const ShortUrl=require('./models/shortUrl')

//mongoose connection
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/urlShortener',{
    useNewUrlParser:true, useUnifiedTopology:true
})
//view engine
app.set('view engine','ejs');
app.set('views','views');
app.use(express.urlencoded({extended:false}))




//getting the shortUrls
app.get('/', async(req,res,next)=>{
    const shortUrl= await ShortUrl.find()

res.render('index',{shortUrl:shortUrl})

})

//getting stats page
app.get('/stats',async (req,res)=>{
    const shortUrl= await ShortUrl.find()
    
    res.render('stats',{shortUrl:shortUrl})
    })



//submit full urls
app.post('/shortUrls',async (req,res,next)=>{
    console.log(Date.now(),'datatatatat')
   var dd= await ShortUrl.findOne({full:req.body.Url}) 
   console.log(dd.createdAt,'llllll')
   if(dd!==null){
    dd.createdAt > Date.now() - 30*86400000
    await ShortUrl.create({full:req.body.Url})
   }else{
    await ShortUrl.create({full:req.body.Url}) 
   }

res.redirect('/')
})

app.get('/:shortUrl',async(req,res)=>{

   const shortUrl= await ShortUrl.findOne({short:req.params.shortUrl}) 
   if(shortUrl == null) return res.sendStatus(404);

   shortUrl.clicks++
   shortUrl.save()
   res.redirect(shortUrl.full)
})


app.listen(5000)
const express =  require('express')
const router =  express.Router()


//Bring in Models
let Article =  require('../models/article')


//Add Article Route

router.get('/add',(req,res)=>{
    res.render('add_article',{
        title : 'Add Articles'
    })
})


//Submit (POST req) Article Route

router.post('/add',(req,res)=>{
    
    req.checkBody('title','Title is required').notEmpty()
    req.checkBody('author','Author is required').notEmpty()
    req.checkBody('body','Body is required').notEmpty()
    

    //Get Errors

    let errors = req.validationErrors()

    if(errors){
        res.render('add_article',{
            title : 'Add Article',
            errors : errors
        })
    }else{
          
    let article = new Article();
    article.title =req.body.title
    article.author =req.body.author
    article.body =req.body.body

    article.save((err)=>{
        if(err){
            console.log('Error');   
            return;
        }else{
            req.flash('success','Article Added')
            res.redirect('/')
            
           
        }
    })
   
    }
    
  
   
})


//Get Edit Article Route

router.get('/edit/:id',(req,res)=>{
    
    Article.findById(req.params.id,(err,article)=>{
        res.render('edit_article',{
            article : article
        })
    })

})


//Update Article Route

router.post('/edit/:id',(req,res)=>{
    let article = {};
    article.title =req.body.title
    article.author =req.body.author
    article.body =req.body.body

    let query = {_id:req.params.id}
    Article.update(query,article,(err)=>{
        if(err){
            console.log('Error');   
            return;
        }else{
            req.flash('success','Article Updated')
            res.redirect('/')
            
           
        }
    })
   
   
})


//Delete Article using its ID
//Ajax requires full version of jquery to be imported in Layout file as script using slim ver of ajax will give function err in devTools of Chrome
router.delete('/:id',(req,res)=>{
    let query = {_id:req.params.id}

    Article.remove(query,(err)=>{
        if(err){
            console.log(err);
            
        }
        res.send('Success')

    })
})


//Get Article Route

router.get('/:id',(req,res)=>{
    
    Article.findById(req.params.id,(err,article)=>{
        res.render('article',{
            article : article
        })
    })

})

module.exports=router
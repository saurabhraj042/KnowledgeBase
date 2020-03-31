//Adding librarires

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const config = require('./config/database')

mongoose.connect(config.databse,{ useNewUrlParser: true, useUnifiedTopology: true})
let db = mongoose.connection




//Check DB connection
db.once('open',()=>{
    console.log('Connected to DataBase');
})



//Check for Db Errors
db.on('error',(err)=>{
    console.log(err);
})



//Initialising Apps

const app = express()


//Express Validator MiddleWare
//Bug Report for LatestVer, Bug fix - use Ver5.3.1,for further bugreports check bookmarks
app.use(expressValidator())



// Passport Config
require('./config/passport')(passport)
// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())



// parse application/json
app.use(bodyParser.json())

//BodyParser middleware Setup
app.use(bodyParser.urlencoded({ extended: false }))



//Public Folder Setup
app.use(express.static(path.join(__dirname,'public')))

//Express Session MiddleWare
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
 
}))

//Express Message MiddleWare
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
 



//Bring in Models
let Article =  require('./models/article')


//View Setup

app.set('views',path.join(__dirname,'views'))
app.set('view engine','pug')


app.get('*',(req,res,next)=>{
    res.locals.user = req.user || null
    next()
})


 //Home Route
app.get('/',(req,res)=>{
   
    Article.find({},(err,articles)=>{
        if(err){
            console.log(err);
        }else{
            res.render('index',{
                title : 'Articles',
                articles : articles
            })
        }

    })
    
})    


//Routes Files
let articles = require('./routes/articles')
let users = require('./routes/users')
app.use('/articles',articles)
app.use('/users',users)







//Port setup

app.listen(3000,() => {
    console.log('Server Started On Port 3000...');
    
})


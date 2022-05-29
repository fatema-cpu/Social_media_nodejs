const passport=require('passport')

const LocalStrategy=require('passport-local').Strategy

const User=require('../models/user')

// authentication using passport
passport.use(new LocalStrategy({usernameField:'email'},function(email,password,done){
    // find a user and establish an identity
    User.findOne({email:email},function(err, user){
        if(err){
            console.log("Error in finding user --> Passport")
            return done(err)
        }
        if(!user || user.password!=password){
            console.log("Invalid username or password")
            return done(null,false)
        }
        return done(null,user)
    })
}))

// serializing the user to decide which key to be kept in cookie
passport.serializeUser(function(user,done){
    done(null,user.id)
})

// deserializing the user from the key in the cookie
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log("Error in finding user --> Passport")
            return done(err)
        }
        return done(null,user)
    })
})

// check if user is authenticated
passport.checkAuthentication=function(req,res,next){
    // if the user is signed in then pass on to the next function(controllers action)
    if(req.isAuthenticated()){
        return next()
    }
    // if the user is not signed in
    return res.redirect('/users/sign-in')
}

passport.setAuthenicatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie we are sending this to the locals for the views
        res.locals.user=req.user
    }
}

module.exports=passport
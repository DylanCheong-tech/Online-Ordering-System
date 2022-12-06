// check_isLoggedIn.middleware.js
// this middleware will check if the user session is authorised or not
// if yes, the user can access the resources 
// if no, the user will be redirect to login page for login 


// parameters ==> req : Request, res : Response, next : callback function 
function check_isLoggedIn (req, res, next) {
    if(req.isAuthenticated()){
        res.redirect("/admin/portal");
    }
    return next();
}

// export 
module.exports = check_isLoggedIn;
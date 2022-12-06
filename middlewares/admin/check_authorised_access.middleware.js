// check_authorised_access.middleware.js
// this middleware will check if the user session is authorised or not
// if yes, the user can access the resources 
// if no, the user will be redirect to login page for login 


// parameters ==> req : Request, res : Response, next : callback function 
function check_authorised_access (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/admin/");
}

// export 
module.exports = check_authorised_access;
// Middleware : Authenticate users

// dependencies
const getUser = require('../../helpers/mongodb/getUser');

// paramters ==> user : string, password : string, done : callback function 
async function authenticate_user(user, password, done) {
    let user_data = await getUser(user);
    if (user_data) {
        let original_password = user_data.password;

        if (password == original_password) {
            let authenticated_user = { id: user_data._id, username: user };
            return done(null, authenticated_user);
        }
        else {
            return done(null, false);
        }
    }

    return done(null, false);
}

module.exports = authenticate_user;
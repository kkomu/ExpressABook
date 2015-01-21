var mongoose = require('mongoose');

var uri = "mongodb://localhost/addressbook/users";

// Try to connect
mongoose.connect(uri,function(err,suc) {
    if(err) {
        console.log(err);
    }
    else {
        console.log("Nicely connected to " + uri);
    }
});

// Schema & model for user information
var userSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true}
});
var userModel = mongoose.model("Users", userSchema);

// Schema & model for user's contact information
var contactSchema = new mongoose.Schema({
    user: String,
    name: {type: String, required: true},
    address: String,
    email: String,
    phone: String,
    //birthday: Date,
    birthday: String,
    general: String
});
var contactModel = mongoose.model("Contacts", contactSchema);

// Login user if he/she is registered
exports.login = function(req,res) {
    console.log(req.body.username);
    console.log(req.body.password);
    
    // Find given username from database
    userModel.find({name: req.body.username}, function(err, data) {
        if(err) {
            console.log(err);
            res.render('error',{
                message: err.message,
                error: err
            });
        }
        // If username is not found
        else if(data[0] == null) {
            console.log("Username " + req.body.username + " not found!");
            res.redirect('/');
        }
        // If username is found
        else {
            console.log(data);
            
            if(data[0].password == req.body.password) {
                req.session.username = req.body.username;
                res.redirect('/contacts');
            }
            else {
                res.render('index',{ error: "Incorrect password!" });
            }
        }
    });
}

// Show contacts if user is logged in
exports.contacts = function(req,res) {
    if(req.session.username) {
        // Luetaan kontaktit db:stä
        contactModel.find({user: req.session.username}, function(err, data) {
            if(err) {
                //console.log("Ei onnistu 1!");
                res.render('error',{
                    message: err.message,
                    error: err
                });
            }
            else {
                console.log(data);
                // Render alternative contacts view. Use 'contacts' for standard
                res.render('contacts2',{contact_data:data});
                //res.render('contacts',{contact_data:data});
            }
        });
    }
    else {
        res.redirect('/');
    }
}

// Register new user & save to mongodb
exports.registerUser = function(req,res) {
    //console.log(req.body);
    var user = new userModel({
        name: req.body.username,
        password: req.body.password,
        email: req.body.email
    });
    console.log(user);

    user.save(function (err) {
        if(err) {
            console.log(err);
            res.render('error',{
                message: err.message,
                error: err
            });
            
        }
        else {
            console.log("OK");
            res.redirect('/');
        }
    });
}

// Save new/updated contact to mongodb
exports.saveContact = function(req, res) {
    
    if(req.session.username) {
        console.log(req.body);
        
        // Updating old contact if 'id' is found from req.body
        if(req.body.id) {
            var conditions = { _id: req.body.id };
            var update = { $set: {
                name: req.body.name,
                address: req.body.address,
                email: req.body.email,
                phone: req.body.phonenumber,
                birthday: req.body.birthday,
                general: req.body.general             
            }};
            var options = { upsert: true };

            contactModel.update(conditions, update, options, function(err) {
                if(err) {
                    console.log(err);
                    res.render('error',{
                        message: err.message,
                        error: err
                    });
                }
                else {
                    console.log("OK");
                    res.redirect('/contacts');
                }
            
            });
        }
        // Create new contact
        else {
            var contact = new contactModel({
                user: req.session.username,
                name: req.body.name,
                address: req.body.address,
                email: req.body.email,
                phone: req.body.phonenumber,
                //birthday: new Date(req.body.birthday),
                birthday: req.body.birthday,
                general: req.body.general
            });
        
            contact.save(function(err) {
                if(err) {
                    console.log(err);
                    res.render('error',{
                        message: err.message,
                        error: err
                    });
                }
                else {
                    console.log("OK");
                    res.redirect('/contacts');
                }

            });
        }
    }
    else {
        res.redirect('/');
    }
}

// Logout
exports.logout = function(req, res) {
    delete req.session.username
    req.session.destroy(function(err) {});
    res.redirect('/');
}

// Delete selected contact
exports.deleteContact = function(req, res) {
    console.log("Delete contact");
    contactModel.findById(req.query.id, function(err,data) {
        if(err) {
            console.log(err);
            res.render('error',{
                message: err.message,
                error: err
            });
        }
        else {
            data.remove(function(err) {
                if(err) {
                    console.log(err);
                    res.render('error',{
                        message: err.message,
                        error: err
                    });
                }
                else {
                    console.log("OK");
                    res.redirect('/contacts');
                }
                
            });
        }
        
    });
}

// Show contact information
exports.contactInfo = function(req,res) {
    console.log(req.query.id);
    contactModel.findById(req.query.id, function(err, data) {
        if(err) {
            console.log(err);
            res.render('error',{
                message: err.message,
                error: err
            });
        }
        else {
            console.log(data);
            res.render('contactinfo',data);
        }
    });
}

// Edit contact information
exports.editContact = function(req,res) {
    console.log("Edit");
    //res.redirect('/contacts');
    contactModel.findById(req.query.id, function(err, data) {
        if(err) {
            console.log(err);
            res.render('error',{
                message: err.message,
                error: err
            });
        }
        else {
            console.log(data);
            // Use new contact template with predefined data
            res.render('newcontact',data);
        }
    });
}

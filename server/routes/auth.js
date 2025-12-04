const express = require('express');
const router =  express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const UserSchema = require('../models/User');
const passport = require('passport');


const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'thisiscodeformediclapplicationwhich isbuiltinreactappproject';

router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
    },
}));


router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    cb(null, id);
});

// Route 1: Registering A New User: POST: http://localhost:8181/api/auth/register. No Login Required
router.post('/register',[
    body('email', "Please Enter a Vaild Email").isEmail(),
    body('name', "Username should be at least 4 characters.").isLength({ min: 4 }),
    body('password', "Password Should Be At Least 6 Characters.").isLength({ min: 6 }),
    body('phone', "Phone Number Should Be 10 Digits.").isLength({ min: 10 }),
    body('role', "Role is required").notEmpty(),
], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const checkMultipleUser1 = await UserSchema.findOne({ email : req.body.email });
        if(checkMultipleUser1){
            return res.status(403).json({ error: "A User with this email address already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        
        const newUser =  await UserSchema.create({
            role: req.body.role,
            email: req.body.email,
            name: req.body.name,
            password: hash,
            phone: req.body.phone,
            createdAt: Date(),
        });

        const payload = {
            user: {
                id: newUser.id,
            }
        }
        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
        res.json({ authtoken });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }

});

router.post('/login', [
    body('email', "Please Enter a Valid Email").isEmail(),
    body('role', "Role is required").notEmpty(), // <-- validate role
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password, role } = req.body;

        const theUser = await UserSchema.findOne({ email });
        if (!theUser) {
            return res.status(403).json({ error: "Invalid Credentials" });
        }

        // Check password
        const checkHash = await bcrypt.compare(password, theUser.password);
        if (!checkHash) {
            return res.status(403).json({ error: "Invalid Credentials" });
        }

        // ✅ Check role
        if (theUser.role !== role) {
            return res.status(403).json({ error: `Invalid role. Your account is registered as ${theUser.role}` });
        }

        // Create JWT
        const payload = { user: { id: theUser.id, role: theUser.role } };
        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            authtoken,
            name: theUser.name,
            email: theUser.email,
            role: theUser.role
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});



router.put('/update', [
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name } = req.body;

        const existingUser = await UserSchema.findOne({name });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        existingUser.name = name;
        existingUser.updatedAt = Date();

        const updatedUser = await existingUser.save();

        const payload = {
            user: {
                id: updatedUser.id,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
        res.json({ authtoken });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

// Route 4: Fetch user data based on the email: GET: http://localhost:8181/api/auth/user
router.get('/user', async (req, res) => {
    try {
      const email = req.headers.email; // Extract the email from the request headers

        if (!email) {
            return res.status(400).json({ error: "Email not found in the request headers" });
        }
    
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
    
        // Send only the necessary user details to the client
        const userDetails = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    
        res.json(userDetails);
        } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});
router.put('/user', [
    body('name', "Username should be at least 4 characters").isLength({ min: 4 }),
    body('phone', "Phone number should be 10 digits").isLength({ min: 10 }),
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        try {
            const email = req.headers.email; // Extract the email from the request headers
        
            if (!email) {
                return res.status(400).json({ error: "Email not found in the request headers" });
            }
        
            const existingUser = await UserSchema.findOne({ email });
            if (!existingUser) {
                return res.status(404).json({ error: "User not found" });
            }
        
            existingUser.name = req.body.name;
            existingUser.phone = req.body.phone;

            if (req.body.password && req.body.password.trim() !== "") {
                const salt = await bcrypt.genSalt(10);
                existingUser.password = await bcrypt.hash(req.body.password, salt);
            }

            existingUser.updatedAt = Date();
        
            const updatedUser = await existingUser.save();
        
            const payload = {
                user: {
                id: updatedUser.id,
                },
            };
        
            const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
            res.json({ 
                authtoken,
                passwordChanged: !!req.body.password    // true if password was updated
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send("Internal Server Error");
        }
});


module.exports = router;
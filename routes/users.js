const express = require('express');
const router = express.Router();
const userService = require('../services/userService')
const jwt = require('jsonwebtoken');
const AuthenticateWithJWT = require('../middlewares/AuthenticateWithJWT');

// POST register a new user
router.post('/register', async (req, res) => {
    // Need try catch as the service layer might throw error
    try {
        const newUserId = await userService.registerUser(req.body);
        res.json({ 
            "message": "Register a new user",
            "user_id": newUserId
          })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            'message': 'Unable to register user',
            'error': e
        })
    }
});

// POST login a user
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userService.loginUser(email, password);
        const token = jwt.sign({
            // jwt.sign got 3 parameters: payload, jwt secret and when it expires
            'userId': user.id
        }, process.env.JWT_SECRET,
            {
                'expiresIn': '1h'
            })
        res.json({
            message: "Login successful",
            token
        })
    } catch (e) {
        res.status(400).json({
            error: e,
            message: "Login unsuccessful"
        })
    };
});

router.put('/me', AuthenticateWithJWT, async(req, res) => {
    // When we authenticate in AuthenticateWithJWT.js, we save the userId in req
    const userId = req.userId;
    const userDetails = req.body;
    // console.log(userId)
    // console.log(userDetails)
    try {
        await userService.updateUserDetails(userId, userDetails)
        res.json({
            "message": "User updated"
        })
    } catch (e) {
        console.error("Update error:", e);
        res.status(400).json({
            error: e,
            message: "Failed to update user profile"
        })
    }
})

router.get('/me', AuthenticateWithJWT, async(req, res) => {
    try {
        const user = await userService.getUserDetailsById(req.userId);
        if (!user) {
            res.status(401).json({
                "error": "Unable to find user"
            })
        }
        res.json({
            user
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            'message': 'Unable to get profile',
            'error': e
        })
    }
})

module.exports = router;
// Dont do const {userDataLayer} = ... -> will do object destructuring
const userDataLayer = require("../data/userData")
const bcrypt = require('bcrypt');

// This makes use of getUserByEmail and createUser -> its a business rule so it should be in the service layer
async function registerUser({ name, email, password, salutation, country, marketingPreferences }) {
    // above is object destructuring (within the parameter) -> assign object to parameter
    if (password.length < 8) {
        // throw an error to the route fxn if there's an error -> nid try/catch in route fxn
        throw Error('Password must be at least 8 characters long');
    }

    const existingUser = await userDataLayer.getUserByEmail(email);
    if (existingUser) {
        throw Error("Email is already in use")
    }

    // Hashing of pw is done in svc layer -> security considered as a business rule,
    // not in the data layer -> just for accessing database
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserId = await userDataLayer.createUser({
        name,
        email,
        "password": hashedPassword,
        salutation,
        marketingPreferences,
        country
    });
    return newUserId;
}

async function loginUser(email, password) {
    // Does a user with the email exists?
    const existingUser = await userDataLayer.getUserByEmail(email);
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!existingUser || !isPasswordValid) {
        // Do this so hacker dk whether email or pw is invalid
        throw new Error('Invalid email or password');
    }

    return existingUser;
}

async function updateUserDetails(id, userDetails) {
    // TODO: Should do validation for all the fields here
    return await userDataLayer.updateUser(id, userDetails);
}

async function deleteUserAccount(id) {
    return await userDataLayer.deleteUser(id);
}

async function getUserDetailsById(id) {
    const user = await userDataLayer.getUserById(id);
    // Dont want to send the hashed password
    delete user.password;
    return user
}

module.exports = {
    registerUser,
    loginUser,
    updateUserDetails,
    deleteUserAccount,
    getUserDetailsById
};


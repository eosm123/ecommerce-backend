// Todo: Can do stock taking -> if not enough products in stock -> "Sorry, there is not enough of that product in stock"
const cartData = require('../data/cartData');

async function getCartContents(userId) {
    return await cartData.getCartContents(userId);
}

async function updateCart(userId, cartItems) {
    if (!Array.isArray(cartItems)) {
        throw new Error("Cart Items must be an array")
    }
    await cartData.updateCart(userId, cartItems);
}

module.exports = {
    getCartContents,
    updateCart
}
// Import the entire object connsisting of getAllProducts & getProductById
const productDataLayer = require("../data/productData")

async function getAllProducts() {
    return await productDataLayer.getAllProducts();
}

async function getProductById(id) {
    return await productDataLayer.getProductById(id);
}

module.exports = {
    getAllProducts, getProductById
}

// Important to have despite looking like this Service Layer is redundant
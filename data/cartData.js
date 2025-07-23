// no need {} around pool as pool has been directly exported out in database.js 
const pool = require('../database');

async function getCartContents(userId) {
    const [rows] = await pool.query(`SELECT cart_items.id, 
                                            cart_items.product_id,
                                            products.image AS image_url,
                                            products.name AS product_name,
                                            CAST(price AS DOUBLE) AS price,
                                            cart_items.quantity 
                                    FROM cart_items
                                    JOIN products
                                        ON cart_items.product_id = products.id
                                    WHERE cart_items.user_id = ?
        `, [userId])
    return rows;
}

/*
    NOTE: dont need userId as it is alr in the parameter of updateCart
    Contract for each cartItem:
    {
        product_id: Integer, primary key of product being added to shopping cart
        quantity: Integer
    }
*/
async function updateCart(userId, cartItems) {
    // creating multiple rows in the table + need to use existing shopping cart first
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Delete all the existing items in the cart for the user with userId
        await connection.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);

        // 2. Go thru each cart item and add it into shopping cart
        for (let c of cartItems) {
            await connection.query(
                "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?,?,?)",
                [userId, c.product_id, c.quantity]
            )
        }
        await connection.commit();
    } catch(e) {
        // rollback if there is any error
        await connection.rollback();
    } finally {
        connection.release();
    }
}

module.exports = {
    getCartContents,
    updateCart
}
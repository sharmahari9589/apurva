const promisePool = require("../../utils/pool");


class UserModel {

    insertOrderDetail = async (reqData) => {
        let sql = `Insert INTO orders SET ?`;
        const [result, fields] = await promisePool.query(sql, [reqData]);
        return result;
    }

    checkQuantity =  async (id) => {
        let sql = `SELECT productQuantity FROM products WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [id]);
        return result;
    }

    // insertOrderItem = async (orderId, item) => {
    //     let sql = `Insert INTO orderItem (orderId, productId, sizeId, price, quantity) VALUES (?,?,?,?,?)`;
    //     const [result, fields] = await promisePool.query(sql, [
    //         orderId,
    //         item.id,
    //         item.selectedSizeId,
    //         item.buyPrice,
    //         item.quantity
    //     ]);
    //     return result;
    // }

    insertOrderItem = async (orderItem) => {
        let sql = `Insert INTO orderItem SET ?`;
        const [result, fields] = await promisePool.query(sql, [orderItem]);
        return result;
    }

    clearCartItems = async (userId) => {
        let sql = 'DELETE FROM cartItems WHERE userId = ?';
        const [result, fields1] = await promisePool.query(sql, [userId]);
        return result;
    }

    updateOrderPaymentStatus = async(reqData)=> {
        let sql = `UPDATE orders SET paymentStatus = ?, payment_intend_id=?, paymentResult=? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [reqData.status, reqData.payment_intend_id, reqData.paymentResult, reqData.orderId]);
        return result;
    }


    updateOrderCodStatus = async(reqData)=> {
        let sql = `UPDATE orders SET paymentStatus = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [reqData.status, reqData.orderId]);
        return result;
    }

    cancelAndRemoveOrder = async(reqData) => {
        let sql = 'DELETE FROM orderItem WHERE orderId = ?';
        const [result, fields] = await promisePool.query(sql, [reqData.orderId]);        
        let sql1 = 'DELETE FROM orders WHERE id = ?';
        const [result1, fields1] = await promisePool.query(sql1, [reqData.orderId]);
        return result1;
    }

    getProductById = async (productId) => {
        let sql = `SELECT id, isSizeAvailable, productQuantity from products WHERE id = ? AND status = 1`;
        const [result, fields] = await promisePool.query(sql, [productId]);
        return result;
    }

    getSizeById = async (sizeId, productId) => {
        let sql = `SELECT id, quantity from productSizes WHERE sizeId = ? AND productId = ?`;
        const [result, fields] = await promisePool.query(sql, [sizeId, productId]);
        return result;
    }

    updateQuantityFromProductSizeTable = async (productId, sizeId) => {
        let sql = 'UPDATE productSizes SET quantity = quantity - 1 WHERE productId = ? AND sizeId = ?';
        const [result, fields] = await promisePool.query(sql, [productId, sizeId]);
        return result;
    }
    
    updateQuantityFromProductsTable = async (productId) => {
        let sql = 'UPDATE products SET productQuantity = productQuantity - 1 WHERE id = ?';
        const [result, fields] = await promisePool.query(sql, [productId]);
        return result;
    }
    
    checkUsedPromocode = async (promocode, userId) => {
        let sql = `SELECT id, promocode from orders WHERE promocode = ? AND userId = ?`;
        const [result, fields] = await promisePool.query(sql, [promocode, userId]);
        return result;
    }


    checkAllPromocode = async (promocode, userId) => {
        let sql = `SELECT id, promocode from orders WHERE promocode = ? AND userId = ?`;
        const [result, fields] = await promisePool.query(sql, [promocode, userId]);
        return result;
    }



    getUserEmailByUserId = async (userId) => {
        let sql = `SELECT email FROM users WHERE id = ? AND status = 1`;
        const [result, fields] = await promisePool.query(sql, [userId]);
        return result;
    }

    checkPromocode = async (promocode) => {
        let sql = `SELECT id, promoCode, discount, validFrom, validTo from promocode WHERE promoCode = ? `;
        const [result, fields] = await promisePool.query(sql, [promocode]);
        return result;
    }



    getPromocode = async (userId) => {
        

        let sql;
        if (userId) {
            sql = `
                SELECT id, promoCode, discount, validFrom, validTo 
                FROM promocode 
                WHERE (userId = ? OR applyFor = 'all')
            `;
            const [result, fields] = await promisePool.query(sql, [userId]);
            return result;
        } else {
            sql = `
                SELECT id, promoCode, discount, validFrom, validTo 
                FROM promocode 
                WHERE applyFor = 'all'
            `;
            const [result, fields] = await promisePool.query(sql);
            return result;
        }
    };
    


    checkProductQuantity = async (data) => {
        let sql = `SELECT id, isSizeAvailable, productQuantity from products WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.productId]);
        return result;
    }

    checkProductSizeQuantity = async (data) => {
        let sql = `SELECT id, sizeId, quantity, productId from productSizes WHERE sizeId = ? AND productId = ?`;
        const [result, fields] = await promisePool.query(sql, [data.productSizeId, data.productId]);
        return result;
    }

    getOrderListByUserId = async (userId) => {
        let sql = `SELECT o.id, o.userId, o.currency, o.totalAmount, o.deliveryAmount, o.paymentMethod, o.deliveryAddress, o.billingAddress, o.finalPayableAmount, o.orderNumber, o.deliveryPartner, o.tracking_Url_Id, o.expDeliveryDate, o.datetime as orderDate, ADDDATE(o.datetime, INTERVAL 7 DAY) as cancelAllowDate, o.status, o.statusDatetime, oi.cancelAndReturn_reson, oi.deliveryPartner,oi.tracking_Url_Id, oi.expDeliveryDate, oi.status as orderItemStatus, oi.updateTime as orderItemUpdateTime, oi.quantity, oi.id as orderItemId, oi.price, s.sizeName, p.productName, b.brandName, CONCAT(adr.fullName) AS fullName, p.slug, getImageArray(p.id) as images from orders AS o
        LEFT JOIN orderItem AS oi ON oi.orderId = o.id
        LEFT JOIN sizes AS s ON s.id = oi.sizeId
        LEFT JOIN products AS p ON p.id = oi.productId
        LEFT JOIN address AS adr ON adr.id = o.deliveryAddressId
        LEFT JOIN brands AS b ON b.id = p.brandId
        WHERE o.userId = ? ORDER BY o.id DESC`;
        const [result, fields] = await promisePool.query(sql, [userId]);

        result.forEach(product => {
            if (product.images) {
              product.images = JSON.parse(product.images);
            }

          });
        return result;
    }

    getOrderDetailById = async (reqData) => {
        let sql = `SELECT orders.*, users.email FROM orders LEFT JOIN users ON users.id = orders.userId WHERE orders.userId = ? AND orders.id = ?`;
        const [result, fields] = await promisePool.query(sql, [reqData.user_id, reqData.orderId]);
        return result;
    }

    cancelThisOrder = async (orderItemId) => {
        let sql = `UPDATE orderItem SET status = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [5, orderItemId]);
        return result;
    }

    insertCancelReason = async(userId, data) =>{
        let sql = 'INSERT INTO cancelAndReturns (userId, cancelAndReturn_reson, orderItemId, type, updatedBy) VALUES (?,?,?,?,?)'
        const [result, fields] = await promisePool.query(sql, [userId, data.cancelAndReturn_reson, data.orderItemId, '1', 'USER']);
        return result;
    }

    insertReturnReason = async(userId, data) =>{
        let sql = 'INSERT INTO cancelAndReturns (userId, orderItemId,cancelAndReturn_reson, deliveryPartner, tracking_Url_Id, expDeliveryDate, type, updatedBy) VALUES (?,?,?,?,?,?,?,?)'
        const [result, fields] = await promisePool.query(sql, [userId, data.orderItemId, data.cancelAndReturn_reson, data.deliveryPartner, data.tracking_Url_Id, data.expDeliveryDate, '2', 'USER']);
        return result;
    }
    
    returnThisOrder = async (orderItemId) => {
        let sql = `UPDATE orderItem SET status = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [6, orderItemId]);
        return result;
    }
    getOrderDetailsById = async (reqData) => {
        let sql = `SELECT o.*, CONVERT(getOrderItemsListById(o.id) USING utf8mb4) COLLATE utf8mb4_unicode_ci as orderItems,u.* FROM orders AS o LEFT JOIN users AS u ON u.id = o.userId WHERE o.id = ? AND userId = ?`;
        const [result, fields] = await promisePool.query(sql, [reqData.orderId, reqData.user_id]);

        result.forEach(order => {
            if (order.orderItems) {
                order.orderItems= JSON.parse(order.orderItems);
            }

            if (order.orderItems.deliveryAddress) {
                order.orderItems.deliveryAddress = JSON.parse(order.orderItems.deliveryAddress);
            }
          });

        return result;
    }

    getDeliveryChargesAndTaxes = async (regionName) => {
        let sql = `SELECT dct.id, dct.regionId, dct.deliveryCharges, dct.tax, r.regionName FROM deliveryChargesAndTaxes AS dct
        LEFT JOIN region AS r ON r.id = dct.regionId
        WHERE r.regionName = ? AND dct.status = 1`;
        const [result, fields] = await promisePool.query(sql, [regionName]);
        return result;
    }

    getCancelAndReturnOrderByItemId = async (userId, orderItemId) => {
        let sql = `SELECT cr.id, cr.userId, u.firstName, u.lastName, o.currency, u.email, cr.orderItemId, cr.cancelAndReturn_reson, cr.deliveryPartner, cr.tracking_Url_Id, cr.expDeliveryDate, cr.type, cr.updatedBy, cr.dateTime AS cancelAndReturnDate,oi.orderId, oi.productId, oi.updateTime, oi.refundedAmount, oi.deductionDetail, oi.price, oi.quantity, oi.refund_status, oi.dateTime AS orderPlacedOn, p.productName, getImageArray(p.id) AS image FROM cancelAndReturns AS cr
        LEFT JOIN users AS u ON u.id = cr.userId
        LEFT JOIN orderItem AS oi ON oi.id = cr.orderItemId
        LEFT JOIN orders AS o ON o.id = oi.orderId
        LEFT JOIN products AS p ON p.id = oi.productId WHERE cr.userId = ? AND cr.orderItemId = ? 
        ORDER BY cr.id DESC`;
        const [result, fields] = await promisePool.query(sql, [userId, orderItemId]);
        return result;
    }

    getSupplierList = async () => {
        let sql = `SELECT * FROM supplierDetails`;
        const [result, fields] = await promisePool.query(sql, []);
        return result;
    }

}

module.exports = new UserModel();

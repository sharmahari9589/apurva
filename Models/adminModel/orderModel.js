const promisePool = require("../../utils/pool");

exports.getPromoCodeList = async () => {
    let sql = `
        SELECT promocode.*, users.fullName 
        FROM promocode 
        LEFT JOIN users ON promocode.userId = users.id 
        ORDER BY promocode.id DESC
    `;
    const [result, fields] = await promisePool.query(sql);
    return result;
}


exports.insertPromoCode = async (data) => {
    let sql = 'INSERT INTO promocode (promoCode, discount, validFrom, validTo, userId, applyFor) VALUES (?,?,?,?,?,?) ';
    const [result] = await promisePool.query(sql, [
        data.promoCode,
        parseInt(data.discount),
        data.validFrom,
        data.validTo,
        data.userId,
        data.applyFor 
    ]);
    return result;
};

exports.checkPromoCodeName = async (promoCode) => {
    let sql = `SELECT promoCode FROM promocode WHERE promoCode = ?`;
    const [result, fields] = await promisePool.query(sql, [promoCode]);
    return result;
};


exports.updatePromoCode = async (data) => {
    let sql = 'UPDATE promocode SET promoCode = ?, discount = ?, validFrom = ?, validTo = ? WHERE id = ?'
    const [result] = await promisePool.query(sql, [
        data.promoCode,
        data.discount,
        data.validFrom,
        data.validTo,
        data.id
    ]);
    return result;
}

exports.updatePromoCodeStatus = async (data) => {
    let sql = `UPDATE promocode SET status = ? WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        data.status,
        data.id
    ])
    return result
}



exports.deletePromocode = async (data) => {
    let sql = `DELETE FROM promocode WHERE id = ?`;
    const [result] = await promisePool.query(sql, [data])
    return result
}

//---------------------------------|| ORDER ||---------------------------------

exports.getOrderList = async () => {
    let sql = `SELECT o.id, u.fullName, o.finalPayableAmount As totalAmount, o.currency, o.deliveryAmount,o.deliveryPartner,o.tracking_Url_Id,DATE_FORMAT(o.expDeliveryDate, '%Y-%m-%d') as expDeliveryDate, o.promoCodeDiscount, o.promocode, o.status, o.dateTime, o.statusDatetime, o.orderNumber, o.tax_per FROM orders AS o 
    LEFT JOIN users AS u ON u.id = o.userId
    ORDER BY o.id DESC`
    const [result, fields] = await promisePool.query(sql);
    return result;
}

exports.updateOrderStatus = async (data) => {
    let sql = `UPDATE orderItem SET status = ?, updateTime = CURRENT_TIMESTAMP WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        data.status,
        data.id
    ])
    return result
}

exports.updateOrderStatusComment = async (data) => {
    let sql = `UPDATE orderItem SET deliveryPartner = ?, tracking_Url_Id = ?, expDeliveryDate=?, status = ? WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        data.deliveryPartner,
        data.tracking_Url_Id,
        data.expDeliveryDate,
        data.status,
        data.id
    ])
    return result
}

exports.getCancelAndReturnList = async () => {
    let sql = `SELECT cr.id, cr.userId, u.fullName, u.email, cr.orderItemId, cr.cancelAndReturn_reson, cr.deliveryPartner, cr.tracking_Url_Id, cr.expDeliveryDate, cr.type, cr.updatedBy, cr.dateTime AS cancelAndReturnDate, oi.productId, oi.price, o.currency, oi.quantity, oi.refund_status, p.productName, getImageArray(p.id) AS image FROM cancelAndReturns AS cr
    LEFT JOIN users AS u ON u.id = cr.userId
    LEFT JOIN orderItem AS oi ON oi.id = cr.orderItemId
    LEFT JOIN products AS p ON p.id = oi.productId
    LEFT JOIN orders AS o ON o.id = oi.orderId
    ORDER BY cr.id DESC`
    const [result, fields] = await promisePool.query(sql);
    return result;
}

exports.getCancelAndReturnDetailById = async (id) => {
    let sql = `SELECT cr.id, cr.userId, u.fullName, o.currency, u.email, cr.orderItemId, cr.cancelAndReturn_reson, cr.deliveryPartner, cr.tracking_Url_Id, cr.expDeliveryDate, cr.type, cr.updatedBy, cr.dateTime AS cancelAndReturnDate,oi.orderId, oi.productId, oi.updateTime, oi.price, oi.quantity, oi.refund_status, oi.dateTime AS orderPlacedOn, p.productName, getImageArray(p.id) AS image FROM cancelAndReturns AS cr
    LEFT JOIN orderItem AS oi ON oi.id = cr.orderItemId
    LEFT JOIN users AS u ON u.id = cr.userId
    LEFT JOIN orders AS o ON o.id = oi.orderId
    LEFT JOIN products AS p ON p.id = oi.productId
    WHERE cr.id = ?
    ORDER BY cr.id DESC`
    const [result, fields] = await promisePool.query(sql, [id]);
    return result;
}

exports.updateCancelAndReturnStatus = async (data) => {
    let sql = `UPDATE orderItem SET refund_status = ?, refundedAmount = refundedAmount + ?, deductionDetail = ?, updateTime = CURRENT_TIMESTAMP WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        data.status,
        data.refundedAmount,
        data.deductionDetail,
        data.id
    ])
    return result
}

exports.updateOrderStatusToReject = async (data) =>{
    let sql = `UPDATE orderItem SET refund_status = ?, updateTime = CURRENT_TIMESTAMP WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        2,
        data.id
    ])
    return result
}

exports.getOrderDetailById = async (orderId) => {
    let sql = `SELECT o.dateTime, o.currency, oi.orderId, o.userId, o.orderNumber, o.paymentStatus, o.payment_intend_id, oi.deliveryPartner, oi.tracking_Url_Id, oi.expDeliveryDate  FROM orderItem AS oi
    LEFT JOIN orders AS o ON o.id = oi.orderId 
    WHERE oi.id = ?`;
    const [result, fields] = await promisePool.query(sql, [orderId]);
    return result;
}

exports.getOrderItemDetailById = async (id) => {
    let sql = `SELECT oi.*, cr.cancelAndReturn_reson, p.productName, p.productQuantity FROM orderItem as oi 
    LEFT JOIN products as p ON p.id = oi.productId 
    LEFT JOIN cancelAndReturns AS cr ON cr.orderItemId = oi.id
    WHERE oi.id = ? AND oi.refund_status = ?`;
    const [result, fields] = await promisePool.query(sql, [id, '0']);
    return result;
}

exports.getUserDetailById = async (userId) => {
    let sql = `SELECT * FROM users WHERE id = ?`;
    const [result, fields] = await promisePool.query(sql, [userId]);
    return result;
}

exports.getOrderDetailsById = async (orderId) => {
    let sql = `
        SELECT o.*, 
        CONVERT(getOrderItemsListById(o.id) USING utf8mb4) COLLATE utf8mb4_general_ci AS orderItems 
        FROM orders AS o 
        WHERE o.id = ?
    `;
    const [result, fields] = await promisePool.query(sql, [orderId]);
    
    // Parse orderItems field from string to array
    if (result.length > 0) {
        result[0].orderItems = JSON.parse(result[0].orderItems);

        // Parse images field within each orderItem to array
        result[0].orderItems?.forEach(orderItem => {
            orderItem.images = JSON.parse(orderItem.images);
        });
    }

    return result;
};



exports.updateCancelReason = async (data) => {
    let sql = `INSERT INTO orderItem (cancelAndReturn_reson), status = ? WHERE id = ?`
    const [result] = await promisePool.query(sql, [
        data.cancelAndReturn_reson,
        5,
        data.id
    ])
    return result
}

exports.updateStatusToCancelInOrderItem = async (orderId) => {
    let sql = `UPDATE orderItem SET status = ? WHERE orderId = ?`
    const [result] = await promisePool.query(sql, [
        1,
        orderId
    ])
    return result
}

exports.getOrderDetailByOrderId = async (orderId) => {
    let sql = `SELECT o.userId, o.orderNumber, o.paymentStatus, o.payment_intend_id FROM orders AS o
    WHERE o.id = ?`;
    const [result, fields] = await promisePool.query(sql, [orderId]);
    return result;
}

exports.cancelThisOrder = async (orderItemId) => {
    let sql = `UPDATE orderItem SET status = ? WHERE id = ?`;
    const [result, fields] = await promisePool.query(sql, [5, orderItemId]);
    return result;
}

exports.insertCancelReason = async (userId, data) => {
    let sql = 'INSERT INTO cancelAndReturns (userId, cancelAndReturn_reson, orderItemId, type, updatedBy) VALUES (?,?,?,?,?)'
    const [result, fields] = await promisePool.query(sql, [userId, data.cancelAndReturn_reson, data.orderItemId, '1', 'ADMIN']);
    return result;
}

exports.getSupplierList = async () => {
    let sql = `SELECT * FROM supplierDetails`;
    const [result, fields] = await promisePool.query(sql, []);
    return result;
}

exports.getSupplierListById = async (id) => {
    let sql = `SELECT * FROM supplierDetails WHERE id = ? `;
    const [result, fields] = await promisePool.query(sql, [id]);
    return result;
}

exports.updateSupplierDetail = async(data) =>{
    let sql = `UPDATE supplierDetails SET IIN = ?, BIN = ? , BIC = ?, address = ? WHERE id = ?`;
    const [result, fields] = await promisePool.query(sql, [data.IIN, data.BIN, data.BIC, data.address, data.id]);
    return result;
}

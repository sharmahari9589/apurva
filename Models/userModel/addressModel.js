const config = require('../../config');
const promisePool = require("../../utils/pool");

exports.getUserAddressList = async (userId) => {
    let sql = `SELECT * FROM address WHERE userId = ? AND status = 1`;
    const [result] = await promisePool.query(sql, [userId]);
    const modifiedResult = result.map((address) => {
        const match = address.region.match(/^(.*?)\s*\([^)]*\)$/);
        const regionName = match ? match[1] : address.region;
        return { ...address, regionName };
    });

    return modifiedResult;
};

exports.checkOldBillingAddress = async (userId) => {
    let sql = `SELECT billingAddress, userId, id FROM address WHERE userId = ? AND status = 1`;
    const [result] = await promisePool.query(sql, [userId]);
    return result;
};

exports.updateBillingStatus = async (userId) => {
    let sql = `UPDATE address set billingAddress = 0 WHERE userId = ?`;
    const [result, fields] = await promisePool.query(sql, [
        userId
    ]);
    return result;
}

exports.insertUserAddress = async (data, userId) => {
    let sql = 'INSERT INTO address (fullName,  address, city, state,region, postalCode, countryCode, phone, alternateNo, userId) VALUES (?,?,?,?,?,?,?,?,?,?) '
    const [result] = await promisePool.query(sql, [
        data.fullName,
        data.address,
        data.city,
        data.state,
        data.region,
        data.postalCode,
        data.countryCode,
        data.phone,
        data.alternateNo,
        userId
    ]);
    return result;
}




exports.getUserAddressDetailById = async (id) => {
    let sql = `SELECT * FROM address WHERE id = ? AND status = 1`;
    const [result] = await promisePool.query(sql, [id]);
    return result;
};


exports.updateBillingStatusById = async (userId, id) => {
    let sql = `UPDATE address set billingAddress = 0 WHERE userId = ? AND id != ?`;
    const [result, fields] = await promisePool.query(sql, [
        userId,
        id
    ]);
    return result;
}

exports.updateUserAddress = async (data, userId) => {
    let sql = `UPDATE address set fullName = ?, address = ?, city = ?, state = ?, region = ?, postalCode = ?, countryCode = ?, phone = ?,alternateNo=? WHERE id = ? AND userId = ?`;
    const [result, fields] = await promisePool.query(sql, [
        data.fullName,
        data.address,
        data.city,
        data.state,
        data.region,
        data.postalCode,
        data.countryCode,
        data.phone,
        data.alternateNo,
        data.id,
        userId

    ]);
    return result;
}

exports.deleteUserAddress = async (id, userId) => {
    let sql = `UPDATE address SET status = 0 WHERE id = ? And userId = ?`;
    const [result] = await promisePool.query(sql, [id, userId]);
    return result;
}
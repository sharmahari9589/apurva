const promisePool = require("../../utils/pool");

class adminModel {

    getDeliverAndTaxList = async (data) => {
        let sql = `SELECT dct.regionId, r.regionName, dct.id, dct.deliveryCharges, dct.tax, dct.status FROM deliveryChargesAndTaxes AS dct
        LEFT JOIN region AS r ON r.id = dct.regionId
         ORDER BY id DESC`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };

    checkDeliveryName = async (regionId) => {
        let sql = `SELECT regionId FROM deliveryChargesAndTaxes WHERE regionId = ?`;
        const [result, fields] = await promisePool.query(sql,[regionId]);
        return result;
    };

    insertDeliverAndTax = async (data) => {
        let sql = `INSERT INTO  deliveryChargesAndTaxes (regionId, deliveryCharges, tax) VALUES (?, ?, ?)`;
        const [result] = await promisePool.query(sql, [data.regionId, data.deliveryCharges, data.tax]);
        return result
    };

    updateDeliverAndTax = async (data) => {
        let sql = `UPDATE deliveryChargesAndTaxes SET regionId = ?, deliveryCharges = ?, tax = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.regionId, data.deliveryCharges, data.tax, data.id]);
        return result
    };

    updateDeliverAndTaxStatus = async (data) => {
        let sql = `UPDATE deliveryChargesAndTaxes SET status = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.status, data.id]);
        return result
    };


}
module.exports = new adminModel();

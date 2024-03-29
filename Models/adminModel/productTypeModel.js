const promisePool = require("../../utils/pool");

class adminModel {

  

    getProductTypeList = async () => {
        let sql = `SELECT pt.productTypeName, pt.categoryId, c.categoryName, pt.subCategoryId, sc.subCategoryName, pt.innerCategoryId, ic.innerCategoryName, pt.status, pt.id FROM productType AS pt 
        LEFT JOIN category AS c ON c.id = pt.categoryId
        LEFT JOIN subCategory AS sc ON sc.id = pt.subCategoryId
        LEFT JOIN innerCategory AS ic ON ic.id = pt.innerCategoryId
        order by pt.id desc`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };

    checkProductType = async (productTypeName, categoryId, subCategoryId, innerCategoryId) => {
        let sql = `SELECT productTypeName, categoryId, subCategoryId, innerCategoryId FROM productType WHERE productTypeName = ? AND categoryId = ? AND subCategoryId = ? AND innerCategoryId = ? `;
        const [result, fields] = await promisePool.query(sql,[productTypeName, categoryId, subCategoryId, innerCategoryId]);
        return result;
    };

    insertProductType = async (productTypeName, categoryId, subCategoryId, innerCategoryId) => {
        let sql = `INSERT INTO  productType (productTypeName, categoryId, subCategoryId, innerCategoryId) VALUES (?, ?, ?, ?)`;
        const [result] = await promisePool.query(sql, [productTypeName, categoryId, subCategoryId, innerCategoryId]);
        return result
    };

    updateProductType = async (data, id) => {
        let sql = `update productType set categoryId = ?, subCategoryId = ?, innerCategoryId = ?,productTypeName = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.categoryId, data.subCategoryId, data.innerCategoryId, data.productTypeName, id]);
        return result;
    };

    getProductTypeListById = async (data) => {
        let sql = `SELECT productTypeName, categoryId, subCategoryId, innerCategoryId, id FROM productType WHERE categoryId = ? AND subCategoryId = ? AND innerCategoryId = ? AND status = 0`;
        const [result, fields] = await promisePool.query(sql, [data.categoryId, data.subCategoryId, data.innerCategoryId]);
        return result;
    };

    updateProductTypeStatus = async (data) => {
        let sql = `update productType set status = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.status, data.id]);
        return result;
    };
}
module.exports = new adminModel();

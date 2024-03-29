const promisePool = require("../../utils/pool");

class adminModel {

  createInnerCategory = async () =>{
 let sql =   `CREATE TABLE innerCategory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        innerCategoryName VARCHAR(255),
        categoryId INT,
        subCategoryId INT,
        status INT DEFAULT 0
    );`
    await promisePool.query(sql)
  }
    
    getInnerCategoryList = async () => {
        let sql = `SELECT ic.innerCategoryName, c.categoryName, ic.categoryId, sc.subCategoryName, ic.subCategoryId, ic.status, ic.id FROM innerCategory AS ic 
        LEFT JOIN category AS c ON c.id = ic.categoryId
        LEFT JOIN subCategory AS sc ON sc.id = ic.subCategoryId
        order by ic.id desc`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    };
    

    checkInnerCategory = async (data) => {
        let sql = `SELECT innerCategoryName, categoryId, subCategoryId FROM innerCategory WHERE innerCategoryName = ? AND categoryId = ? AND subCategoryId = ? `;
        const [result, fields] = await promisePool.query(sql, [data.innerCategoryName, data.categoryId, data.subCategoryId]);
        return result;
    };

    insertInnerCategory = async (innerCategoryName, categoryId, subCategoryId) => {
        let sql = `INSERT INTO  innerCategory (innerCategoryName, categoryId, subCategoryId) VALUES (?, ?, ?)`;
        const [result] = await promisePool.query(sql, [innerCategoryName, categoryId, subCategoryId]);
        return result
    };

    updateInnerCategory = async (data, id) => {
        let sql = `update innerCategory set categoryId = ?, subCategoryId = ?, innerCategoryName = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.categoryId, data.subCategoryId, data.innerCategoryName, id]);
        return result;
      };

    getInnerCategoryById = async (data) => {
        let sql = `SELECT innerCategoryName, subCategoryId, id FROM innerCategory WHERE categoryId = ? AND subCategoryId = ? AND status = 0`;
        const [result, fields] = await promisePool.query(sql,[data.categoryId, data.subCategoryId]);
        return result;
    };

    innerCategoryStatusUpdate = async (data) => {
        let sql = `update innerCategory set status = ? WHERE id = ?`;
        const [result, fields] = await promisePool.query(sql, [data.status, data.id]);
        return result;
      };
}
module.exports = new adminModel();

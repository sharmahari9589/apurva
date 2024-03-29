const promisePool = require("../../utils/pool");

class UserModel {

    getCMSContentByRoute  = async (route) => {
        let sql = `SELECT p.*, pc.pageId, pc.title, pc.description FROM pages AS p
        LEFT JOIN pagesContent AS pc ON pc.pageId = p.id
        WHERE p.route = ? AND p.status = 1`;
        const [result] = await promisePool.query(sql, [route]);
        return result
    };

    getCMSPages  = async (route) => {
        let sql = `SELECT * FROM pages WHERE status = 1`;
        const [result] = await promisePool.query(sql, [route]);
        return result
    };

    insertContactUs = async (data) => {
        let sql = 'INSERT INTO contactUs (name, email, subject, message) VALUES (?,?,?,?) '
        const [result] = await promisePool.query(sql, [
            data.name,
            data.email,
            data.subject,
            data.message
        ]);
        return result;
    }


}
module.exports = new UserModel();


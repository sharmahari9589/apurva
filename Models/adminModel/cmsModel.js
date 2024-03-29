const promisePool = require("../../utils/pool");

class adminModel {
   
    insertCMSPages = async (data, route) => {
        let sql = `INSERT INTO  pages (name, heading, route ) VALUES (?,?,?)`;
        const [result] = await promisePool.query(sql, [data.name, data.heading, route]);
        return result
    };

    updateCMSPages = async (data, route) => {
        let sql = `UPDATE pages SET name = ?, heading = ?, route = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.name, data.heading, route, data.id]);
        return result
    };

    updatePagesStatus = async (data) => {
        let sql = `UPDATE pages SET status = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.status, data.id]);
        return result
    };


    getCMSPages  = async () => {
        let sql = `SELECT * FROM pages ORDER BY id DESC`;
        const [result] = await promisePool.query(sql, []);
        return result
    };

    insertCMSContent = async (data) => {
        let sql = `INSERT INTO  pagesContent (pageId, title, description) VALUES (?,?,?)`;
        const [result] = await promisePool.query(sql, [data.pageId, data.title, data.description]);
        return result
    };

    updateCMSContent = async (data) => {
        let sql = `UPDATE pagesContent SET title = ?, description = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.title, data.description, data.id]);
        return result
    };

    getCMSContentById  = async () => {
        let sql = `SELECT * FROM pagesContent `;
        const [result] = await promisePool.query(sql, []);
        return result
    };

    getContactUsList = async () => {
        let sql = `SELECT * FROM contactUs ORDER BY id DESC `;
        const [result] = await promisePool.query(sql, []);
        return result
    };

    getContactUsDetailById = async (id) => {
        let sql = `SELECT * FROM contactUs WHERE id = ?`;
        const [result] = await promisePool.query(sql, [id]);
        return result
    };

    getFeedbackList  = async () => {
        let sql = `SELECT feedback.*, products.productName
        FROM feedback
        INNER JOIN products ON feedback.productId = products.id
        ORDER BY feedback.id DESC; `;
        const [result] = await promisePool.query(sql, []);
        return result
    };

    updateFeedStatus = async (data) => {
        let sql = `UPDATE feedback SET status = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.status, data.id]);
        return result
    };

    updateFeedback = async (data) => {
        let sql = `UPDATE feedback SET feedback = ?, rating = ? WHERE id = ?`;
        const [result] = await promisePool.query(sql, [data.feedback, data.rating, data.id]);
        return result;
    };
    

    deleteFeedback = async (feedbackId) => {
        let sql = `DELETE FROM feedback WHERE id = ?`;
        const [result] = await promisePool.query(sql, [feedbackId]);
        return result;
    }


    insertFeedback = async (data) => {
        let sql = `INSERT INTO feedback ( rating, feedback,feedbackImage,userId,productId,status) VALUES (?,?,?,?,?,?)`;
        const [result, fields] = await promisePool.query(sql, [
          data.rating,
          data.feedback,
          data.feedbackImage,
          data.userId,
          data.productId, 
          data.status
    
    
        ]);
        return result;
      };

}
module.exports = new adminModel();

const promisePool = require("../../utils/pool");

class adminModel {

  getAdminDetails = async (data) => {
    let sql = `SELECT * FROM admin where email = ?`;
    const [result, fields] = await promisePool.query(sql, [data.email]);
    return result;
  };

  getAdminInfo = async (id) => {
    let sql = `SELECT * FROM admin where id = ?`;
    const [result] = await promisePool.query(sql, [id]);
    return result;
  };

  adminUpdatePassword = async (newPassword, admin_email) => {
    let sql = `UPDATE admin SET password = ? WHERE email = ?`;
    const [result] = await promisePool.query(sql, [newPassword, admin_email]);
    return result;
  };

  getUserList = async () => {
    let sql = `select * from users  WHERE loginType='user' order by id desc`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };


  getCustomerByName = async (fullName) => {
    let sql = `SELECT * FROM users WHERE fullName LIKE ?`;
    const [result, fields] = await promisePool.query(sql, [`%${fullName}%`]);
    return result;
};


  getVendorList = async () => {
    let sql = `SELECT * FROM users WHERE loginType='vendor' ORDER BY id DESC`;
    const [result, fields] = await promisePool.query(sql);
    return result;
};




  checkUser = async (data) => {
    let sql = `SELECT * FROM users where id = ?`;
    const [result, fields] = await promisePool.query(sql, [data.id]);
    return result;
  };

  checkVendor = async (data) => {
    let sql = `SELECT * FROM users WHERE loginType='vendor' AND id = ?`;
    const [result, fields] = await promisePool.query(sql, [data.id]);
    return result;
};


vendorStatusUpdate = async (data, id) => {
  let sql = `UPDATE users SET status = ?, loginType = 'vendor' WHERE id = ?`;
  const [result, fields] = await promisePool.query(sql, [data.status, id]);
  return result;
};


  userStatusUpdate = async (data, id) => {
    let sql = `update users set status = ? WHERE id = ?`;
    const [result, fields] = await promisePool.query(sql, [data.status, id]);
    return result;
  };

  getDashboardStatistics = async () => {
    let sql = `SELECT COUNT(id)
    AS totalPackages,
   SUM(CASE WHEN packages.status = 0 THEN 1 ELSE 0 END) AS totalActivePackages,
   SUM(CASE WHEN packages.status = 1 THEN 1 ELSE 0 END) AS totalInactivePackages,
   (SELECT COUNT(id)
    FROM users) AS totalUser,
   (SELECT SUM(CASE WHEN date_format(users.dateTime,'%Y-%m-%d')=CURDATE() THEN 1 ELSE 0 end) FROM users) as todayRegisteredUsers
   FROM packages`;
    const [result] = await promisePool.query(sql);
    return result;
  };

 
}
module.exports = new adminModel();

const promisePool = require("../../utils/pool");

exports.getDashboardStatistics = async() => {
    let sql = `SELECT getTotalUserCount() as totalUser, totalActiveUser() AS totalActiveUser,  totalProducts() as totalProducts, getTotalOrders() as totalOrders, todayPlaceOrders() as todayPlaceOrder, totalBrands() AS totalBrands, totalCancelOrders() AS totalCancelOrders, totalReturnOrders() AS totalReturnOrders, totalPromocodes() AS totalPromocodes,getTotalVendorCount() AS totalVendors	`;
    const [result] = await promisePool.query(sql);
    return result;
}
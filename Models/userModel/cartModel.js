const promisePool = require("../../utils/pool");


class CartModel {

  AddCart = async (reqData) => {
    let sql = `Insert INTO cartItems SET ?`;
    const [result, fields] = await promisePool.query(sql, [reqData]);
    return result;
  }


  updateCartItem = async (reqData) => {
    let sql = `UPDATE cartItems SET quantity = ? WHERE productId = ? AND userId = ?`;
    let where = [reqData.quantity, reqData.productId, reqData.userId];
    if (reqData.selectedSizeId || reqData.selectedSizeId != null) {
      sql = `UPDATE cartItems SET quantity = ?, selectedSizeId = ? WHERE productId = ? AND userId = ?`;
      where = [reqData.quantity, reqData.selectedSizeId, reqData.productId, reqData.userId];
    }
    const [result, fields] = await promisePool.query(sql, where);
    return result;
  }

  removeFromCart = async (reqData) => {
    let sql = `DELETE FROM cartItems WHERE productId = ? AND userId = ?`;
    let where = [reqData.productId, reqData.userId]
    if (reqData.selectedSizeId || reqData.selectedSizeId != null) {
      sql = `DELETE FROM cartItems WHERE productId = ? AND userId = ? AND selectedSizeId = ?`;
      where = [reqData.productId, reqData.userId, reqData.selectedSizeId]
    }
    const [result, fields] = await promisePool.query(sql, where);
    return result;
  }

  checkCartItem = async (reqData, userId) => {
    let sql = `SELECT * FROM cartItems WHERE productId = ? AND userId = ?`;
    let where = [reqData.productId, userId];
    if (reqData.selectedSizeId || reqData.selectedSizeId != null) {
      sql = `SELECT * FROM cartItems WHERE productId = ? AND userId = ? AND selectedSizeId = ?`;
      where = [reqData.productId, userId, reqData.selectedSizeId];
    }
    const [result, fields] = await promisePool.query(sql, where);
    return result;
  }

  getCartItems = async (userId,userType) => {

    let sql;

    if(userType =='vendor'){


       sql = `SELECT ci.productId as id, ci.quantity, ci.selectedSizeId, pr.productName, pr.description, pr.vendorPrice, pr.marginPrice, pr.productQuantity, pr.discount, pr.slug, getImageArray(ci.productId) as images, getProductSizes(ci.productId, pr.categoryId) AS allSizes, b.brandName, LOWER(c.categoryName) as categoryName,  s.sizeName FROM cartItems as ci 
      LEFT JOIN products as pr ON pr.id = ci.productId 
      LEFT JOIN brands as b ON b.id = pr.brandId 
      LEFT JOIN category as c ON c.id = pr.categoryId 
      LEFT JOIN sizes as s ON s.id = ci.selectedSizeId 
      
      WHERE userId=${userId} ORDER BY ci.id DESC`;

    }
    else{
      sql = `SELECT ci.productId as id, ci.quantity, ci.selectedSizeId, pr.productName, pr.description, pr.customerPrice, pr.marginPrice, pr.productQuantity, pr.discount, pr.slug, getImageArray(ci.productId) as images, getProductSizes(ci.productId, pr.categoryId) AS allSizes, b.brandName, LOWER(c.categoryName) as categoryName,  s.sizeName FROM cartItems as ci 
      LEFT JOIN products as pr ON pr.id = ci.productId 
      LEFT JOIN brands as b ON b.id = pr.brandId 
      LEFT JOIN category as c ON c.id = pr.categoryId 
      LEFT JOIN sizes as s ON s.id = ci.selectedSizeId 
      WHERE userId=${userId} ORDER BY ci.id DESC`;

    }

  
    const [result, fields] = await promisePool.query(sql, [
      userId,
    ]);

   
    result.forEach(product => {
      if (product.images) {
          product.images = JSON.parse(product.images);;
      }
      if (product.allSizes) {
        product.allSizes = JSON.parse(product.allSizes);;
    }
    })

    return result;
  };


  updateWishListItemSize = async (reqData) => {
    let sql = `UPDATE wishlist SET selectedSizeId = ? WHERE productId = ? AND userId = ?`;
    const [result, fields] = await promisePool.query(sql, [
      reqData.selectedSizeId,
      reqData.productId,
      reqData.userId
    ]);
    return result;
  };

  // updateCartStatus = async (data) => {
  //   let sql = `UPDATE cart set status = ? WHERE id = ? And productId = ?`;
  //   const [result, fields] = await promisePool.query(sql, [
  //     data.status,
  //     data.id,
  //     data.productId
  //   ]);
  //   return result;
  // }

  // getCartList = async (userId) => {
  //   let sql = `SELECT c.id, c.status, c.productId, c.productQuantity, p.productName, p.description, p.price, cs.clothesSize, ss.shoesSize, csq.clothesPrice, ssq.shoesPrice, csq.clothesQuantity, ssq.shoesQuantity, pi.image FROM cart As c 
  //   LEFT JOIN products AS p ON p.id = c.productId
  //   LEFT JOIN productImage As pi ON pi.productId = p.id
  //   LEFT JOIN clothesSize As cs ON cs.id = c.clothesSizeId
  //   LEFT JOIN shoesSize As ss ON ss.id = c.shoesSizeId
  //   LEFT JOIN clothesSizesAndQuantity AS csq ON csq.productId = c.productId
  //   LEFT JOIN ShoesSizesAndQuantitiy AS ssq ON ssq.productId = c.productId
  //   WHERE c.userId = ? And c.status = '1' ORDER BY c.id DESC `;
  //   const [result] = await promisePool.query(sql, [userId]);
  //   return result;
  // };

  // updateCartSizeAndQuantity = async (data) => {
  //   let sql = `UPDATE cart set shoesSizeId = ?, clothesSizeId = ?, productQuantity = ? WHERE id = ? And productId = ?`;
  //   const [result, fields] = await promisePool.query(sql, [
  //     data.shoesSizeId,
  //     data.clothesSizeId,
  //     data.productQuantity,
  //     data.id,
  //     data.productId
  //   ]);
  //   return result;
  // }

}

module.exports = new CartModel();

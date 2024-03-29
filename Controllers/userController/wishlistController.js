const productModel = require("../../Models/userModel/productModel");
const registerModel = require("../../Models/userModel/registerModel");
const { response, message } = require("../../utils/response");

//----------------------------------|| WISHLIST ||------------------------------------

exports.AddToWishlist = async (req, res) => {
  try {
    let getWishlist = await productModel.getWishlist(req.body, req.userId);
    if (getWishlist.length > 0) {
      await productModel.updateWishlistStatus(getWishlist[0]);
      return res
        .status(200)
        .send(response(true, "Product removed from wishlist!"));
    }
    let AddWishlist = await productModel.AddWishlist(req.body, req.userId);
    if (AddWishlist) {
      return res
        .status(200)
        .send(response(true, "Product added to wishlist!"));
    } else {
      return res
        .status(200)
        .send(response(true, "Something! Went Wrong Please Try Again"));
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send(response(false, message.catchMessage));
  }
};

// exports.updateWishlistStatus = async (req, res) => {
//   try {
//     await productModel.updateWishlistStatus(req.body);
//     if (req.body.status == 1) {
//       return res
//         .status(200)
//         .send(response(true, "Product added to wishlist!"));
//     } else {
//       return res
//         .status(200)
//         .send(response(true, "Product Removed From Wishlist"));
//     }
//   } catch (error) {
//     return res.status(500).send(response(false, message.catchMessage));
//   }
// };

exports.getWishlistList = async (req, res) => {
  try {

    let UserType= await registerModel.getUserDetails(req.userId)
    let productList = await productModel.getWishlistList(req.userId,UserType[0].loginType);

    if (productList.length > 0) {
      return res.status(200).send(response(true, "Product List", productList));
    }
    return res.status(200).send(response(false, message.noDataMessage, []));
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(response(false, message.catchMessage, []));
  }
};

exports.updateWishlistSize = async (req, res) => {
  try {
    let updateSize = await productModel.updateWishlistSize(req.body);
    if (updateSize) {
      return res
        .status(200)
        .send(response(true, "Product Size Updated Successfully"));
    } else {
      return res.status(200).send(response(true, "Unable to Update Size"));
    }
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};

// exports.getWishlistCount = async (req, res) => {
//   try {
//     // console.log(req.userId);
//     let getWishlistCount = await productModel.getWishlistCount(req.userId);
//     if (getWishlistCount) {
//       return res.status(200).send(response(true, "count", getWishlistCount[0]));
//     } else {
//       return res.status(200).send(response(true, ""));
//     }
//   } catch (error) {
//     return res.status(500).send(response(false, message.catchMessage));
//   }
// };

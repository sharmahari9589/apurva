const cartModel = require("../../Models/userModel/cartModel");
const registerModel = require("../../Models/userModel/registerModel");
const { response, message } = require("../../utils/response");

exports.getCartItems = async (req, res) => {
    try {

          let UserType= await registerModel.getUserDetails(req.userId)

        let result = await cartModel.getCartItems(req.userId,UserType[0]?.loginType);
        if (result) {
          return res.status(200).send(response(true, "Cart Items", result));
        } else {
          return res.status(200).send(response(true, "", []));
        }
      } catch (error) {
        console.log(error)
        return res.status(500).send(response(false, message.catchMessage, []));
      }
}

exports.AddToCart = async (req, res) => {
    try {
        console.log(
            req.body,"fbodyse"
        );
        let checkCartItem = await cartModel.checkCartItem(req.body, req.userId);
        console.log(checkCartItem,"asd");
        let reqData = {
            productId: req.body.productId,
            userId: req.userId,
            quantity: req.body.quantity,
            selectedSizeId: req.body.selectedSizeId ? req.body.selectedSizeId : null
        }

        await cartModel.updateWishListItemSize(reqData)

        if (checkCartItem.length == 0) {
            let result = await cartModel.AddCart(reqData)
            if (result) {
                return res.status(200).send(response(true, "Product added to cart!"));
            } else {
                return res.status(200).send(response(true, "Something! Went Wrong Please Try Again"));
            }
        }
        else {
            let result = await cartModel.updateCartItem(reqData, checkCartItem[0].id)
            console.log(result,"re");
            if (result) {
                return res.status(200).send(response(true, "Cart item updated!"));
            } else {
                return res.status(200).send(response(true, "Something! Went Wrong Please Try Again"));
            }
        }
    } catch (error) {
        return res.status(500).send(response(false, error.message));
    }
}

exports.removeFromCart = async (req, res) => {
    try {
        req.body.userId = req.userId;
        await cartModel.removeFromCart(req.body)
        return res.status(200).send(response(true, "Product removed from cart!"));
    } catch (error) {
        // return res.status(500).send(response(false, message.catchMessage));
        return res.status(500).send(response(false, error.message));
    }
}

exports.updateCartItem = async (req, res) => {
    try {
        req.body.userId = req.userId;
        await cartModel.updateCartItem(req.body)
        return res.status(200).send(response(true, "Cart item updated!"));
    } catch (error) {
        // return res.status(500).send(response(false, message.catchMessage));
        return res.status(500).send(response(false, error.message));
    }
}


// exports.updateCartStatus = async (req, res) => {
//     try {
//         await cartModel.updateCartStatus(req.body)
//         if (req.body.status == 1) {
//             return res.status(200).send(response(true, "Product Added To Cart Successfully"));
//         } else {
//             return res.status(200).send(response(true, "Product Removed From Cart Successfully"));
//         }
//     } catch (error) {
//         // return res.status(500).send(response(false, message.catchMessage));
//         return res.status(500).send(response(false, error.message));
//     }
// }



// exports.updateCartSizeAndQuantity = async (req, res) => {
//     try {
//         let updateSizeAndQuantity = await cartModel.updateCartSizeAndQuantity(req.body)
//         if (updateSizeAndQuantity) {
//             return res.status(200).send(response(true, "Product Updated Successfully"));
//         } else {
//             return res.status(200).send(response(true, "Unable to Update "));
//         }
//     } catch (error) {
//         // return res.status(500).send(response(false, message.catchMessage));
//         return res.status(500).send(response(false, error.message));
//     }
// }

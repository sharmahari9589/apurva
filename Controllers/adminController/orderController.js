const { response, message } = require("../../utils/response");
const orderModel = require('../../Models/adminModel/orderModel')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const emailActivity = require("../userController/emailActivity.controller");
const productModel = require("../../Models/adminModel/productModel");

exports.getPromoCode = async (req, res) => {
	try {
		let promoCode = await orderModel.getPromoCodeList()
		if (promoCode.length > 0) {
			return res.status(200).send({ success: true, msg: 'Promo Code List', promoCode })
		}
		return res.status(200).send(response(false, message.noDataMessage));

	} catch (error) {
		console.log(error);
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.insertPromoCode = async (req, res) => {
	try {
		let checkName = await orderModel.checkPromoCodeName(req.body.promoCode)
		if (checkName.length > 0) {
			return res
				.status(200)
				.send(response(false, "Promocode already added",));
		}
		req.body.promoCode = req.body.promoCode.toUpperCase()
		let insertPromoCode = await orderModel.insertPromoCode(req.body)
		if (insertPromoCode) {
			return res.status(200).send({ success: true, msg: 'Promocode Added Successfully' })
		} else {
			return res.status(200).send({ success: false, msg: 'Unable to Add Promocode Please Try Again!' })
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.updatePromoCode = async (req, res) => {
	try {
		let updatePromo = await orderModel.updatePromoCode(req.body)
		if (updatePromo) {
			return res.status(200).send({ success: true, msg: 'Promocode Updated Successfully' })
		} else {
			return res.status(200).send({ success: false, msg: 'Unable to Update Promocode Please Try Again!' })
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.updatePromoCodeStatus = async (req, res) => {
	try {
		let updatePromoCodeStatus = await orderModel.updatePromoCodeStatus(req.body)
		if (updatePromoCodeStatus) {
			return res.status(200).send({ success: true, msg: 'Success' })
		} else {
			return res.status(200).send({ success: false, msg: 'Unable to Update Promocode Status, Please Try Again!' })
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, message.catchMessage));
	}
}



exports.removePromocode = async (req, res) => {
	try {
		let updatePromoCodeStatus = await orderModel.deletePromocode(req.body.id)
		if (updatePromoCodeStatus) {
			return res.status(200).send({ success: true, msg: 'Success' })
		} else {
			return res.status(200).send({ success: false, msg: 'Unable to delete Promocode Status, Please Try Again!' })
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, message.catchMessage));
	}
}
//-------------------------------|| ORDER ||-----------------------------------

exports.getOrderList = async (req, res) => {
	try {
		let orderList = await orderModel.getOrderList()
		if (orderList.length > 0) {
			return res.status(200).send({ success: true, msg: 'Order List', orderList })
		}
		return res.status(200).send(response(false, message.noDataMessage));

	} catch (error) {
		return res.status(500).send(response(false, error.message));
	}
}

exports.updateOrderStatusWithComment = async (req, res) => {
	try {
		let updateOrderStatusComment = await orderModel.updateOrderStatusComment(req.body)
		if (updateOrderStatusComment) {
			return res.status(200).send({ success: true, msg: 'Success' })
		} else {
			return res.status(200).send({ success: false, msg: 'Unable to Update order Status, Please Try Again!' })
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.updateOrderStatus = async (req, res) => {
	try {
		let orderInfo = await orderModel.getOrderDetailById(req.body.id)		
		let userInfo = await orderModel.getUserDetailById(orderInfo[0].userId);
		let currency = orderInfo[0].currency;
		const deliveryDate = new Date(orderInfo[0].expDeliveryDate);
		const expDeliveryDate = deliveryDate.toLocaleDateString();
		const placedOn = new Date(orderInfo[0].dateTime);
		const dateTime = placedOn.toLocaleDateString();
		let updateOrderStatus = await orderModel.updateOrderStatus(req.body)

		if (updateOrderStatus) {
			if (req.body.status == 1) {
				console.log(req.body.status)
				let mailmsg = ``;
				let headerMSG = `Your Order has been Proceed!`;
				let headerMSG1 = `<h3>Your order #${orderInfo[0].orderNumber} is under proceed!</h3>
				<p><strong>Order Placed On: </strong> ${dateTime}</p>`;
				let ans =await emailActivity.Activity(
					userInfo[0]?.email,
					'Order proceed (#' + orderInfo[0].orderNumber + ')',
					headerMSG,
					headerMSG1,
					mailmsg
				);
				console.log(ans)
			} else if (req.body.status == 2) {
				let mailmsg = ``;
				let headerMSG = `Your Order has been Shipped!`;
				let headerMSG1 = `<h3>Your order #${orderInfo[0].orderNumber} is shipped!</h3>
				<p><strong>Order Placed On: </strong> ${dateTime}</p>`;
				await emailActivity.Activity(
					userInfo[0].email,
					'Order Shipped (#' + orderInfo[0].orderNumber + ')',
					headerMSG,
					headerMSG1,
					mailmsg
				);

			} else if (req.body.status == 3) {
				let mailmsg = ``;
				let headerMSG = `Your Order has been Out For Delivery`;
				let headerMSG1 = `<h3>Your order #${orderInfo[0].orderNumber} is out for delivery!</h3>
			    <p><strong>Tracking ID/URL: </strong><a href=${orderInfo[0].tracking_Url_Id} target="_blank"> ${orderInfo[0].tracking_Url_Id}<a/></p>
				<p><strong>Delivery Partner: </strong> ${orderInfo[0].deliveryPartner}</p>
			    <p><strong>Expected Delivery Date: </strong> ${expDeliveryDate}</p>
				<p><strong>Order Placed On: </strong> ${dateTime}</p>`;
				await emailActivity.Activity(
					userInfo[0].email,
					'Order out for delivery (#' + orderInfo[0].orderNumber + ')',
					headerMSG,
					headerMSG1,
					mailmsg
				);
			} else if (req.body.status == 4) {
				let mailmsg = ``;
				let headerMSG = `Your Order has been Delivered`;
				let headerMSG1 = `<h3>Your order #${orderInfo[0].orderNumber} is Delivered!</h3>
			    <p><strong>Tracking ID/URL: </strong><a href=${orderInfo[0].tracking_Url_Id} target="_blank"> ${orderInfo[0].tracking_Url_Id}<a/></p>
				<p><strong>Delivery Partner: </strong> ${orderInfo[0].deliveryPartner}</p>
				<p><strong>Order Placed On: </strong> ${dateTime}</p>`;
				await emailActivity.Activity(
					userInfo[0].email,
					'Order Delivered (#' + orderInfo[0].orderNumber + ')',
					headerMSG,
					headerMSG1,
					mailmsg
				);
			}
			return res.status(200).send({ success: true, msg: 'Success' })
		} else {
			return res.status(200).send({ success: false, msg: 'Unable to Update order Status, Please Try Again!' })
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.getCancelAndReturnList = async (req, res) => {
	try {
		let orderList = await orderModel.getCancelAndReturnList()
		if (orderList.length > 0) {
			return res.status(200).send({ success: true, msg: 'Cancel and return Order List', orderList })
		}
		return res.status(200).send(response(false, message.noDataMessage));

	} catch (error) {
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.getCancelAndReturnDetailById = async (req, res) => {
	try {
		let orderList = await orderModel.getCancelAndReturnDetailById(req.query.id)
		if (orderList.length > 0) {
			return res.status(200).send({ success: true, msg: 'Cancel and return Order List', orderList })
		}
		return res.status(200).send(response(false, message.noDataMessage));

	} catch (error) {
		return res.status(500).send(response(false, error.message));
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.updateCancelAndReturnStatus = async (req, res) => {
	try {
		let orderInfo = await orderModel.getOrderDetailById(req.body.id)
		if (orderInfo[0].paymentStatus == 0) {
			return res.status(200).send({ success: false, msg: 'Payment not completed yet!' })
		}
		let orderItemInfo = await orderModel.getOrderItemDetailById(req.body.id)		
		let userInfo = await orderModel.getUserDetailById(orderInfo[0].userId);

		let currency = orderInfo[0].currency;
		let msg = '';
		let refundedAmount = req.body.refundedAmount;
		let deductionDetail = req.body.deductionDetail
		if (req.body.status == 1) {
			if (!orderInfo[0].payment_intend_id) {
				return res.status(400).send({ success: false, msg: 'Payment intent is missing for the order!' });
			}

			const refund = await stripe.refunds.create({
				payment_intent: orderInfo[0].payment_intend_id,
				amount:  refundedAmount * 100,
				// amount: orderItemInfo[0].price * 100,
			});
			if (refund.status == "succeeded") {
				if (orderItemInfo[0].sizeId) {
					let productSizeInfo = await productModel.getProductSizeInfo(orderItemInfo[0].productId, orderItemInfo[0].sizeId)
					let reqData = {
						quantity: productSizeInfo[0].quantity + orderItemInfo[0].quantity
					}
					await productModel.updateProductQuantityOnSize(reqData, orderItemInfo[0].productId, orderItemInfo[0].sizeId)
				}
				let reqData = {
					productQuantity: orderItemInfo[0].productQuantity + orderItemInfo[0].quantity
				}
				await productModel.updateProductQuantity(reqData, orderItemInfo[0].productId);
				let mailmsg = ``;
				let headerMSG = `Refund Initiated successfully `;
				let headerMSG1 = `<h3>Your Return Request for Order #${orderInfo[0].orderNumber} is Approved and a refund has been initiated!</h3>
				<p> The Refund amount will be transferred to your same payment method within 5 to 10 business days!</p>
				<p><strong>Refund order details:</strong></p>
           <p><strong>Product Name: </strong> ${orderItemInfo[0].productName}</p>
           <p><strong>Amount: </strong> ${refundedAmount} ${currency}</p>
		   <p><strong>Deduction: </strong> ${deductionDetail}</p>

					 <p><strong>Your Reason: </strong> ${orderItemInfo[0].cancelAndReturn_reson}</p>`;
				await emailActivity.Activity(
					userInfo[0].email,
					'Refund Initiated Successfully (#' + orderInfo[0].orderNumber + ')',
					headerMSG,
					headerMSG1,
					mailmsg
				);
			}
			else {
				return res.status(200).send({ success: false, msg: 'Refund failed due to server error. Please try again!' })
			}
			msg = 'Refund request has been approved!';
		}
		else if (req.body.status == 2) {
			let mailmsg = ``;
			let headerMSG = `Refund Rejected`;
			let headerMSG1 = `<h3>Your Return Request for Order #${orderInfo[0].orderNumber} is Rejected!</h3>
				<p><strong>Refund reject order details:</strong></p>
           <p><strong>Product Name: </strong> ${orderItemInfo[0].productName}</p>
           <p><strong>Amount: </strong> ${refundedAmount} ${currency}</p>
					 <p><strong>Your Reason: </strong> ${orderItemInfo[0].cancelAndReturn_reson}</p>`;
			await emailActivity.Activity(
				userInfo[0].email,
				'Refund Rejected (#' + orderInfo[0].orderNumber + ')',
				headerMSG,
				headerMSG1,
				mailmsg
			);
			msg = 'Refund request has been rejected!';
		}
		else {
			return res.status(200).send({ success: false, msg: 'Invalid request. Please try again!' })
		}
		let updateStatus = await orderModel.updateCancelAndReturnStatus(req.body)
		if (updateStatus) {
			return res.status(200).send({ success: true, msg: msg })
		} else {
			return res.status(200).send({ success: false, msg: 'Unable to Update order cancel and return Status, Please Try Again!' })
		}
	} catch (error) {
		console.log(error.message)
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.updateOrderStatusToReject = async (req, res) => {
	try {
		let updateCancelReason = await orderModel.updateOrderStatusToReject(req.body)
		if (updateCancelReason) {
			return res.status(200).send({ success: true, msg: 'Success' })
		} else {
			return res.status(200).send({ success: false, msg: 'Unable to reject order, Please Try Again!' })
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.getOrderDetailsById = async (req, res) => {
	try {
		let orderId = req.query.orderId;
		let id = parseInt(orderId);
		let orderDetail = await orderModel.getOrderDetailsById(id)
		if (orderDetail.length > 0) {
			return res.status(200).send({ success: true, msg: 'Order detail', data: orderDetail });
		}
		return res.status(200).send(response(false, message.noDataMessage));

	} catch (error) {
		console.log(error);
		return res.status(500).send(response(false, error.message));
	}
}


exports.updateCancelReason = async (req, res) => {
	try {
		let updateCancelReason = await orderModel.updateCancelReason(req.body)
		if (updateCancelReason) {
			return res.status(200).send({ success: true, msg: 'Success' })
		} else {
			return res.status(200).send({ success: false, msg: 'Unable to update cancel reason, Please Try Again!' })
		}
	} catch (error) {
		console.log(error)
		return res.status(500).send(response(false, message.catchMessage));
	}
}

exports.cancelThisOrder = async (req, res) => {
	try {
	  let orderDetail = await orderModel.getOrderDetailByOrderId(req.body.orderId);
	  console.log(orderDetail)
	  let userInfo = await orderModel.getUserDetailById(orderDetail[0].userId)
	  console.log(userInfo)
	  
	  if (orderDetail) {
		let result = await orderModel.cancelThisOrder(req.body.orderItemId);
		 await orderModel.insertCancelReason(orderDetail[0].userId, req.body)
  
		if (result) {
		  let mailmsg = ``;
		  let headerMSG = `Order Cancelled`;
		  let headerMSG1 = `<h3>Your Order #${orderDetail[0].orderNumber} has been Cancelled</h3>`;
		  await emailActivity.Activity(
			userInfo[0].email,
			"Order #" + orderDetail[0].orderNumber + " Cancel Request Submitted!",
			headerMSG,
			headerMSG1,
			mailmsg
		  );
		  return res.status(200).send({ success: true, msg: 'Order cancel request submitted successfully!' });
		}
		else {
		  return res.status(200).send({ success: false, msg: 'Internal server error!' });
		}
	  }
	  else {
		return res.status(200).send(response(false, 'Invalid request!'));
	  }
	}
	catch (error) {
	  console.log(error)
	  return res.status(500).send(response(false, error.message));
	}
  }

  exports.getSupplierList = async(req, res)=>{
	try {
		let supplierList = await orderModel.getSupplierList()
		if (supplierList.length > 0) {
			return res.status(200).send({ success: true, msg: 'Supplier list', supplierList });
		}
		return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		return res.status(500).send(response(false, error.message));
	}
  }

  exports.getSupplierListById = async(req, res)=>{
	try {
		let supplierList = await orderModel.getSupplierListById(req.query.id)
		if (supplierList.length > 0) {
			return res.status(200).send({ success: true, msg: 'Supplier list', supplierList });
		}
		return res.status(200).send(response(false, message.noDataMessage));
	} catch (error) {
		return res.status(500).send(response(false, error.message));
	}
  }

  exports.updateSupplierDetail = async (req, res) => {
	try {
		let updateSupplier = await orderModel.updateSupplierDetail(req.body)
		if (updateSupplier) {
			return res.status(200).send({ success: true, msg: 'Success' })
		} else {
			return res.status(200).send({ success: false, msg: 'Unable to update supplier detail Please Try Again!' })
		}
	} catch (error) {
		console.log(error.message)
		return res.status(500).send(response(false, message.catchMessage));
	}
}



  
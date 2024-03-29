const { response, message } = require("../../utils/response");
const orderModel = require('../../Models/userModel/orderModel')

  let STRIPE_SECRET_KEY ="sk_test_51MduvlSB1sj4zObErME8aIeKwB6GEMWk9IABkCD67tdSf3eVKGMmCxLeSXcfhIXSyiQFL8qAy7pzNWIDkUfA776500VXQ1EHH8"
const emailActivity = require("./emailActivity.controller");
const stripe = require('stripe')(STRIPE_SECRET_KEY);

const puppeteer = require('puppeteer');
const moment = require('moment');

async function createPDF(orderId, userId) {
  let req = {
    user_id: userId,
    orderId: orderId
  }
  let orderDetail = await orderModel.getOrderDetailsById(req)


  // let supplierDetail = await orderModel.getSupplierList(); 
  let orderData = orderDetail[0];
  
  let addressDataArr = orderData.deliveryAddress.split(",");
  let address = addressDataArr[1] + "," + addressDataArr[2] + "," + addressDataArr[3] + "," + addressDataArr[4] + "," + addressDataArr[5] + "," + addressDataArr[6];
  let htmlContent = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>For You Invoice</title>
    </head>
  
    <body>
      <div style="padding: 10px">
        <table style="width: 100%">
          <tr style="width: 100%">
            <td style="width: 50%">
              <label style="font-size: 25px; font-weight: bold"
                >INV-`+ orderData.orderNumber + `</label
              >
            </td>
            <td style="width: 50%; text-align: right">
              <img
                style="max-width: 200px"
                src="https://foryou.itsparktechnology.com/assets/images/logo.svg"
              />
            </td>
          </tr>
        </table>
        <br />
        <table style="width: 100%; margin: 10px 0px">
          <tr style="width: 100%">
            <td style="width: 33%; line-height: 25px">
              <label>From</label><br />
              <label style="font-weight: bold; font-size: 20px">For You</label>
              <br />
              9th Avenue, San Francisco 99383<br />
              Location is here<br />
             
            </td>
            <td style="width: 33%; line-height: 25px">
              <label>To</label><br />
              <label style="font-weight: bold; font-size: 20px"
                >`+ addressDataArr[0] + `</label
              ><br />
              `+ address + `<br />
              
            </td>
            <td style="width: 33%; margin: auto">
              <span
                style="
                  background: #e1e1e1;
                  font-size: 30px;
                  font-weight: bold;
                  padding: 10px;
                  color: green;
                  float:right
                "
              >
                `+ (orderData.paymentStatus == 0 ? 'PENDING' : orderData.paymentStatus == 1 ? 'PAID' : orderData.paymentStatus == 2 ? 'Cancelled' :orderData.paymentStatus == 3 ? 'COD' : '-') + `</span
              >
            </td>
          </tr>
        </table>
        <br />
        <table style="width: 100%;">
          <tr style="background-color: #343a40 !important; color: white">
            <th style="width: 35%; padding:8px">Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
          `;
  let subTotal = 0;
  let deliveryAmount = orderData.deliveryAmount;
  orderData?.orderItems?.map((item) => {
    let itemTotal = Math.trunc(item.price * item.quantity);
    htmlContent += `<tr style="padding: 10px;">
            <td  style="padding: 10px;">`+ item.itemName + ` ` + (item.size ? '(' + item.size + ')' : "") + `</td>
            <td>`+ item.price + ' ' + item.currency + `</td>
            <td>`+ item.quantity + `</td>
            <td>`+ itemTotal + ' ' + item.currency + `</td>
          </tr>`;
    subTotal = parseInt(subTotal) + parseInt(itemTotal);
  })

  let promoCodeAmount = 0;
  let taxAmount = 0;
  if (orderData.promoCodeDiscount || orderData.promoCodeDiscount > 0) {
    promoCodeAmount = Math.trunc((subTotal * orderData.promoCodeDiscount) / 100);
  }
  if (orderData.tax_per || orderData.tax_per > 0) {
    taxAmount = Math.trunc((subTotal * orderData.tax_per) / 100);
  }
  let totalAmount = (parseInt(subTotal) + parseInt(deliveryAmount) + parseInt(taxAmount)) - promoCodeAmount;

  htmlContent += `</table>
        <br>
        <hr />
        <br>
        <table style="width: 100%; position: fixed;">
          <tr style="width: 100%">
            <td style="width: 50%"></td>
            <td style="width: 25%; padding: 5px;">Sub Total : </td>
            <td style="width: 20%">`+ subTotal + ' ' + orderData.currency + `</td>
            <td style="width: 5%"></td>
          </tr>
          <tr style="width: 100%">
            <td style="width: 50%"></td>
            <td style="width: 25%; padding: 5px;">Delivery Charge : </td>
            <td style="width: 20%">`+ deliveryAmount + ' ' + orderData.currency + `</td>
            <td style="width: 5%"></td>
          </tr>
          <tr style="width: 100%">
            <td style="width: 50%"></td>
            <td style="width: 25%; padding: 5px;">Tax(`+ orderData.tax_per + `%) : </td>
            <td style="width: 20%">`+ taxAmount + ' ' + orderData.currency + `</td>
            <td style="width: 5%"></td>
          </tr>
          <tr style="width: 100%">
            <td style="width: 50%"></td>
            <td style="width: 25%; padding: 5px;">Discount `+ (orderData.promoCodeDiscount ? '(' + orderData.promoCodeDiscount + '%)' : '') + ` : </td>
            <td style="width: 20%">`+ promoCodeAmount + ' ' + orderData.currency + `</td>
            <td style="width: 5%"></td>
          </tr>
          <tr style="width: 100%; color: green;">
            <td style="width: 50%"></td>
            <td style="width: 25%; padding: 5px;">Total : </td>
            <td style="width: 20%">`+ totalAmount + ' ' + orderData.currency + `</td>
            <td style="width: 5%"></td>
          </tr>
        </table>
      </div>
    </body>
  </html>
  `;
  generatePDFfromHTML(htmlContent, './public/invoices/' + orderData.orderNumber + '.pdf')

    .then(async () => {
      console.log('PDF generated successfully');
      let attechment = {
        fileName: orderData.orderNumber + '.pdf',
        filePath: './public/invoices/' + orderData.orderNumber + '.pdf'
      }

      let mailmsg = ``;
      let headerMSG = `Order Placed`;
      let headerMSG1 = `
             <h3>Your Order #${orderData.orderNumber} Placed Successfully!</h3>
             <p>Please find order invoice in attechment!</p>`;
      let mail = await emailActivity.Activity(
        orderData.email,
        "Order #" + orderData.orderNumber + " Placed!",
        headerMSG,
        headerMSG1,
        mailmsg,
        attechment
      );
    })
    .catch(err => console.error('Error generating PDF:', err));
}

async function generatePDFfromHTML(htmlContent, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: outputPath, format: 'A4' });
  await browser.close();
}


// Payment intend
exports.paymentIntent = async (req, res) => {
  try {
    let amt = req.body.amount;
    let currency = req.body.currency.toLowerCase();
   
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amt * 100,
      currency: currency,
      // payment_method: 'pm_card_visa',
      description: 'For your   order payment',
      shipping: {
        name: 'Jenny Rosen',
        address: {
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        },
      },
    });
    let client_secret = Buffer.from(paymentIntent.client_secret).toString('base64');

    return res.status(200).send({
      success: true,
      msg: "Payment Intented!",
      secret: client_secret,
    });
  } catch (err) {
    return res.status(200).send({
      success: false,
      msg: "Error occured! Please try again!",
      error: err,
    });
  }
};

//---------------------------|| INSERT ORDER ||------------------------------------

exports.insertOrderDetail = async (req, res) => {
  try {
    let data = req.body;
    let orderNumber = Date.now().toString() + Math.floor(Math.random() * 90 + 10)
    let reqData = {
      totalAmount: req.body.totalAmount,
      deliveryAmount: req.body.deliveryAmount,
      finalPayableAmount: req.body.finalPayableAmount,
      promoCode: req.body.promoCode,
      deliveryAddress: req.body.deliveryAddress,
      // deliveryAddressId: req.body.deliveryAddressId,
      billingAddress: req.body.billingAddress,
      // billingAddressId: req.body.billingAddressId,
      paymentMethod: req.body.paymentMethod,
      promoCodeDiscount: req.body.promoCodeDiscount,
      orderNumber: orderNumber,
      userId: req.userId,
      currency: req.body.currency,
      tax_per: req.body.tax_per
    }
    const insertOrder = await orderModel.insertOrderDetail(reqData);

    const orderId = insertOrder.insertId;
    if (insertOrder) {
      const item = data.items
      for (let i = 0; i < item.length; i++) {
        for (let j = 0; j < item[i].quantity; j++) {
          let singleItem = {
            orderId: orderId,
            productId: item[i].id,
            sizeId: item[i].selectedSizeId,
            price: item[i].buyPrice,
            quantity: 1,
          }

          const insertOrderItems = await orderModel.insertOrderItem(singleItem);
          if (insertOrderItems) {
            await orderModel.updateQuantityFromProductsTable(singleItem.productId);
            if (singleItem.sizeId && singleItem.sizeId != "") {
              await orderModel.updateQuantityFromProductSizeTable(singleItem.productId, singleItem.sizeId);
            }
            // let getProducts = await orderModel.getProductById(singleItem.productId);
            // let getSizeById = await orderModel.getSizeById(singleItem.sizeId, singleItem.productId);
            // if (getProducts.length > 0) {
            //   if (getProducts[0].isSizeAvailable == 1) {
            //     await orderModel.updateQuantityFromProductsTable(getProducts[0].productQuantity - item[i].quantity, item[i].id); // update product size from product table if isSizeAvailable = 1 then it update quantity from productSizes table
            //     if (getSizeById.length > 0) {
            //       await orderModel.updateQuantityFromProductSizeTable(getSizeById[0].quantity - item[i].quantity, item[i].id, item[i].selectedSizeId);
            //     }
            //   } else {
            //     await orderModel.updateQuantityFromProductsTable(getProducts[0].productQuantity - item[i].quantity, item[i].id);  // update product size from product table if isSizeAvailable = 0
            //   }
            // }
          }
        }
      }
      return res.status(200).send({ success: true, msg: 'Order Placed Successfully', orderNumber, orderId });
    } else {
      return res.status(200).send({ success: false, msg: 'Unable to Place Order. Please Try Again!' });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send(response(false, error.message));
  }
};




exports.updateOrderCodStatus = async (req, res) => {
  try {

    let result = await orderModel.updateOrderCodStatus(req.body)
    if (result) {
      createPDF(req.body.orderId, req.userId);
      await orderModel.clearCartItems(req.userId);
      return res.status(200).send({ success: true, msg: 'Order placed successfully!' });
    }
    return res.status(200).send(response(false, 'Internal server error!'));
  } catch (error) {
    return res.status(200).send(response(false, error.message));
  }
}

exports.updateOrderPaymentStatus = async (req, res) => {
  try {
    let result = await orderModel.updateOrderPaymentStatus(req.body)
    if (result) {
      
      createPDF(req.body.orderId, req.userId);
      await orderModel.clearCartItems(req.userId);
      return res.status(200).send({ success: true, msg: 'Order placed successfully!' });
    }
    return res.status(200).send(response(false, 'Internal server error!'));
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}

exports.cancelAndRemoveOrder = async (req, res) => {
  try {
    let result = await orderModel.cancelAndRemoveOrder(req.body)
    if (result) {
      return res.status(200).send({ success: true, msg: 'Order removed !' });
    }
    return res.status(200).send(response(false, 'Internal server error!'));
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}


//---------------------------|| CHECK PROMOCODE ||------------------------------------

exports.checkPromocode = async (req, res) => {
  try {
    let data = req.body;
    let promocodeALreadyUse = await orderModel.checkUsedPromocode(data.promocode, req.userId);
    if (promocodeALreadyUse.length > 0) {
      return res.status(200).send({ success: false, msg: 'Promocode Already Used' });
    }
    let checkPromocode = await orderModel.checkPromocode(data.promocode);
    if (checkPromocode.length > 0) {

      const currentDate = new Date();
      const validFrom = new Date(checkPromocode[0].validFrom);
      const validTo = new Date(checkPromocode[0].validTo);
      currentDate.setHours(0, 0, 0, 0);
      validFrom.setHours(0, 0, 0, 0);
      validTo.setHours(0, 0, 0, 0);
    
      if (currentDate >= validFrom && currentDate <= validTo) {
        return res.status(200).send({ success: true, msg: 'Promocode Applied Successfully', discount: checkPromocode[0].discount });
      } else {
        return res.status(200).send({ success: false, msg: 'Promocode expired' });
      }
    } else {
      return res.status(200).send({ success: false, msg: 'Invalid Promocode!' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(response(false, error.message));
  }
}





exports.AllPromocode = async (req, res) => {
  try {
   

    let checkPromocode = await orderModel.getPromocode(req.userId);

    if (checkPromocode.length > 0) {

        return res.status(200).send({ success: true, msg: 'Promocode featch Successfully', promocode:checkPromocode});
      } else {
        return res.status(200).send({ success: false, msg: ' No Promocode ' });
      }
    
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}
//---------------------------|| CHECK PRODUCT QUANTITY ||------------------------------------

exports.checkProductQuantity = async (req, res) => {
  try {
    let data = req.body;
    if (data.productSizeId == '' || data.productSizeId == null) {
      let checkQuantity = await orderModel.checkProductQuantity(data)

      if (checkQuantity[0].productQuantity < data.quantity) {
        return res.status(200).send({ success: false, msg: `Qunatity check1`, availableQty: checkQuantity[0].productQuantity });
      } else {
        return res.status(200).send({ success: true, msg: `Quantity check2`, availableQty: checkQuantity[0].productQuantity });
      }
    } else {
      let checkSizeQuantity = await orderModel.checkProductSizeQuantity(data);
      if (checkSizeQuantity.length > 0 && checkSizeQuantity[0]?.quantity < data.quantity) {
        return res.status(200).send({ success: false, msg: `Qunatity check3`, availableQty: checkSizeQuantity[0].quantity });
      } else {
        return res.status(200).send({ success: true, msg: `Qunatity check4`, availableQty: checkSizeQuantity[0].quantity });
      }
    }
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}

//---------------------------|| ORDER LIST BY USER ID ||------------------------------------

exports.getOrderListByUserId = async (req, res) => {
  try {
    let orderDetail = await orderModel.getOrderListByUserId(req.userId)
    if (orderDetail.length > 0) {
      return res.status(200).send({ success: true, msg: 'User Order List', orderDetail });
    }
    return res.status(200).send(response(false, message.noDataMessage));

  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}


exports.cancelThisOrder = async (req, res) => {
  try {
    req.body.user_id = req.userId;
    let orderDetail = await orderModel.getOrderDetailById(req.body);
    if (orderDetail) {

      let result = await orderModel.cancelThisOrder(req.body.orderItemId);
      await orderModel.insertCancelReason(req.userId, req.body)

      if (result) {
        let mailmsg = ``;
        let headerMSG = `Order Cancelled`;
        let headerMSG1 = `<h3>Your Order #${orderDetail[0].orderNumber} Cancel Request Submitted Successfully!</h3>`;
        await emailActivity.Activity(
          orderDetail[0].email,
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

exports.returnThisOrder = async (req, res) => {
  try {
    req.body.user_id = req.userId;
    let orderDetail = await orderModel.getOrderDetailById(req.body);
    if (orderDetail) {
      let result = await orderModel.returnThisOrder(req.body.orderItemId);
      await orderModel.insertReturnReason(req.userId, req.body)

      if (result) {
        let mailmsg = ``;
        let headerMSG = `Order Returned`;
        let headerMSG1 = `<h3>Your Order #${orderDetail[0].orderNumber} Return Request Submitted Successfully!</h3>`;
        await emailActivity.Activity(
          orderDetail[0].email,
          "Order #" + orderDetail[0].orderNumber + " Return Request Submitted!",
          headerMSG,
          headerMSG1,
          mailmsg
        );
        return res.status(200).send({ success: true, msg: 'Order return request submitted successfully!' });
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

exports.getOrderDetailsById = async (req, res) => {
  try {
    req.body.user_id = req.userId;
    let orderDetail = await orderModel.getOrderDetailsById(req.body)
    if (orderDetail.length > 0) {
      return res.status(200).send({ success: true, msg: 'Order detail', data: orderDetail[0] });
    }
    return res.status(200).send(response(false, message.noDataMessage));

  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}

exports.getDeliveryChargesAndTaxes = async (req, res) => {
  try {
    let deliveryAndTax = await orderModel.getDeliveryChargesAndTaxes(req.query.regionName)
    if (deliveryAndTax.length > 0) {
      return res.status(200).send({ success: true, msg: 'Order detail', data: deliveryAndTax });
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}

exports.getCancelAndReturnOrderByItemId = async (req, res) => {
  try {
    let cancelAndReturn = await orderModel.getCancelAndReturnOrderByItemId(req.userId, req.query.orderItemId)
    if (cancelAndReturn.length > 0) {
      return res.status(200).send({ success: true, msg: 'Order Detail', data: cancelAndReturn[0] });
    }
    return res.status(200).send(response(false, message.noDataMessage));
  } catch (error) {
    return res.status(500).send(response(false, error.message));
  }
}

exports.getSupplierList = async (req, res) => {
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


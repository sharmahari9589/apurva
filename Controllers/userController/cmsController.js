const { response, message } = require("../../utils/response");
const cmsModel = require('../../Models/userModel/cmsModel')

exports.getCMSContentByRoute = async(req, res) =>{
    try {
        let getCMS = await cmsModel.getCMSContentByRoute(req.query.route)
        if (getCMS.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", getCMS});
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.getCMSPages = async(req, res) =>{
    try {
        let getCMS = await cmsModel.getCMSPages()
        if (getCMS.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", getCMS});
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.insertContactUs = async (req, res) => {
    try {
        let insertContactUs = await cmsModel.insertContactUs(req.body)
        if (insertContactUs) {
            return res.status(200).send(response(true, "Success"));
        } else {
            return res.status(200).send(response(true, "Unable to add contact us details"));
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send(response(false, message.catchMessage));
    }
}
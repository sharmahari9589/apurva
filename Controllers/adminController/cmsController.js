const { response, message } = require("../../utils/response");
const cmsModel = require('../../Models/adminModel/cmsModel')

exports.insertCMSPages = async (req, res) => {
    try {
        let name = req.body.name
        route = name.toLowerCase().split(' ').join('').trim()
        let insertCMS = await cmsModel.insertCMSPages(req.body, route)
        if (insertCMS) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to add CMS pages" })
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateCMSPages = async (req, res) => {
    try {
        let name = req.body.name
        route = name.toLowerCase().split(' ').join('').trim()
        let updateCms = await cmsModel.updateCMSPages(req.body, route)
        if (updateCms) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to update CMS pages! Please try again" })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updatePagesStatus = async (req, res) => {
    try {
        let updatePagesStatus = await cmsModel.updatePagesStatus(req.body)
        if (updatePagesStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Page Status" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}


exports.getCMSPages = async (req, res) => {
    try {
        let getCMS = await cmsModel.getCMSPages()
        if (getCMS.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: getCMS });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.insertCMSContent = async (req, res) => {
    try {
        let insertCMSContent = await cmsModel.insertCMSContent(req.body)
        if (insertCMSContent) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to add CMS pages" })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.getCMSContentById = async (req, res) => {
    try {
        let getCMS = await cmsModel.getCMSContentById()
        if (getCMS.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: getCMS });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateCMSContent = async (req, res) => {
    try {
        let updateCMSContent = await cmsModel.updateCMSContent(req.body)
        if (updateCMSContent) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to update CMS pages! Please try again " })
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}


exports.getContactUsList = async (req, res) => {
    try {
        let contactList = await cmsModel.getContactUsList()
        if (contactList.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: contactList });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.getContactUsDetailById = async (req, res) => {
    try {
        let contactList = await cmsModel.getContactUsDetailById(req.query.id)
        if (contactList.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: contactList });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.getFeedbackList = async (req, res) => {
    try {
        let feedbackList = await cmsModel.getFeedbackList()
        if (feedbackList.length > 0) {
            return res.status(200).send({ success: true, msg: "Success", data: feedbackList });
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.deleteFeedBack = async (req, res) => {
    try {
        let updateRegionStatus = await cmsModel.deleteFeedback(req.body.id)
        if (updateRegionStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Product Status" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.updateFeedBack = async (req, res) => {
    try {
        let updateRegionStatus = await cmsModel.updateFeedback(req.body)
        if (updateRegionStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Product Status" })
        }
    } catch (error) {
        console.log(error);
         return res.status(500).send(response(false, message.catchMessage));
    }
}


exports.updateFeedBackStatus = async (req, res) => {
    try {
        let updateRegionStatus = await cmsModel.updateFeedStatus(req.body)
        if (updateRegionStatus) {
            return res.status(200).send({ success: true, msg: "Success" });
        } else {
            return res.status(200).send({ success: false, msg: "Unable to Update Product Status" })
        }
    } catch (error) {
         return res.status(500).send(response(false, message.catchMessage));
    }
}


exports.insertFeedback = async (req, res) => {
    try {
      const data = req.body;

      const bodyData = {
        userId: req.body.userId,
        feedback: data.feedback,
        rating: data.rating,
        productId: data.productId,
        status: 0,
        feedbackImage: req?.files[0]?.filename,
      };
  
      let insertFeedback = await cmsModel.insertFeedback( bodyData);
      if (insertFeedback) {
        res
          .status(200)
          .send({ success: true, msg: "Feedback Added Successfully!" });
      } else {
        return res
          .status(200)
          .send(response(false, "Something! Went Wrong Please Try Again"));
      }
    } catch (error) {
        console.log(error);
      return res.status(500).send(response(false, message.catchMessage));
    }
  };
  
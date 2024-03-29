const path = require('path')
exports.getImage = async (req, res) => {
    const image = req.params.image;
    const myPath = path.resolve(process.cwd(), "public", image);
    res.sendFile(myPath);
}

exports.getFlagImage = async (req, res) => {
    const image = req.params.image;
    const myPath = path.resolve(process.cwd(), "public/flag", image);
    res.sendFile(myPath);
}

exports.getBannerVideo = async (req, res) => {
    const file = req.params.video;
    const myPath = path.resolve(process.cwd(), "public/bannerVideo", file);
    res.sendFile(myPath);
}
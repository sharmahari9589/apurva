const { checkIsSizeAvailable } = require("../../Models/adminModel/productModel");
const productModel = require("../../Models/userModel/productModel");
const { response, message } = require("../../utils/response");

exports.getProductList = async (req, res) => {
    try {
        let subCategoryData = await productModel.getProductList(req.query.categoryId);
        if (subCategoryData.length > 0 ) {
            // for (let i = 0; i < subCategoryData.length; i++) {
            //     let productData = await productModel.rs(subCategoryData[i].id);
            //     subCategoryData[i].items = productData;
            // }

            return res.status(200).send(response(true, "Product List", subCategoryData));
        }
        else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(500).send(response(false, error.message));
    }
}





exports.getInnerProductList = async (req, res) => {
    try {

        let subCategoryData = await productModel.getAllProductcategory(req.body.id);

        if (subCategoryData.length > 0 ) {
            return res.status(200).send(response(true, "Product List", subCategoryData));
        }
        else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(500).send(response(false, error.message));
    }
}






exports.getSerachProductList = async (req, res) => {
    try {

        let subCategoryData = await productModel.getAllSearchcategory(req.body.id);

        if (subCategoryData.length > 0 ) {
            return res.status(200).send(response(true, "Product List", subCategoryData));
        }
        else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(200).send(response(false, error.message));
    }
}







exports.getPopularProducts = async (req, res) => {
    try {

        let popularProducts = await productModel.getAllPopularProducts();

        if (popularProducts.length > 0 ) {
            return res.status(200).send(response(true, "Popular Product List", popularProducts));
        }
        else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(200).send(response(false, error.message));
    }
}


exports.getDealProducts = async (req, res) => {

    try {

        let popularProducts = await productModel.getAllDealProducts();

        if (popularProducts.length > 0 ) {
            return res.status(200).send(response(true, "deal Product List", popularProducts));
        }
        else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(200).send(response(false, error.message));
    }
}










exports.fatchAllProductData = async (req, res) => {
    try {
        let productList = await productModel.getProductListByCategoryId(req.body.categoryId)
        if (productList.length > 0) {

            return res.status(200).send(response(true, "Product List", productList));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        console.log(error)
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.getProductDetailById = async (req, res) => {
    try {
        let productDetail = await productModel.getProductDetailById(req.body.productId)
       
        if (productDetail.length > 0) {
            return res.status(200).send(response(true, "Product List", productDetail));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        console.log(error)
        return res.status(500).send(response(false, message.catchMessage));
    }
}

exports.getItemCombination = async (req, res) => {
    try {
        let categoryId = req.body.categoryId;
        let itemCombination = await productModel.getItemCombitnation(categoryId);
        if (itemCombination.length > 0) {

            for (let i = 0; i < itemCombination.length; i++) {
                let productIds = itemCombination[i].productId;
                for (let j = 0; j < productIds.length; j++) {
                    let productData = await productModel.getPrductInfoForCombination(productIds[j].id);
                    itemCombination[i].productId[j] = productData[0];
                }
            }
            return res.status(200).send(response(true, "Item Combination List", itemCombination));
        } else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(response(false, message.catchMessage));
    }
};

exports.searchProductList = async (req, res) => {
    try {
        let {keyword} = req.body
        let searchKeyWords = await productModel.searchProductList(keyword)
        if(searchKeyWords.length > 0){
            return res.status(200).send(response(true, "Product List", searchKeyWords));
        }else{
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(200).send(response(false, error.message));
    }
}

exports.getProductFinalProductList = async (req, res) => {
    try {
        let felterData = await productModel.getProductList(req.query)
        if (felterData.length > 0) {

            return res.status(200).send(response(true, "Product List", felterData));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        return res.status(500).send(response(false, error.message));
    }
}

exports.getAllProductListForHome = async (req, res) => {
    try {
        let subCategoryData = await productModel.getSubcategoryForHome();
        if (subCategoryData.length > 0 ) {
            for (let i = 0; i < subCategoryData.length; i++) {
                let productData = await productModel.getProductBySubCategory(subCategoryData[i].id);
                subCategoryData[i].items = productData;
            }

            return res.status(200).send(response(true, "Product List", subCategoryData));
        }
        else {
            return res.status(200).send(response(false, message.noDataMessage));
        }
    } catch (error) {
        return res.status(500).send(response(false, error.message));
    }
}

exports.getProductByColor = async (req, res) => {
    try {
        let products = await productModel.getProductByColor(req.query)
        if (products.length > 0) {
            return res.status(200).send(response(true, "Product List", products));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        return res.status(500).send(response(false, error.message));
    }
}

// Filter Product

exports.filterProducts = async (req,res) => {
    try{
        let productsList = await productModel.filterProducts(req.body);
        return res.status(200).send(response(true, "Product List", productsList ? productsList : []));
    }
    catch(error){
        return res.status(500).send(response(false, 'Internal server error!'));
    }
}

exports.getColorsList = async (req,res) => {
    try{
        let colorsList = await productModel.getColorsList(req.body);
        return res.status(200).send(response(true, "Colors List", colorsList ? colorsList : []));
    }
    catch(error){
        console.log(error.message)
        return res.status(500).send(response(false, 'Internal server error!'));
    }
}

//----------------------|| APPLICATION API||--------------------------

exports.getProductsBySubcategoryId = async (req, res) =>{
    try {
        let products = await productModel.getProductsBySubcategoryId(req.query.subCategoryId)
        if (products.length > 0) {
            return res.status(200).send(response(true, "Product List", products));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(response(false, 'Internal server error!'));
    }
}

exports.getProductListTask = async (req, res) => {
    try {
        let productList = await productModel.getProductListTask()
        if (productList.length > 0) {

            return res.status(200).send(response(true, "Product List", productList));
        }
        return res.status(200).send(response(false, message.noDataMessage));
    } catch (error) {
        console.log(error)
        return res.status(500).send(response(false, message.catchMessage));
    }
}


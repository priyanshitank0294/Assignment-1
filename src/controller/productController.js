const productService = require("../service/productService");

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProductService(req.body);

        res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

module.exports = { createProduct };
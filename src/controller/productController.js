const mongoose = require("mongoose");
const productService = require("../service/productService");

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProductService({
            ...req.body,
    owner: req.user._id
        })
 
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

const getProduct = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = "ASC" } = req.query;

        const allProduct = await productService.getProductService({
            page,
            limit,
            sort
        });

        res.status(200).json({
            products: allProduct
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: err.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid product id"
            });
        }

        const singleProduct = await productService.getProductServiceId(id);

        if (!singleProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(singleProduct);
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: err.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid product id"
            });
        }

        const updatedProduct = await productService.updateProductService(
            id,
            req.body
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    createProduct,
    getProduct,
    getProductById,
    updateProduct
};
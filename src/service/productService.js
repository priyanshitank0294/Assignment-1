const ProductModel = require("../model/productModel");

const createProductService = async (data) => {
    const { name, SKU, description, price, category } = data;

    const existProduct = await ProductModel.findOne({ SKU });

    if (existProduct) {
        throw new Error("Product already exists");
    }

    const newProduct = await ProductModel.create({
        name,
        SKU,
        description,
        price,
        category
    });

    return newProduct;
};

module.exports = { createProductService };
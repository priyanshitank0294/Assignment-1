const ProductModel = require("../model/productModel");

const createProductService = async (data) => {
    const { owner,name, SKU, description, price, category } = data;

    const existProduct = await ProductModel.findOne({ SKU });

    if (existProduct) {
        throw new Error("Product already exists");
    }

    const newProduct = await ProductModel.create({
        owner,
        name,
        SKU,
        description,
        price,
        category
    });

    return newProduct;
};

const getProductService = async (data) => {
    const { page = 1, limit = 10, sort = "ASC" } = data;

    const allProduct = await ProductModel.find({})
        .skip((Number(page) - 1) * Number(limit))
        .select("-description")
        .limit(Number(limit))
        .sort({ price: sort === "DESC" ? -1 : 1 });

    return allProduct;
};

const getProductServiceId = async (id) => {
    const singleProduct = await ProductModel.findById(id);

    if (!singleProduct) {
        return null;
    }

    return singleProduct;
};

const updateProductService = async (id, data) => {
    const productExist = await ProductModel.findById(id);

    if (!productExist) {
        return null;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );

    return updatedProduct;
};

module.exports = {
    createProductService,
    getProductService,
    getProductServiceId,
    updateProductService
};
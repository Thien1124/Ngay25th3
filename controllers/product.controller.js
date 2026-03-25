const slugify = require('slugify');
let productModel = require('../schemas/product.model')
let inventoryModel = require('../schemas/inventory.model')

module.exports = {
    CreateProductWithInventory: async function (req, res, next) {
        let newProduct = new productModel({
            title: req.body.title,
            slug: slugify(req.body.title, {
                replacement: '-',
                remove: undefined,
                lower: true
            }),
            price: req.body.price,
            description: req.body.description,
            images: req.body.images,
            category: req.body.category
        })

        await newProduct.save();

        await inventoryModel.create({
            product: newProduct._id,
            stock: 0,
            reserved: 0,
            soldCount: 0
        })

        res.send(newProduct)
    }
}

let inventoryModel = require('../schemas/inventory.model')

function parseQuantity(value) {
    let quantity = Number(value)
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return null
    }
    return quantity
}

module.exports = {
    GetAll: async function (req, res, next) {
        let result = await inventoryModel.find().populate({
            path: 'product'
        })
        res.send(result)
    },

    GetById: async function (req, res, next) {
        try {
            let id = req.params.id;
            let result = await inventoryModel.findById(id).populate({
                path: 'product'
            })
            if (!result) {
                return res.status(404).send({
                    message: "ID NOT FOUND"
                });
            }
            res.send(result)
        } catch (error) {
            res.status(404).send({
                message: "ID NOT FOUND"
            });
        }
    },

    AddStock: async function (req, res, next) {
        try {
            let product = req.body.product
            let quantity = parseQuantity(req.body.quantity)

            if (!product || !quantity) {
                return res.status(400).send({ message: 'Invalid product or quantity' })
            }

            let result = await inventoryModel.findOneAndUpdate(
                { product: product },
                { $inc: { stock: quantity } },
                { new: true }
            ).populate({ path: 'product' })

            if (!result) {
                return res.status(404).send({ message: 'Inventory not found for product' })
            }

            res.send(result)
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    },

    RemoveStock: async function (req, res, next) {
        try {
            let product = req.body.product
            let quantity = parseQuantity(req.body.quantity)

            if (!product || !quantity) {
                return res.status(400).send({ message: 'Invalid product or quantity' })
            }

            let result = await inventoryModel.findOne({ product: product })
            if (!result) {
                return res.status(404).send({ message: 'Inventory not found for product' })
            }

            if (result.stock < quantity) {
                return res.status(400).send({ message: 'Insufficient stock' })
            }

            result.stock -= quantity
            await result.save()
            await result.populate({ path: 'product' })

            res.send(result)
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    },

    Reservation: async function (req, res, next) {
        try {
            let product = req.body.product
            let quantity = parseQuantity(req.body.quantity)

            if (!product || !quantity) {
                return res.status(400).send({ message: 'Invalid product or quantity' })
            }

            let result = await inventoryModel.findOne({ product: product })
            if (!result) {
                return res.status(404).send({ message: 'Inventory not found for product' })
            }

            if (result.stock < quantity) {
                return res.status(400).send({ message: 'Insufficient stock for reservation' })
            }

            result.stock -= quantity
            result.reserved += quantity
            await result.save()
            await result.populate({ path: 'product' })

            res.send(result)
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    },

    Sold: async function (req, res, next) {
        try {
            let product = req.body.product
            let quantity = parseQuantity(req.body.quantity)

            if (!product || !quantity) {
                return res.status(400).send({ message: 'Invalid product or quantity' })
            }

            let result = await inventoryModel.findOne({ product: product })
            if (!result) {
                return res.status(404).send({ message: 'Inventory not found for product' })
            }

            if (result.reserved < quantity) {
                return res.status(400).send({ message: 'Insufficient reserved quantity' })
            }

            result.reserved -= quantity
            result.soldCount += quantity
            await result.save()
            await result.populate({ path: 'product' })

            res.send(result)
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    }
}

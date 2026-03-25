var express = require('express');
var router = express.Router();
let inventoryController = require('../controllers/inventory.controller')

router.get('/', inventoryController.GetAll)
router.get('/:id', inventoryController.GetById)
router.post('/add-stock', inventoryController.AddStock)
router.post('/remove-stock', inventoryController.RemoveStock)
router.post('/reservation', inventoryController.Reservation)
router.post('/sold', inventoryController.Sold)

module.exports = router;

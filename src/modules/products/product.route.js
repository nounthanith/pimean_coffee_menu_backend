const { Router } = require("express")
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("./product.controller")
const router = Router()

router.post('/', createProduct)
router.get('/', getProducts)
router.get('/:id', getProductById)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router
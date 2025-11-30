const { Router } = require("express")
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("./product.controller")
const { uploadSingleImage, handleUploadError } = require("../../middlewares/upload")
const { verifyToken } = require("../../middlewares/auth")
const router = Router()

router.post('/', verifyToken, uploadSingleImage, handleUploadError, createProduct)
router.get('/', getProducts)
router.get('/category/:categoryId', getProducts)
router.get('/:id', getProductById)
router.put('/:id', verifyToken, uploadSingleImage, handleUploadError, updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router
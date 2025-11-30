const { Router } = require("express")
const { getCategories, createCategory, updateCategory, deleteCategory } = require("./category.controller")
const { verifyToken } = require("../../middlewares/auth")
const router = Router()

router.get('/', getCategories)
router.post('/', verifyToken, createCategory)
router.put('/:id', updateCategory)
router.delete('/', deleteCategory)

module.exports = router
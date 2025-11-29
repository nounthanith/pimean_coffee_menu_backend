const { Router } = require("express")
const { getCategories, createCategory, updateCategory, deleteCategory } = require("./category.controller")
const router = Router()

router.get('/', getCategories)
router.post('/', createCategory)
router.put('/', updateCategory)
router.delete('/', deleteCategory)

module.exports = router
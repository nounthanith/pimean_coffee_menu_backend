const { asyncHandler } = require("../../middlewares/errorHandler")
const Product = require("./product.model")

exports.createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, isActive } = req.body
    const image = req.file ? `uploads/${req.file.filename}` : req.body?.image

    if (!name || !description || !price || !category) {
        return res.status(400).json({ success: false, message: "name, description, price and category are required" })
    }
    if (!image) {
        return res.status(400).json({ success: false, message: "image is required" })
    }

    const isActiveParsed = (isActive === undefined || isActive === null || isActive === '')
        ? true
        : (isActive === true || isActive === 'true')

    const product = await Product.create({
        name,
        description,
        price,
        category,
        isActive: isActiveParsed,
        image,
    })

    return res.status(201).json({ success: true, data: product })
})

exports.getProducts = asyncHandler(async (req, res) => {
    const { category, isActive, search } = req.query
    const { categoryId } = req.params || {}
    const filter = {}
    const cat = categoryId || category
    if (cat) filter.category = cat
    if (typeof isActive !== 'undefined') filter.isActive = isActive === 'true' || isActive === true
    if (search) filter.name = { $regex: search, $options: 'i' }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
        Product.find(filter).populate('category').skip(skip).limit(limit),
        Product.countDocuments(filter)
    ])

    return res.status(200).json({
        success: true,
        data: products,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    })
})

exports.getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id).populate('category')
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" })
    }
    return res.status(200).json({ success: true, data: product })
})

exports.updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    const updates = { ...req.body }
    if (req.file?.filename) {
        updates.image = `uploads/${req.file.filename}`
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'isActive')) {
        const v = updates.isActive
        updates.isActive = (v === true || v === 'true')
    }

    // Avoid casting errors when category is an empty string
    if (Object.prototype.hasOwnProperty.call(updates, 'category')) {
        if (updates.category === '' || updates.category === null || updates.category === undefined) {
            delete updates.category
        }
    }

    // Coerce price if present
    if (Object.prototype.hasOwnProperty.call(updates, 'price')) {
        const n = Number(updates.price)
        if (!Number.isNaN(n)) updates.price = n
    }

    const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" })
    }
    return res.status(200).json({ success: true, data: product })
})

exports.deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    const product = await Product.findByIdAndDelete(id)
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" })
    }
    return res.status(200).json({ success: true, message: "Product deleted successfully" })
})
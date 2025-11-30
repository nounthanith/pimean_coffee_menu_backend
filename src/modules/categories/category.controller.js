const { asyncHandler } = require("../../middlewares/errorHandler");
const Category = require("./category.model");



exports.createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name) {
        throw new Error("Name is required")
    }

    const category = await Category.create({
        name,
        description,
    })

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
    })
})

exports.getCategories = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    // Build filter dynamically
    const filter = search
        ? { name: { $regex: search, $options: "i" } }
        : {};

    const categories = await Category.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Category.countDocuments(filter);

    res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        data: categories,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
});

exports.getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
        throw new Error("Category not found");
    }

    res.status(200).json({
        success: true,
        message: "Category fetched successfully",
        data: category,
    });
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: "Category id is required" });
    }

    const updates = { ...req.body };
    const category = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
    });
})

exports.deleteCategory = asyncHandler(async (req, res) => {
    const id = req.params.id || req.query.id || req.body.id;
    if (!id) {
        return res.status(400).json({ success: false, message: "Category id is required" });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
    });
})
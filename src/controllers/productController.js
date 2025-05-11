import Product from '../models/Product.js';

// @desc    Get all products with optional filters, search, sort, and pagination
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    const filter = {
      ...keyword,
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.brand && { brand: req.query.brand }),
    };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ [sortField]: sortOrder })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// @desc    Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product
      ? res.json(product)
      : res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: 'Invalid product ID', error: error.message });
  }
};

// @desc    Create a new product (dynamic)
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
};

// @desc    Update an existing product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    updatedProduct
      ? res.json(updatedProduct)
      : res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product', error: error.message });
  }
};

// @desc    Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    product
      ? res.json({ message: 'Product deleted successfully' })
      : res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};


// Search Products

export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q || '';

    if (!query.trim()) {
      return res.json([]);
    }

    const products = await Product.find({
      name: { $regex: query, $options: 'i' },
      visibility: 'public',
      status: 'active'
    }).limit(5).select('name price thumbnail slug');

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

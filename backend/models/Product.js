const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_or: { type: String }, // Odia Title
  description: { type: String, required: true },
  description_or: { type: String }, // Odia Description
  price: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., 'Paintings', 'Tribal Art', 'Handmade Items'
  category_or: { type: String }, // Odia Category
  images: [{ type: String }],
  model3D_url: { type: String }, // URL or path for 3D model (GLTF/OBJ)
  seller: { type: String }, // Keeping it as string for mock/simpler demo
  seller_or: { type: String }, // Odia Seller Name
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Mock Initial Data for Development fallback (or default seeding)
const mockProducts = [
  // Paintings
  { 
    id: 'p1', title: 'Madhubani Art', title_or: 'ମଧୁବନୀ କଳା', 
    price: 120, category: 'Painting', category_or: 'ଚିତ୍ରକଳା',
    images: ['images/krishna.jpg'], seller: 'Artisan Ramesh', seller_or: 'ରମେଶ କାରିଗର', rating: 4.8 
  },
  { 
    id: 'p2', title: 'Warli Ancestral Canvas', title_or: 'ୱାର୍ଲୀ ପାରମ୍ପରିକ ଚିତ୍ର',
    price: 85, category: 'Painting', category_or: 'ଚିତ୍ରକଳା',
    images: ['images/warli.jpg'], seller: 'Adivasi Collective', seller_or: 'ଆଦିବାସୀ ଗୋଷ୍ଠୀ', rating: 4.9 
  },
  { 
    id: 'p3', title: 'Pichwai Cow Artwork', title_or: 'ପିଛୱାଇ ଗାଈ କଳାକୃତି',
    price: 150, category: 'Painting', category_or: 'ଚିତ୍ରକଳା',
    images: ['images/krishna.jpg'], seller: 'Rajput Creations', seller_or: 'ରାଜପୁତ ସୃଷ୍ଟି', rating: 4.7 
  },
  { 
    id: 'p4', title: 'Kalamkari Tree of Life', title_or: 'କଳମକାରୀ ଜୀବନ ବୃକ୍ଷ',
    price: 110, category: 'Painting', category_or: 'ଚିତ୍ରକଳା',
    images: ['images/warli.jpg'], seller: 'Andhra Artisans', seller_or: 'ଆନ୍ଧ୍ର କାରିଗର', rating: 4.6 
  },
  
  // Terracotta
  { 
    id: 't1', title: 'Terracotta Clay Pot', title_or: 'ଟେରାକୋଟା ମାଟି ପାତ୍ର',
    price: 45, category: 'Terracotta', category_or: 'ମୃଣ୍ମୟ କଳା',
    images: ['images/pots.jpg'], model3D_url: 'yes', seller: 'Priya Crafts', seller_or: 'ପ୍ରିୟା କାରିଗରୀ', rating: 4.5 
  },
  { 
    id: 't3', title: 'Carved Wooden Elephant', title_or: 'କାଠରେ ଖଦା ହୋଇଥିବା ହାତୀ',
    price: 150, category: 'Terracotta', category_or: 'କାଠ ଖୋଦେଇ',
    images: ['images/elephants.jpg'], model3D_url: 'yes', seller: 'Kerala Carvings', seller_or: 'କେରଳ କାରୁକାର୍ଯ୍ୟ', rating: 4.7 
  },

  // Jewelry
  { 
    id: 'j1', title: 'Kundal Gold Necklace', title_or: 'କୁଣ୍ଡଳ ସୁନା ହାର',
    price: 820, category: 'Jewelry', category_or: 'ଅଳଙ୍କାର',
    images: ['images/jewelry.png'], seller: 'Tanishq Crafts', seller_or: 'ତନିଶ୍କ କାରିଗରୀ', rating: 4.9 
  },

  // Textiles
  { 
    id: 'x1', title: 'Banarasi Silk Saree', title_or: 'ବନାରସୀ ସିଲ୍କ ଶାଢ଼ୀ',
    price: 290, category: 'Textiles', category_or: 'ବସ୍ତ୍ର',
    images: ['images/textile.jpg'], seller: 'Varanasi Weavers', seller_or: 'ବାରାଣସୀ ବୁଣାକାର', rating: 5.0 
  },

  // Odisha Special (New additions)
  { 
    id: 'od1', title: 'Sambalpuri Silk Saree', title_or: 'ସମ୍ବଲପୁରୀ ସିଲ୍କ ଶାଢ଼ୀ',
    price: 350, category: 'Textiles', category_or: 'ବସ୍ତ୍ର',
    images: ['images/sambalpuri_saree.png'], seller: 'Sambalpur Weavers Co-op', seller_or: 'ସମ୍ବଲପୁରୀ ବୁଣାକାର ସଂଘ', rating: 5.0, 
    description: 'Authentic Sambalpuri Silk Saree with traditional Bandha (Ikat) work from Odisha.',
    description_or: 'ଓଡ଼ିଶାର ପାରମ୍ପରିକ ବାନ୍ଧ (ଇକତ୍‌) କଳା ସହ ପ୍ରକୃତ ସମ୍ବଲପୁରୀ ସିଲ୍କ ଶାଢ଼ୀ |' 
  },
  { 
    id: 'od2', title: 'Pattachitra Painting', title_or: 'ପଟ୍ଟଚିତ୍ର ଚିତ୍ରକଳା',
    price: 180, category: 'Painting', category_or: 'ଚିତ୍ରକଳା',
    images: ['images/pattachitra.jpg'], seller: 'Raghurajpur Artisans', seller_or: 'ରଘୁରାଜପୁର କାରିଗର', rating: 4.9, 
    description: 'Traditional cloth-based scroll painting from Odisha, depicting mythological themes.',
    description_or: 'ଓଡ଼ିଶାର ପାରମ୍ପରିକ ପଟ୍ଟଚିତ୍ର, ଯେଉଁଥିରେ ପୌରାଣିକ କଥାବସ୍ତୁ ଚିତ୍ରିତ କରାଯାଇଛି |' 
  },
  { 
    id: 'od3', title: 'Pipli Applique Lamp Shade', title_or: 'ପିପିଲି ଚାନ୍ଦୁଆ ଲ୍ୟାମ୍ପସେଡ୍‌',
    price: 65, category: 'Home Decor', category_or: 'ଘର ସାଜସଜ୍ଜା',
    images: ['images/pipli_applique.jpg'], seller: 'Pipli Craft House', seller_or: 'ପିପିଲି ଶିଳ୍ପ ଗୃହ', rating: 4.7, 
    description: 'Vibrant applique work from Pipli, Odisha, featuring traditional motifs and mirror work.',
    description_or: 'ପିପିଲିର ଜୀବନ୍ତ ଚାନ୍ଦୁଆ କାମ, ଯେଉଁଥିରେ ପାରମ୍ପରିକ ଚିତ୍ର ଏବଂ କାଚ କାମ ରହିଛି |' 
  },
  { 
    id: 'od4', title: 'Konark Sun Temple Wheel Replica', title_or: 'କୋଣାର୍କ ଚକ ପ୍ରତିକୃତି',
    price: 220, category: 'Sculpture', category_or: 'ଭାସ୍କର୍ଯ୍ୟ',
    images: ['images/konark_carving.jpg'], seller: 'Odisha Stone Carvers', seller_or: 'ଓଡ଼ିଶା ପ୍ରସ୍ତର କାରିଗର', rating: 4.8, 
    description: 'Intricate stone carving replica of the famous Konark Sun Temple wheel.',
    description_or: 'ପ୍ରସିଦ୍ଧ କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର ଚକର ଜଟିଳ ପଥର ଖୋଦେଇ ପ୍ରତିକୃତି |' 
  },
  { 
    id: 'od5', title: 'Cuttack Silver Filigree (Tarakasi) Necklace', title_or: 'କଟକ ରୂପା ତାରକସି ହାର',
    price: 550, category: 'Jewelry', category_or: 'ଅଳଙ୍କାର',
    images: ['images/silver_filigree.jpg'], seller: 'Cuttack Silver Guild', seller_or: 'କଟକ ରୂପା କାରିଗରୀ ମହାସଂଘ', rating: 5.0, 
    description: 'Delicate silver wire work (Tarakasi) from Cuttack, a centuries-old craft of Odisha.',
    description_or: 'କଟକର ସୂକ୍ଷ୍ମ ରୂପା ତାରକସି କାମ, ଓଡ଼ିଶାର ଏକ ଶହ ଶହ ବର୍ଷର ପୁରୁଣା କଳା |' 
  },
  { 
    id: 'od6', title: 'Bomkai Cotton Saree', title_or: 'ବମକେଇ ସୂତା ଶାଢ଼ୀ',
    price: 120, category: 'Textiles', category_or: 'ବସ୍ତ୍ର',
    description: 'Traditional Bomkai saree from Odisha, known for its unique woven patterns and border.',
    description_or: 'ଓଡ଼ିଶାର ପାରମ୍ପରିକ ବମକେଇ ଶାଢ଼ୀ, ଯାହା ଏହାର ଅନନ୍ୟ ବୁଣାକାର ଶୈଳୀ ପାଇଁ ଜଣାଶୁଣା |' 
  },
  {
    id: 'od7', title: 'Jagannath Idol Statue (Neem Wood)', title_or: 'ଶ୍ରୀ ଜଗନ୍ନାଥ ମୂର୍ତ୍ତି (ନିମ କାଠ)',
    price: 320, category: 'Sculpture', category_or: 'ଭାସ୍କର୍ଯ୍ୟ',
    images: ['images/konark_carving.jpg'], seller: 'Puri Carvers', seller_or: 'ପୁରୀ କାରିଗର', rating: 5.0,
    description: 'Sacred Jagannath, Balabhadra and Subhadra idols hand-carved from Neem wood by hereditary craftsmen of Puri.',
    description_or: 'ପୁରୀର କାରିଗରଙ୍କ ଦ୍ୱାରା ନିମ କାଠରେ ନିର୍ମିତ ପବିତ୍ର ଜଗନ୍ନାଥ, ବଳଭଦ୍ର ଏବଂ ସୁଭଦ୍ରା ମୂର୍ତ୍ତି |'
  },
  {
    id: 'od8', title: 'Odisha Tussar Silk Saree', title_or: 'ଓଡ଼ିଶା ଟସର ସିଲ୍କ ଶାଢ଼ୀ',
    price: 450, category: 'Textiles', category_or: 'ବସ୍ତ୍ର',
    images: ['images/sambalpuri_saree.png'], seller: 'Mayurbhanj Handlooms', seller_or: 'ମୟୂରଭଞ୍ଜ ହସ୍ତତନ୍ତ', rating: 4.8,
    description: 'Premium Tussar silk saree with tribal motifs, hand-woven in the villages of Odisha.',
    description_or: 'ଆଦିବାସୀ ଚିତ୍ର ସହ ପ୍ରିମିୟମ ଟସର ସିଲ୍କ ଶାଢ଼ୀ, ଓଡ଼ିଶାର ଗାଁ ଗୁଡ଼ିକରେ ହାତରେ ବୁଣାଯାଇଛି |'
  },
  {
    id: 'od9', title: 'Dhokra Brass Boat', title_or: 'ଢୋକ୍ରା ପିତ୍ତଳ ଡଙ୍ଗା',
    price: 180, category: 'Sculpture', category_or: 'ଭାସ୍କର୍ଯ୍ୟ',
    images: ['images/pots.jpg'], seller: 'Bastacrafts', seller_or: 'ବସ୍ତାକ୍ରାଫ୍ଟସ୍', rating: 4.6,
    description: 'Ancient lost-wax casting (Dhokra) brass art from tribal regions of Odisha.',
    description_or: 'ଓଡ଼ିଶାର ଆଦିବାସୀ ଅଞ୍ଚଳର ପ୍ରାଚୀନ ଢୋକ୍ରା ପିତ୍ତଳ କଳା |'
  }
];

// --- FULL CRUD REST API FOR PRODUCTS ---

// GET /api/products
router.get('/products', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: mockProducts.length, data: mockProducts });
    }
    const products = await Product.find();
    res.json({ success: true, count: products.length, data: products.length > 0 ? products : mockProducts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id
router.get('/products/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const product = mockProducts.find(p => p.id === req.params.id);
      return product ? res.json({ success: true, data: product }) : res.status(404).json({ success: false, error: 'Not found' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products (Create)
router.post('/products', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const newMock = { id: Date.now().toString(), ...req.body };
      mockProducts.push(newMock);
      return res.status(201).json({ success: true, data: newMock });
    }
    const newProduct = await Product.create(req.body);
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/products/:id (Update)
router.put('/products/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return res.json({ success: true, data: req.body });
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return res.json({ success: true, data: {} });
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- AUTH MOCK ROUTES ---
router.post('/auth/login', (req, res) => {
  const { email } = req.body;
  res.json({ success: true, token: 'mock-jwt-token-123', user: { name: 'Demo User', email } });
});

router.post('/auth/register', (req, res) => {
  const { name, email, role } = req.body;
  res.json({ success: true, token: 'mock-jwt-token-123', user: { name, email, role } });
});

// --- AI VERIFICATION ROUTES ---
router.post('/verify-authenticity', (req, res) => {
  // Simulation of AI processing
  // In a real system, we'd use TensorFlow/PyTorch here
  const { imageBase64, craftType } = req.body;
  
  // Mock analysis logic: skewed towards authentic for demo
  const confidence = Math.floor(Math.random() * (98 - 85 + 1) + 85);
  
  setTimeout(() => {
    res.json({
        success: true,
        type: 'Original Sambalpuri Handloom',
        confidence: confidence,
        detectedPatterns: ['Ikat Alignment Irregularity', 'High Weft Density', 'Manual Dye Bleeding'],
        craftInfo: {
            origin: 'Sambalpur, Odisha',
            technique: 'Traditional Bandha (Ikat)',
            description: 'Hand-woven using the tie-dye technique where patterns are dyed onto threads before weaving.'
        }
    });
  }, 2000); // Simulate network/processing delay
});

module.exports = router;

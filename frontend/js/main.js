document.addEventListener('DOMContentLoaded', () => {
  // Configured production API base endpoint
  window.API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
    ? 'http://localhost:5001' 
    : 'https://art-handcraft-api.onrender.com';

  // Initialize Search Inputs
  document.querySelectorAll('.search-bar input').forEach(inp => {
    inp.addEventListener('input', handleSearch);
  });

  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Set initial theme
  const savedTheme = localStorage.getItem('app-theme') || 'light-mode';
  body.classList.add(savedTheme);
  let isDark = savedTheme === 'dark-mode';
  if (themeToggle) {
    themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    
    themeToggle.addEventListener('click', () => {
      isDark = !isDark;
      const newTheme = isDark ? 'dark-mode' : 'light-mode';
      body.classList.remove('light-mode', 'dark-mode');
      body.classList.add(newTheme);
      localStorage.setItem('app-theme', newTheme);
      themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
  }
  
  // Initialize language
  const savedLang = localStorage.getItem('app-lang') || 'en';
  const langSwitch = document.getElementById('lang-switch');
  if (langSwitch) {
    langSwitch.value = savedLang;
    applyLanguage(savedLang);
  }

  // Fetch initial data
  fetchProducts();

  // --- Scroll Reveal & Navbar Logic ---
  const navbar = document.querySelector('.navbar');
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  // Observe elements
  const observeElements = () => {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .section-title, .category-card, .viewer-3d-section, .footer-section').forEach(el => {
      scrollObserver.observe(el);
    });
  };
  
  observeElements();

  // --- Hero Mouse Parallax ---
  const hero = document.querySelector('.hero');
  if(hero) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const moveX = (window.innerWidth / 2 - clientX) / 25;
      const moveY = (window.innerHeight / 2 - clientY) / 25;
      
      const img = hero.querySelector('.hero-img-wrapper img');
      const blob = hero.querySelector('.decorative-blob');
      
      if(img) img.style.transform = `rotateY(${-10 + moveX}deg) rotateX(${10 + moveY}deg) translateX(${moveX}px) translateY(${moveY}px)`;
      if(blob) blob.style.transform = `translateX(${moveX * -1.5}px) translateY(${moveY * -1.5}px)`;
    });
    
    hero.addEventListener('mouseleave', () => {
      const img = hero.querySelector('.hero-img-wrapper img');
      const blob = hero.querySelector('.decorative-blob');
      if(img) img.style.transform = `rotateY(-10deg) rotateX(10deg)`;
      if(blob) blob.style.transform = `translateX(0) translateY(0)`;
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Re-observe after rendering products
  const originalRenderProductsGrid = window.renderProductsGrid;
  window.renderProductsGrid = function(products, elementId) {
    if (originalRenderProductsGrid) originalRenderProductsGrid(products, elementId);
    document.querySelectorAll(`#${elementId} .product-card`).forEach((el, index) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(index % 6) * 0.1}s`;
      scrollObserver.observe(el);
    });
  };

  // Listen for language changes to update active profile
  const originalApplyLanguage = window.applyLanguage;
  window.applyLanguage = function(lang) {
    if (originalApplyLanguage) originalApplyLanguage(lang);
    const profileSection = document.getElementById('seller-profile-section');
    if (profileSection && profileSection.classList.contains('active')) {
      const currentSeller = document.getElementById('seller-profile-name').getAttribute('data-raw-name');
      openSellerProfile(currentSeller);
    }
  };
});

// Translation Data
window.translations = {
  en: {
    home: "Home",
    shop: "Shop",
    livestreams: "Live Streams",
    sell: "Sell with us",
    hero_title: "Discover the Soul of Indian Heritage",
    hero_subtitle: "Explore authentic handcrafted treasures, traditional paintings, and tribal arts directly from master artisans.",
    explore: "Explore Collection",
    artists_live: "Artists Live Demo",
    shop_by_category: "Shop by Category",
    paintings: "Paintings",
    terracotta: "Terracotta",
    jewelry: "Jewelry",
    textiles: "Textiles",
    home_decor: "Home Decor",
    sculpture: "Sculpture",
    trending: "Trending Masterpieces",
    all_categories: "All Categories",
    interact_3d: "Interact in 3D",
    interact_desc: "Experience the intricate details of our featured handmade artifacts in a fully interactive 3D space. Rotate, zoom, and admire the craftsmanship before you buy.",
    find_3d: "Find 3D Artworks",
    filters: "Filters",
    price_range: "Max Price Range",
    all_artworks: "All Artworks",
    back_home: "Back to Home",
    back_shop: "Back to Shop",
    add_to_cart: "Add to Cart",
    add_to_wishlist: "Add to Wishlist",
    secure_checkout: "Secure Checkout",
    total: "Total",
    cart_title: "Your Cart",
    wishlist_title: "Your Wishlist",
    description: "Description",
    seller_dashboard: "Artisan Dashboard",
    total_sales: "Total Earnings",
    active_listings: "Active Crafts",
    followers: "Followers",
    add_new_handcraft: "Register New Skill/Product",
    publish_product: "Publish to Marketplace",
    opportunities: "Work Opportunities",
    tourism: "Cultural Tourism",
    register_skill: "Register Skill",
    login: "Login",
    register: "Register",
    checkout_title: "Finalize Your Order",
    shipping_info: "Shipping Information",
    payment_method: "Payment Method",
    place_order: "Place Order",
    order_summary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    help_center: "Help Center",
    tracking: "Order Tracking",
    my_orders: "My Orders",
    chat_with_ai: "Chat with AI",
    verified_artisan: "Verified Artisan",
    address_step: "Address",
    payment_step: "Payment",
    confirm_step: "Confirm",
    search_placeholder: "Search for artworks, artisans, or styles...",
    newsletter_title: "Get Updates on New Collections & Live Events",
    verify_title: "Sambalpuri Authenticity Proof",
    verify_subtitle: "AI-powered pattern analysis to distinguish genuine handloom from machine prints.",
    scan_saree: "Scan or Upload Saree Image",
    analyzing_ikat: "Analyzing Ikat patterns...",
    weave_density: "Mapping Weave Density...",
    symmetry_check: "Verifying Design Symmetry...",
    authentic_handloom: "Original Sambalpuri Handloom",
    fake_machine: "Likely Machine-made / Fake",
    needs_review: "Needs Manual Verification",
    confidence_score: "Authentic",
    scan_another: "Scan Another",
    shop_authentic: "Shop Authentic",
    ai_logic_title: "AI Logic",
    ai_logic_desc: "Our Deep Learning model (CNN) identifies the subtle variations in Ikat thread alignment that are human-made, which machines cannot replicate with perfect irregularity.",
    feature_1: "Detects Weft/Warp overlaps",
    feature_2: "Analyzes dye bleeding edges",
    feature_3: "Verifies design unique signature",
    future_support: "Future Support",
    training_models: "We are training models for:",
    profile_shop: "Shop Products",
    profile_heritage: "Our Heritage",
    profile_reviews: "Reviews",
    verified_master: "Verified Master Artisan",
    years_exp: "Years Experience",
    curated_collection: "Curated Collection",
    history_of_craft: "History of Craft",
    artisan_philo: "Artisan Philosophy",
    reviews_rating: "Average rating from buyers",
    excellent: "Excellent",
    subscriptions: "Subscriptions",
    sub_plans: "Membership Plans",
    join_now: "Join Now",
    go_pro: "Go Pro",
    contact_sales: "Contact Sales"
  },
  or: {
    home: "ମୁଖ୍ୟ ପୃଷ୍ଠା",
    shop: "ଦୋକାନ",
    opportunities: "କାର୍ଯ୍ୟ ସୁଯୋଗ",
    tourism: "ସାଂସ୍କୃତିକ ପର୍ଯ୍ୟଟନ",
    livestreams: "ଲାଇଭ୍ ଷ୍ଟ୍ରିମ୍",
    sell: "ବିକ୍ରୟ/ପଞ୍ଜିକରଣ",
    hero_title: "ଲୁକ୍କାୟିତ କଳା ଏବଂ କାରିଗରଙ୍କୁ ସଶକ୍ତ କରିବା",
    hero_subtitle: "କ୍ରାଫ୍ଟମିଣ୍ଟ ପାରମ୍ପରିକ ଐତିହ୍ୟ ଏବଂ ଆଧୁନିକ ସୁଯୋଗ ମଧ୍ୟରେ ବ୍ୟବଧାନକୁ ଦୂର କରେ |",
    explore: "ସଂଗ୍ରହ ଅନୁସନ୍ଧାନ କରନ୍ତୁ",
    artists_live: "କଳାକାରଙ୍କ ଲାଇଭ୍ ଡେମୋ",
    shop_by_category: "ଶ୍ରେଣୀ ଅନୁଯାୟୀ କିଣନ୍ତୁ",
    paintings: "ଚିତ୍ରକଳା",
    terracotta: "ଟେରାକୋଟା",
    jewelry: "ଅଳଙ୍କାର",
    textiles: "ବସ୍ତ୍ର",
    home_decor: "ଘର ସାଜସଜ୍ଜା",
    sculpture: "ଭାସ୍କର୍ଯ୍ୟ",
    trending: "ଟ୍ରେଣ୍ଡିଂ ମାଷ୍ଟରପିସ୍",
    all_categories: "ସମସ୍ତ ଶ୍ରେଣୀ",
    interact_3d: "3D ରେ ମାଧ୍ୟମରେ ଦେଖନ୍ତୁ",
    interact_desc: "ପୂର୍ଣ୍ଣ ଆନ୍ତଃକ୍ରିୟାଶୀଳ 3D ସ୍ପେସରେ ଆମର ବଛାଯାଇଥିବା ହସ୍ତତନ୍ତ କଳାକୃତିର ଜଟିଳ ବିବରଣୀ ଅନୁଭବ କରନ୍ତୁ | କିଣିବା ପୂର୍ବରୁ ବୁଲାଇ, ଜୁମ୍ କରି ଏବଂ କାରିଗରୀର ପ୍ରଶଂସା କରନ୍ତୁ |",
    find_3d: "3D କଳାକୃତି ଖୋଜନ୍ତୁ",
    filters: "ଫିଲ୍ଟର୍ ଗୁଡ଼ିକ",
    price_range: "ସର୍ବାଧିକ ମୂଲ୍ୟ ପରିସର",
    all_artworks: "ସମସ୍ତ କଳାକୃତି",
    back_home: "ମୁଖ୍ୟ ପୃଷ୍ଠାକୁ ଫେରନ୍ତୁ",
    back_shop: "ଦୋକାନକୁ ଫେରନ୍ତୁ",
    add_to_cart: "କାର୍ଟରେ ଯୋଡନ୍ତୁ",
    add_to_wishlist: "ୱିସଲିଷ୍ଟରେ ଯୋଡନ୍ତୁ",
    secure_checkout: "ସୁରକ୍ଷିତ ଚେକଆଉଟ୍",
    total: "ମୋଟ",
    cart_title: "ଆପଣଙ୍କ କାର୍ଟ",
    wishlist_title: "ଆପଣଙ୍କର ୱିସଲିଷ୍ଟ",
    description: "ବର୍ଣ୍ଣନା",
    seller_dashboard: "କାରିଗର ଡ୍ୟାସବୋର୍ଡ",
    total_sales: "ମୋଟ ଆୟ",
    active_listings: "ସକ୍ରିୟ କଳା",
    followers: "ଅନୁସରଣକାରୀ",
    add_new_handcraft: "ନୂତନ ଦକ୍ଷତା / କଳା ପଞ୍ଜିକରଣ କରନ୍ତୁ",
    publish_product: "ପ୍ରକାଶ କରନ୍ତୁ",
    login: "ଲଗଇନ୍",
    register: "ପଞ୍ଜିକରଣ",
    checkout_title: "ଅର୍ଡର ଚୂଡାନ୍ତ କରନ୍ତୁ",
    shipping_info: "ବିତରଣ ଠିକଣା",
    payment_method: "ପେମେଣ୍ଟ ପଦ୍ଧତି",
    place_order: "ଅର୍ଡର ଦିଅନ୍ତୁ",
    order_summary: "ଅର୍ଡର ସାରାଂଶ",
    subtotal: "ମୋଟ ମୂଲ୍ୟ",
    shipping: "ପରିବହନ ଶୁଳ୍କ",
    help_center: "ସହାୟତା କେନ୍ଦ୍ର",
    tracking: "ଅର୍ଡର ଟ୍ରାକିଂ",
    my_orders: "ମୋର ଅର୍ଡର",
    chat_with_ai: "AI ସହାୟତା",
    verified_artisan: "ପ୍ରମାଣିତ କାରିଗର",
    address_step: "ଠିକଣା",
    payment_step: "ପେମେଣ୍ଟ",
    confirm_step: "ନିଶ୍ଚିତକରଣ",
    search_placeholder: "ଏଠାରେ ଖୋଜନ୍ତୁ...",
    newsletter_title: "ନୂତନ ସଂଗ୍ରହ ଏବଂ ଲାଇଭ୍ ଇଭେଣ୍ଟ ଅପଡେଟ୍ ପାଆନ୍ତୁ",
    bot_greeting: "ନମସ୍କାର! ମୁଁ କ୍ରାଫ୍ଟି, ଆପଣଙ୍କ ଓଡ଼ିଶା ଐତିହ୍ୟ ସହାୟକ | ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
    support_btn: "ସହାୟତା / Help",
    verify_title: "ସମ୍ବଲପୁରୀ ପ୍ରାମାଣିକତା ପ୍ରମାଣ",
    verify_subtitle: "ଅସଲି ହାତତନ୍ତକୁ ମେସିନ୍ ପ୍ରିଣ୍ଟରୁ ପୃଥକ କରିବା ପାଇଁ AI- ଚାଳିତ ଶୈଳୀ ବିଶ୍ଳେଷଣ |",
    scan_saree: "ଶାଢୀ ଚିତ୍ର ସ୍କାନ୍ କରନ୍ତୁ କିମ୍ବା ଅପଲୋଡ୍ କରନ୍ତୁ",
    analyzing_ikat: "ଇକାତ ଶୈଳୀ ବିଶ୍ଳେଷଣ କରାଯାଉଛି...",
    weave_density: "ବୁଣା ଘନତା ମାପ କରାଯାଉଛି...",
    symmetry_check: "ଡିଜାଇନ୍ ସମୃଦ୍ଧତା ଯାଞ୍ଚ କରାଯାଉଛି...",
    authentic_handloom: "ପ୍ରକୃତ ସମ୍ବଲପୁରୀ ହାତତନ୍ତ",
    fake_machine: "ମେସିନ୍-ନିର୍ମିତ / ନକଲି ହେବାର ସମ୍ଭାବନା",
    needs_review: "ବ୍ୟକ୍ତିଗତ ଯାଞ୍ଚ ଆବଶ୍ୟକ",
    confidence_score: "ପ୍ରାମାଣିକ ସ୍କୋର",
    scan_another: "ଆଉ ଏକ ସ୍କାନ୍ କରନ୍ତୁ",
    shop_authentic: "ଅସଲି ଶାଢୀ କିଣନ୍ତୁ",
    ai_logic_title: "AI ଯୁକ୍ତି",
    ai_logic_desc: "ଆମର ଗଭୀର ଶିକ୍ଷା ମଡେଲ୍ (CNN) ଇକାତ ସୂତା ଆଲାଇନମେଣ୍ଟରେ ସୂକ୍ଷ୍ମ ପରିବର୍ତ୍ତନଗୁଡିକ ଚିହ୍ନଟ କରେ ଯାହା ମଣିଷ ଦ୍ୱାରା ନିର୍ମିତ, ଯାହା ମେସିନ୍ ଗୁଡ଼ିକ ପୁନରାବୃତ୍ତି କରିପାରିବ ନାହିଁ |",
    feature_1: "ୱେଫ୍ଟ / ୱାର୍ପ ଓଭରଲାପ୍ ଚିହ୍ନଟ କରେ |",
    feature_2: "ରଙ୍ଗର ବ୍ଲିଡିଂ ଧାରକୁ ବିଶ୍ଳେଷଣ କରେ |",
    feature_3: "ଡିଜାଇନ୍ ର ଅନନ୍ୟ ସ୍ୱାକ୍ଷର ଯାଞ୍ଚ କରେ |",
    future_support: "ଭବିଷ୍ୟତ ସମର୍ଥନ",
    training_models: "ଆମେ ଏଥିପାଇଁ ମଡେଲ୍ ପ୍ରଶିକ୍ଷଣ ଦେଉଛୁ:",
    profile_shop: "ଉତ୍ପାଦ ଗୁଡ଼ିକ",
    profile_heritage: "ଆମର ଐତିହ୍ୟ",
    profile_reviews: "ସମୀକ୍ଷା",
    verified_master: "ପ୍ରମାଣିତ ମାଷ୍ଟର କାରିଗର",
    years_exp: "ବର୍ଷର ଅନୁଭବ",
    curated_collection: "ବିଶେଷ ସଂଗ୍ରହ",
    history_of_craft: "କଳାର ଇତିହାସ",
    artisan_philo: "କାରିଗର ଦର୍ଶନ",
    reviews_rating: "କ୍ରେତାଙ୍କ ହାରାହାରି ମୂଲ୍ୟାଙ୍କନ",
    excellent: "ଉତ୍କୃଷ୍ଟ",
    subscriptions: "ସଦସ୍ୟତା (Subscriptions)",
    sub_plans: "ସଦସ୍ୟତା ଯୋଜନା",
    join_now: "ବର୍ତ୍ତମାନ ଯୋଡି ହୁଅନ୍ତୁ",
    go_pro: "ପ୍ରୋ ହୁଅନ୍ତୁ",
    contact_sales: "ବିକ୍ରୟ ବିଭାଗ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ"
  }
};

function changeLanguage() {
  const lang = document.getElementById('lang-switch').value;
  localStorage.setItem('app-lang', lang);
  applyLanguage(lang);
}

function applyLanguage(lang) {
  const t = translations[lang];
  
  // Search Bar Placeholder
  const searchInp = document.querySelector('.search-bar input');
  if(searchInp) searchInp.placeholder = t.search_placeholder;

  // Nav Links
  const navLinks = document.querySelectorAll('.nav-links a');
  if(navLinks[0]) navLinks[0].innerText = t.home;
  if(navLinks[1]) navLinks[1].innerText = t.shop;
  if(navLinks[2]) navLinks[2].innerText = t.opportunities || "Work Ops";
  if(navLinks[3]) navLinks[3].innerText = t.tourism || "Tourism";
  if(navLinks[4]) navLinks[4].innerText = t.subscriptions || "Subscriptions";
  if(navLinks[5]) navLinks[5].innerHTML = `<i class="fa-solid fa-shield-halved"></i> ${lang === 'or' ? 'ଯାଞ୍ଚ କରନ୍ତୁ' : 'Verify'}`;
  if(navLinks[6]) navLinks[6].innerHTML = `<i class="fa-solid fa-headset"></i> ${t.help_center || 'Support'}`;
  if(navLinks[7]) navLinks[7].innerText = t.sell;

  // Hero
  const heroH1 = document.querySelector('.hero-content h1');
  if(heroH1) heroH1.innerHTML = lang === 'or' ? `<span class="highlight">ଲୁକ୍କାୟିତ କଳା</span> ଏବଂ କାରିଗରଙ୍କୁ ସଶକ୍ତ କରିବା` : `Empowering <span class="highlight">Hidden Skills</span> & Artisans`;
  const heroP = document.querySelector('.hero-content p');
  if(heroP) heroP.innerText = lang === 'or' ? `କ୍ରାଫ୍ଟମିଣ୍ଟ ପାରମ୍ପରିକ ଐତିହ୍ୟ ଏବଂ ଆଧୁନିକ ସୁଯୋଗ ମଧ୍ୟରେ ବ୍ୟବଧାନକୁ ଦୂର କରେ | କାରିଗରମାନଙ୍କ ସହିତ ସଂଯୋଗ କରନ୍ତୁ, କର୍ମଶାଳା ବୁକ୍ କରନ୍ତୁ ଏବଂ ବିଲୁପ୍ତ ହେଉଥିବା କଳା ରୂପଗୁଡ଼ିକୁ ପୁନର୍ଜୀବିତ କରନ୍ତୁ |` : `CraftMint bridges the gap between traditional heritage and modern opportunities. Connect with artisans, book workshops, and revive disappearing art forms.`;
  const heroBtns = document.querySelectorAll('.hero-content button');
  if(heroBtns[0]) heroBtns[0].innerText = t.explore;
  if(heroBtns[1]) heroBtns[1].innerText = lang === 'or' ? `କାରିଗର ନିଯୁକ୍ତ କରନ୍ତୁ` : `Hire an Artisan`;

  // Categories Section
  const catTitle = document.querySelector('.categories .section-title');
  if(catTitle) catTitle.innerText = t.shop_by_category;
  const catCards = document.querySelectorAll('.category-card h3');
  if(catCards[0]) catCards[0].innerText = t.paintings;
  if(catCards[1]) catCards[1].innerText = t.terracotta;
  if(catCards[2]) catCards[2].innerText = t.jewelry;
  if(catCards[3]) catCards[3].innerText = t.textiles;

  // Trending Section
  const trendTitle = document.querySelector('.featured-products .section-title');
  if(trendTitle) trendTitle.innerText = t.trending;
  const filterBtns = document.querySelectorAll('.filter-btn');
  if(filterBtns[0]) filterBtns[0].innerText = t.all_categories;
  if(filterBtns[1]) filterBtns[1].innerText = t.paintings;
  if(filterBtns[2]) filterBtns[2].innerText = t.terracotta;
  if(filterBtns[3]) filterBtns[3].innerText = t.jewelry;
  if(filterBtns[4]) filterBtns[4].innerText = t.textiles;

  // 3D Showcase
  const interactTitle = document.querySelector('.viewer-3d-section .section-title');
  if(interactTitle) interactTitle.innerText = t.interact_3d;
  const interactP = document.querySelector('.viewer-3d-section p');
  if(interactP) interactP.innerText = t.interact_desc;
  const interactBtn = document.querySelector('.viewer-3d-section button');
  if(interactBtn) interactBtn.innerText = t.find_3d;

  // Shop Section
  const shopBackBtn = document.querySelector('#shop-section .btn-secondary');
  if(shopBackBtn) shopBackBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> ${t.back_home}`;
  const sidebarH3 = document.querySelector('.shop-sidebar h3');
  if(sidebarH3) sidebarH3.innerText = t.filters;
  const shopTitle = document.querySelector('#shop-section .section-title');
  if(shopTitle) shopTitle.innerText = t.all_artworks;

  // Authenticity Section
  const vF3 = document.getElementById('v-feature-3');
  if(vF3) vF3.innerHTML = `<i class="fa-solid fa-check text-success"></i> ${t.feature_3}`;
  const vFuture = document.getElementById('verify-future-title');
  if(vFuture) vFuture.innerHTML = `<i class="fa-solid fa-bolt"></i> ${t.future_support}`;
  const vFutureDesc = document.getElementById('verify-future-desc');
  if(vFutureDesc) vFutureDesc.innerText = t.training_models;

  // Update cart labels
  const cartH2 = document.querySelector('#cart-sidebar h2');
  if(cartH2) cartH2.innerText = t.cart_title;
  const checkoutBtn = document.querySelector('#cart-sidebar .btn-primary');
  if(checkoutBtn) checkoutBtn.innerText = t.secure_checkout;
  const totalLabel = document.querySelector('#cart-sidebar .total');
  if(totalLabel) totalLabel.innerHTML = `${t.total}: <span id="cart-total">₹${cart.reduce((s, i) => s + i.price, 0).toFixed(2)}</span>`;

  // Checkout Section
  const checkoutTitle = document.querySelector('#checkout-section .section-title');
  if(checkoutTitle) checkoutTitle.innerText = t.checkout_title;
  const shippingH3 = document.querySelector('.checkout-form h3');
  if(shippingH3) shippingH3.innerText = t.shipping_info;
  const paymentH3 = document.querySelectorAll('.checkout-form h3')[1];
  if(paymentH3) paymentH3.innerText = t.payment_method;
  const placeOrderBtn = document.querySelector('#checkout-form button');
  if(placeOrderBtn) placeOrderBtn.innerText = t.place_order;
  const summaryH3 = document.querySelector('.checkout-summary h3');
  if(summaryH3) summaryH3.innerText = t.order_summary;
  const summaryLabels = document.querySelectorAll('.summary-total span:first-child');
  summaryLabels.forEach(label => {
    if(label.innerText.includes("Subtotal")) label.innerText = t.subtotal;
    if(label.innerText.includes("Shipping")) label.innerText = t.shipping;
    if(label.innerText.includes("Total")) label.innerText = t.total;
  });

  // Subscriptions
  const subTitle = document.querySelector('#subscriptions-section .section-title');
  if(subTitle) subTitle.innerText = t.sub_plans;
  const subBtns = document.querySelectorAll('#subscriptions-section button');
  if(subBtns[0]) subBtns[0].innerText = t.join_now;
  if(subBtns[1]) subBtns[1].innerText = t.go_pro;
  if(subBtns[2]) subBtns[2].innerText = t.contact_sales;

  // Render products again
  renderProductsGrid(currentProducts, 'shop-grid');
  filterHomeProducts('All');
}

// Navigation / SPA logic
function showSection(sectionId) {
  // Show progress bar
  let bar = document.querySelector('.progress-bar');
  if(!bar) {
    bar = document.createElement('div');
    bar.className = 'progress-bar';
    document.body.appendChild(bar);
  }
  
  bar.style.width = '30%';
  setTimeout(() => bar.style.width = '70%', 100);

  // Hide all sections
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });
  
  setTimeout(() => {
    // Show target section
    const target = document.getElementById(sectionId + '-section');
    if(target) target.classList.add('active');
    
    bar.style.width = '100%';
    setTimeout(() => {
      bar.style.width = '0%';
      bar.style.transition = 'none';
      setTimeout(() => bar.style.transition = 'width 0.4s ease', 10);
    }, 400);

    // Update nav active state
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
      const onclickAttr = link.getAttribute('onclick');
      if(onclickAttr && onclickAttr.includes(`'${sectionId}'`)) {
        link.classList.add('active');
      }
    });

    // Auto-close mobile menu if it is open
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && navMenu.classList.contains('show')) {
      toggleMobileMenu();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 300);
}

// Global state
let currentProducts = [];
let cart = [];
let wishlist = [];

// Fetch Products from Mock Backend
async function fetchProducts() {
  const shopGrid = document.getElementById('shop-grid');
  const featuredGrid = document.getElementById('featured-grid');
  
  if(shopGrid) {
    shopGrid.innerHTML = Array(6).fill(0).map(() => `
      <div class="product-card skeleton" style="height: 400px; opacity: 0.5;"></div>
    `).join('');
  }
  
  try {
    const res = await fetch(`${window.API_BASE_URL || ''}/api/products`);
    const data = await res.json();
    if(data.success) {
      currentProducts = [...data.data];
    }
  } catch (error) {
    console.error('Error fetching products, falling back to static mock data:', error);
    currentProducts = [];
  }

  // Always inject custom items to ensure they show up for the user
  const customItems = [
    { 
      id: 'custom1', 
      title: 'Watercolor Baby Portrait', 
      price: 0, 
      isCustom: true,
      category: 'Painting', 
      images: ['images/watercolor_baby_portrait.png'], 
      seller: 'Custom Studio', 
      rating: 5.0,
      description: 'A beautiful hand-painted watercolor portrait of your loved ones.'
    },
    { 
      id: 'custom2', 
      title: 'Hand-Drawn Artistic Portrait', 
      price: 0, 
      isCustom: true,
      category: 'Painting', 
      images: ['images/baby_portrait.jpg'], 
      seller: 'Heritage Studio', 
      rating: 4.9,
      description: 'Get your precious moments captured on canvas.'
    },
    { 
      id: 'custom3', 
      title: 'Original Custom Portrait', 
      price: 0, 
      isCustom: true,
      category: 'Painting', 
      images: ['images/artss.jpeg'], 
      seller: 'Authentic Arts', 
      rating: 5.0,
      description: 'Original hand-painted portrait. Custom orders accepted.'
    }
  ];

  // Prepend custom items
  currentProducts = [...customItems, ...currentProducts];
  
  if (currentProducts.length === customItems.length) {
    // If currentProducts only has custom items, it means fetch failed, add more mock data
    currentProducts = [...currentProducts, 
      { id: 'p1', title: 'Madhubani Art', price: 120, category: 'Painting', images: ['images/pattachitra.jpg'], seller: 'Artisan Ramesh', rating: 4.8 },
      { id: 'p2', title: 'Warli Ancestral Canvas', price: 85, category: 'Painting', images: ['images/warli.jpg'], seller: 'Adivasi Collective', rating: 4.9 },
      { id: 'p3', title: 'Pichwai Cow Artwork', price: 150, category: 'Painting', images: ['images/pattachitra.jpg'], seller: 'Rajput Creations', rating: 4.7 },
      { id: 'od2', title: 'Pattachitra Painting', title_or: 'ପଟ୍ଟଚିତ୍ର ଚିତ୍ରକଳା', price: 180, category: 'Painting', images: ['images/pattachitra.jpg'], seller: 'Raghurajpur Artisans', rating: 4.9 },
      { id: 'od3', title: 'Pipli Applique Lamp', title_or: 'ପିପିଲି ଚାନ୍ଦୁଆ ଲ୍ୟାମ୍ପ', price: 65, category: 'Home Decor', images: ['images/pipli_applique.jpg'], seller: 'Pipli Craft House', rating: 4.7 },
      { id: 'od5', title: 'Silver Filigree Box', title_or: 'କଟକ ରୂପା ତାରକସି ବାକ୍ସ', price: 220, category: 'Jewelry', images: ['images/silver_filigree.jpg'], seller: 'Cuttack Guild', rating: 5.0 },
      { id: 'od9', title: 'Jagannath Wooden Idol', title_or: 'ଜଗନ୍ନାଥ ମୂର୍ତ୍ତି', price: 50, category: 'Sculpture', images: ['images/jagannath.jpg'], seller: 'Puri Carvings', rating: 5.0 }
    ];
  }

  filterHomeProducts('All');
  renderProductsGrid(currentProducts, 'shop-grid');
  filterHomeProducts('All');
  renderProductsGrid(currentProducts, 'shop-grid');
}

// Global static data as fallback
const fallbackProducts = [
  { id: 'od1', title: 'Sambalpuri Silk Saree', title_or: 'ସମ୍ବଲପୁରୀ ସିଲ୍କ ଶାଢୀ', price: 350, category: 'Textiles', images: ['images/sambalpuri_saree.png'], seller: 'Sambalpur Weavers Co-op', rating: 5.0, district: 'Sambalpur', description: 'Authentic Sambalpuri Silk Saree with traditional Bandha (Ikat) work.' },
  { id: 'od2', title: 'Pattachitra Painting', title_or: 'ପଟ୍ଟଚିତ୍ର ଚିତ୍ରକଳା', price: 180, category: 'Painting', images: ['images/pattachitra.jpg'], seller: 'Raghurajpur Artisans', rating: 4.9, district: 'Puri', description: 'Traditional cloth-based scroll painting from Odisha.' },
  { id: 'od3', title: 'Pipli Applique Lamp', title_or: 'ପିପିଲି ଚାନ୍ଦୁଆ ଲ୍ୟାମ୍ପ', price: 65, category: 'Home Decor', images: ['images/pipli_applique.jpg'], seller: 'Pipli Craft House', rating: 4.7, district: 'Puri', description: 'Vibrant applique work from Pipli.' },
  { id: 'od4', title: 'Koraput Arabica Coffee', title_or: 'କୋରାପୁଟ ଆରାବିକା କଫି', price: 15, category: 'Tribal Art/Goods', images: ['images/koraput_coffee.jpg'], seller: 'Koraput Farmers', rating: 4.8, district: 'Koraput', description: 'Pure organic Arabica coffee.' },
  { id: 'od5', title: 'Silver Filigree Box', title_or: 'କଟକ ରୂପା ତାରକସି ବାକ୍ସ', price: 220, category: 'Jewelry', images: ['images/silver_filigree.jpg'], seller: 'Cuttack Guild', rating: 5.0, district: 'Cuttack', description: 'Exquisite silver wire craft (Tarakasi) from Cuttack.' },
  { id: 'od8', title: 'Dhokra Tribal Casting', title_or: 'ଧୋକ୍ରା ଆଦିବାସୀ କଳା', price: 90, category: 'Sculpture', images: ['images/elephants.jpg'], seller: 'Mayurbhanj Tribal Art', rating: 4.8, district: 'Mayurbhanj', description: 'Lost-wax metal casting featuring tribal motifs.' },
  { id: 'od9', title: 'Jagannath Wooden Idol', title_or: 'ଜଗନ୍ନାଥ ମୂର୍ତ୍ତି', price: 50, category: 'Sculpture', images: ['images/jagannath.jpg'], seller: 'Puri Carvings', rating: 5.0, district: 'Puri', description: 'Neem wood idol of Lord Jagannath.' }
];

// Homepage Filtering Logic
function filterHomeProducts(category) {
  // Update active state of buttons
  document.querySelectorAll('.filter-tabs .filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (category === 'All' && btn.innerText === 'All Categories') btn.classList.add('active');
    if (btn.innerText.includes(category) && category !== 'All') btn.classList.add('active');
  });

  if (category === 'All') {
    renderProductsGrid(currentProducts, 'featured-grid');
  } else {
    const filtered = currentProducts.filter(p => p.category === category);
    renderProductsGrid(filtered, 'featured-grid');
  }
}

// Render product grids
function renderProductsGrid(products, elementId) {
  const container = document.getElementById(elementId);
  if(!container) return;
  container.innerHTML = '';
  
  products.forEach(prod => {
    // Inject the dynamically selected component string based on category
    const htmlString = getProductComponent(prod);
    const temp = document.createElement('div');
    temp.innerHTML = htmlString.trim();
    container.appendChild(temp.firstChild);
  });
}

// Product Detail Logic
function openProductDetail(productId) {
  const product = currentProducts.find(p => p.id === productId);
  if(!product) return;
  
  const lang = localStorage.getItem('app-lang') || 'en';
  const displayTitle = (lang === 'or' && product.title_or) ? product.title_or : product.title;
  document.getElementById('detail-title').innerText = displayTitle;
  document.getElementById('detail-price').innerText = product.isCustom ? (lang === 'or' ? "ମୂଲ୍ୟ ପାଇଁ ଯୋଗାଯୋଗ କରନ୍ତୁ" : "Contact for Price") : `₹${product.price.toFixed(2)}`;
  
  const sellerElem = document.getElementById('detail-seller');
  sellerElem.innerText = (lang === 'or' && product.seller_or) ? product.seller_or : (product.seller || 'Unknown Artisan');
  sellerElem.style.cursor = 'pointer';
  sellerElem.style.color = 'var(--primary-color)';
  sellerElem.onclick = () => openSellerProfile(product.seller);
  document.getElementById('detail-rating').innerHTML = `<i class="fa-solid fa-star"></i> ${product.rating || '4.0'}`;
  document.getElementById('detail-desc').innerText = (lang === 'or' && product.description_or) ? product.description_or : (product.description || 'An authentically handcrafted piece showcasing the rich cultural heritage of Indian arts. Made with passion and traditional techniques past down generations.');
  
  const addBtn = document.getElementById('add-to-cart-btn');
  if (product.isCustom) {
    addBtn.innerHTML = `<i class="fa-solid fa-envelope"></i> ${lang === 'or' ? "କାରିଗରଙ୍କ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ" : "Contact Artisan"}`;
    addBtn.onclick = () => { contactArtisan(displayTitle); };
  } else {
    addBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> ${lang === 'or' ? "କାର୍ଟରେ ଯୋଡନ୍ତୁ" : "Add to Cart"}`;
    addBtn.onclick = () => { addToCart(null, product.id); };
  }

  const wishlistBtn = document.getElementById('add-to-wishlist-btn');
  if (wishlistBtn) {
    wishlistBtn.style.display = product.isCustom ? 'none' : 'inline-block';
    wishlistBtn.onclick = () => { addToWishlist(product.id); };
  }

  // Setup Visuals
  const imgElem = document.getElementById('detail-image');
  const viewerContainer = document.getElementById('product-3d-container');
  
  if (product.images && product.images.length > 0) {
    imgElem.src = product.images[0];
  }

  // Show section first so that containers have actual layout dimensions
  showSection('product-detail');

  // If product has 3D model, show 3D by default and initialize it, else show image
  if (product.model3D_url) {
    toggleViewer('3d');
    if (window.initDetail3DViewer) {
      window.initDetail3DViewer(product.id);
    }
  } else {
    toggleViewer('image');
  }
}

function toggleViewer(type) {
  const canvasContainers = document.querySelectorAll('#product-3d-container canvas');
  const imgElem = document.getElementById('detail-image');
  
  if (type === '3d') {
    imgElem.style.display = 'none';
    canvasContainers.forEach(c => c.style.display = 'block');
  } else {
    imgElem.style.display = 'block';
    canvasContainers.forEach(c => c.style.display = 'none');
  }
}

// Cart Functionality
function toggleCart() {
  const cartSidebar = document.getElementById('cart-sidebar');
  cartSidebar.classList.toggle('show');
}

function addToCart(event, productId) {
  if (event) event.stopPropagation();
  
  const product = currentProducts.find(p => p.id === productId);
  if(product) {
    cart.push(product);
    updateCartUI();
    const badge = document.querySelector('.badge');
    badge.innerText = cart.length;
    badge.style.transform = 'scale(1.5)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
    showToast(`${product.title} added to cart!`);
  }
}

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Search Logic
function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  const searchResults = currentProducts.filter(p => 
    p.title.toLowerCase().includes(query) || 
    (p.title_or && p.title_or.toLowerCase().includes(query)) ||
    p.category.toLowerCase().includes(query) || 
    (p.category_or && p.category_or.toLowerCase().includes(query)) ||
    (p.seller && p.seller.toLowerCase().includes(query)) ||
    (p.seller_or && p.seller_or.toLowerCase().includes(query))
  );
  
  if(query.length > 0) {
    showSection('shop');
    renderProductsGrid(searchResults, 'shop-grid');
    document.querySelector('#shop-section .section-title').innerText = `Search Results for "${query}"`;
  } else {
    renderProductsGrid(currentProducts, 'shop-grid');
    document.querySelector('#shop-section .section-title').innerText = "All Artworks";
  }
}

function updateCartUI() {
  const cartContainer = document.getElementById('cart-items');
  cartContainer.innerHTML = '';
  let total = 0;
  
  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement('div');
    div.className = 'cart-item';
    const lang = localStorage.getItem('app-lang') || 'en';
    const displayTitle = (lang === 'or' && item.title_or) ? item.title_or : item.title;
    div.innerHTML = `
      <img src="${item.images[0]}" alt="${displayTitle}">
      <div class="cart-item-info">
        <div class="cart-item-title">${displayTitle}</div>
        <div style="color:var(--text-light); margin-top:5px;">₹${item.price.toFixed(2)}</div>
      </div>
      <button class="icon-btn" onclick="removeFromCart(${index})" style="color:var(--primary-color)"><i class="fa-solid fa-trash"></i></button>
    `;
    cartContainer.appendChild(div);
  });
  
  document.getElementById('cart-total').innerText = `₹${total.toFixed(2)}`;
}

function toggleWishlist() {
  const wishlistSidebar = document.getElementById('wishlist-sidebar');
  wishlistSidebar.classList.toggle('show');
}

function addToWishlist(productId) {
  const product = currentProducts.find(p => p.id === productId);
  if (!product) return;

  if (wishlist.some(item => item.id === productId)) {
    alert('Already in wishlist');
    return;
  }

  wishlist.push(product);
  updateWishlistUI();

  const badge = document.getElementById('wishlist-badge');
  if (badge) badge.innerText = wishlist.length;
}

function updateWishlistUI() {
  const wishlistContainer = document.getElementById('wishlist-items');
  if (!wishlistContainer) return;

  wishlistContainer.innerHTML = '';
  wishlist.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    const lang = localStorage.getItem('app-lang') || 'en';
    const displayTitle = (lang === 'or' && item.title_or) ? item.title_or : item.title;
    div.innerHTML = `
      <img src="${item.images[0]}" alt="${displayTitle}">
      <div class="cart-item-info">
        <div class="cart-item-title">${displayTitle}</div>
        <div style="color:var(--text-light); margin-top:5px;">₹${item.price.toFixed(2)}</div>
      </div>
      <button class="icon-btn" onclick="removeFromWishlist(${index})" style="color:var(--primary-color)"><i class="fa-solid fa-trash"></i></button>
    `;
    wishlistContainer.appendChild(div);
  });

  const wishlistCount = document.getElementById('wishlist-count');
  if (wishlistCount) wishlistCount.innerText = wishlist.length;
}

function removeFromWishlist(index) {
  wishlist.splice(index, 1);
  updateWishlistUI();
  const badge = document.getElementById('wishlist-badge');
  if (badge) badge.innerText = wishlist.length;
}

function clearWishlist() {
  wishlist = [];
  updateWishlistUI();
  const badge = document.getElementById('wishlist-badge');
  if (badge) badge.innerText = '0';
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
  document.querySelector('.badge').innerText = cart.length;
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  
  // Populate Checkout Summary
  const list = document.getElementById('checkout-items-list');
  list.innerHTML = '';
  let subtotal = 0;
  
  cart.forEach(item => {
    subtotal += item.price;
    const div = document.createElement('div');
    const lang = localStorage.getItem('app-lang') || 'en';
    const displayTitle = (lang === 'or' && item.title_or) ? item.title_or : item.title;
    div.innerHTML = `<span>${displayTitle}</span> <span>₹${item.price.toFixed(2)}</span>`;
    list.appendChild(div);
  });
  
  document.getElementById('summary-subtotal').innerText = `₹${subtotal.toFixed(2)}`;
  document.getElementById('summary-total').innerText = `₹${subtotal.toFixed(2)}`;
  
  showSection('checkout');
  toggleCart();
}

function processOrder(e) {
  e.preventDefault();
  nextCheckoutStep();
}

function nextCheckoutStep() {
  const steps = ['address', 'payment', 'confirm'];
  const currentStep = document.querySelector('.checkout-step.active');
  const currentIndex = steps.indexOf(currentStep.id.split('-')[1]);
  
  if (currentIndex < steps.length - 1) {
    currentStep.classList.remove('active');
    document.getElementById(`step-${steps[currentIndex + 1]}`).classList.add('active');
    
    // Update progress markers
    const markers = document.querySelectorAll('.step-marker');
    markers[currentIndex + 1].classList.add('active');
  } else {
    // Final Confirmation
    const orderId = 'CM-' + Math.floor(Math.random() * 90000 + 10000);
    localStorage.setItem('last-order', JSON.stringify({
        id: orderId,
        date: new Date().toLocaleDateString(),
        status: 'Processing',
        total: document.getElementById('summary-total').innerText
    }));
    
    showSection('order-success');
    // Clear cart
    cart = [];
    updateCartUI();
    document.querySelector('.badge').innerText = "0";
  }
}

// Help Chat Logic
function toggleHelpChat() {
  const chat = document.getElementById('help-chat-modal');
  chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
}

function contactArtisan(productTitle) {
  // Open Chat
  const chat = document.getElementById('help-chat-modal');
  chat.style.display = 'flex';

  // Clear previous auto-messages if needed or just append
  const msgCont = document.getElementById('help-chat-messages');
  
  // Add User Message
  const lang = localStorage.getItem('app-lang') || 'en';
  const userMsg = lang === 'or' 
    ? `ନମସ୍କାର, ମୁଁ "${productTitle}" ପାଇଁ ଅର୍ଡର କରିବାକୁ ଚାହୁଁଛି | ଏହାର ମୂଲ୍ୟ କେତେ?`
    : `Hi, I am interested in ordering "${productTitle}". What is the price and how can I proceed?`;
  
  msgCont.innerHTML += `<div class="msg user"><b>You:</b> ${userMsg}</div>`;
  
  // Add Bot/Artisan Reply
  setTimeout(() => {
    const reply = lang === 'or'
      ? `ଧନ୍ୟବାଦ! "${productTitle}" ଏକ କଷ୍ଟମ ଆର୍ଟୱର୍କ | ଆମର କାରିଗର ଆପଣଙ୍କ ସହିତ ଶୀଘ୍ର ଯୋଗାଯୋଗ କରିବେ | ଦୟାକରି ଆପଣଙ୍କର ଫଟୋ ଏଠାରେ ସେୟାର କରନ୍ତୁ |`
      : `Thank you for your interest! "${productTitle}" is a custom-made artwork. Our master artisan will contact you shortly to discuss details. Please share your reference photo here.`;
    
    msgCont.innerHTML += `<div class="msg bot"><b>Crafty:</b> ${reply}</div>`;
    msgCont.scrollTop = msgCont.scrollHeight;
  }, 800);
}

function sendHelpMsg() {
  const input = document.getElementById('help-msg-input');
  const text = input.value.trim();
  if(!text) return;

  const msgCont = document.getElementById('help-chat-messages');
  msgCont.innerHTML += `<div class="msg user"><b>You:</b> ${text}</div>`;
  input.value = '';

  // AI Reply Simulation
  setTimeout(() => {
    const lang = localStorage.getItem('app-lang') || 'en';
    const lowerText = text.toLowerCase();
    let reply = "";

    // 1. Check for phone numbers
    const phoneRegex = /(\+?\d{10,12})/;
    if (phoneRegex.test(text)) {
      reply = lang === 'or'
        ? `ଧନ୍ୟବାଦ! ମୁଁ ଆପଣଙ୍କ ନମ୍ବର (${text.match(phoneRegex)[0]}) ପାଇଲି | ଆମର କାରିଗର ଖୁବ ଶୀଘ୍ର ଆପଣଙ୍କୁ କଲ୍ କରିବେ |`
        : `Got it! I've saved your contact number (${text.match(phoneRegex)[0]}). Our artisan will call you shortly to finalize your order.`;
    } 
    // 2. Check for "order" or "price" or "custom"
    else if (lowerText.includes('order') || lowerText.includes('price') || lowerText.includes('custom') || lowerText.includes('portrait')) {
      reply = lang === 'or'
        ? "ନିଶ୍ଚିତ! କଷ୍ଟମ୍ ପୋର୍ଟ୍ରେଟ୍ ପାଇଁ ଆମେ ଆପଣଙ୍କର ଫଟୋ ଆବଶ୍ୟକ କରୁ | ଦୟାକରି ଏଠାରେ ଏକ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ କିମ୍ବା ଆପଣଙ୍କର ବିବରଣୀ ଦିଅନ୍ତୁ |"
        : "Of course! For custom portraits, we'll need your reference photo. You can upload it here or share your requirements, and I'll notify the artist.";
    }
    // 3. Check for greetings
    else if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('namaskar')) {
      reply = lang === 'or'
        ? "ନମସ୍କାର! ମୁଁ କ୍ରାଫ୍ଟି, ଆପଣଙ୍କ ଓଡ଼ିଶା ଐତିହ୍ୟ ସହାୟକ | ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?"
        : "Namaskar! I am Crafty, your Odisha Heritage Assistant. How can I help you support local artisans today?";
    }
    // 4. Default
    else {
      reply = lang === 'or'
        ? "ମୁଁ ବୁଝିପାରୁଛି | ଦୟାକରି ମୋତେ ଅଧିକ ବିବରଣୀ ଦିଅନ୍ତୁ ଯେପରି ମୁଁ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିପାରିବି |"
        : "I understand. Please give me more details so I can better assist you with your request.";
    }
    
    msgCont.innerHTML += `<div class="msg bot"><b>Crafty:</b> ${reply}</div>`;
    msgCont.scrollTop = msgCont.scrollHeight;
  }, 1000);
}

// Auth Modal
function toggleAuthModal() {
  const modal = document.getElementById('auth-modal');
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function switchAuthTab(type) {
  const tabs = document.querySelectorAll('.auth-tabs .tab');
  tabs.forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  const regFields = document.getElementById('register-fields');
  regFields.style.display = type === 'register' ? 'block' : 'none';
}

function handleAuth(e) {
  e.preventDefault();
  alert("Authentication Successful!");
  toggleAuthModal();
}

// Live Chat Mock
function sendChat() {
  const input = document.getElementById('chat-text');
  const text = input.value.trim();
  if(!text) return;
  
  const chatContainer = document.getElementById('chat-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-msg';
  msgDiv.innerHTML = `<b>You:</b> ${text}`;
  chatContainer.appendChild(msgDiv);
  
  input.value = '';
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  // Fake reply
  setTimeout(() => {
    const reply = document.createElement('div');
    reply.className = 'chat-msg';
    reply.innerHTML = `<b>Artist Ramesh:</b> Thanks for watching!`;
    chatContainer.appendChild(reply);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 2000);
}

// Intelligent Image-Mapping System
function getMappedImage(title) {
  const t = title.toLowerCase();
  if (t.includes('madhubani')) return 'images/krishna.jpg'; // or images/paintings.jpg
  if (t.includes('warli')) return 'images/warli.jpg';
  if (t.includes('terracotta') || t.includes('clay pot')) return 'images/pots.jpg';
  if (t.includes('elephant') || t.includes('wood carving')) return 'images/elephants.jpg';
  if (t.includes('jewelry')) return 'images/jewelry.png';
  if (t.includes('textile') || t.includes('handloom') || t.includes('saree')) return 'images/textile.jpg';
  if (t.includes('sambalpuri')) return 'images/sambalpuri_saree.png';
  if (t.includes('pattachitra')) return 'images/pattachitra.jpg';
  if (t.includes('pipli')) return 'images/pipli_applique.jpg';
  if (t.includes('konark')) return 'images/konark_carving.jpg';
  if (t.includes('silver') || t.includes('filigree')) return 'images/silver_filigree.jpg';
  
  // Fallback Rule
  return 'images/generic-handicraft.jpg';
}

// Seller Dashboard Upload Mock
function handleUpload(e) {
  e.preventDefault();
  
  const title = e.target.querySelector('input[type="text"]').value;
  const mappedImage = getMappedImage(title);
  
  alert(`Product "${title}" uploaded successfully to marketplace!\nIntelligent Mapping System auto-assigned image: ${mappedImage}\nIt is now pending review.`);
  e.target.reset();
}

// Mobile Nav Toggle
function toggleMobileMenu() {
  const navMenu = document.querySelector('.nav-menu');
  const btn = document.querySelector('.hamburger-btn');
  const icon = btn.querySelector('i');
  const logo = document.querySelector('.logo');
  const navContainer = document.querySelector('.nav-container');
  
  navMenu.classList.toggle('show');
  if(navContainer) navContainer.classList.toggle('menu-open');
  
  // Swap the hamburger icon with a cross mark when menu is open
  if (navMenu.classList.contains('show')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
    if (logo) logo.style.display = 'none';
  } else {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
    if (logo) logo.style.display = 'flex';
  }
}

// Shop Filters Logic
function updatePriceLabel() {
  const val = document.getElementById('price-filter').value;
  const label = document.getElementById('price-label');
  if(label) label.innerText = val;
}

function filterShop() {
  const catInput = document.querySelector('input[name="catFilter"]:checked').value;
  const maxPrice = parseFloat(document.getElementById('price-filter').value);
  
  const filtered = currentProducts.filter(prod => {
    // Check price constraint
    if(prod.price > maxPrice) return false;
    
    // Check Category constraint
    if(catInput !== 'All') {
      const criteria = catInput.split('|');
      const prodCat = prod.category.toLowerCase();
      const matches = criteria.some(term => prodCat.includes(term));
      if (!matches) return false;
    }
    
    return true;
  });
  
  // Render just the shop grid with filtered items
  renderProductsGrid(filtered, 'shop-grid');
}

// Seller Profile Logic
function openSellerProfile(sellerName) {
  const seller = sellerName || 'Artisan Ramesh';
  const lang = localStorage.getItem('app-lang') || 'en';
  
  // Real-like Artisan Database
  const artisanData = {
    'Artisan Ramesh': {
      name_or: 'କାରିଗର ରମେଶ',
      location: 'Jaipur, Rajasthan',
      location_or: 'ଜୟପୁର, ରାଜସ୍ଥାନ',
      years: 15,
      bio: 'Born into a family of traditional Madhubani painters, Ramesh Kumar has spent over 15 years perfecting the ancient art of Mithila painting. Each stroke in his work tells a story of Indian mythology, nature, and the rich cultural tapestry of Bihar.',
      bio_or: 'ପାରମ୍ପରିକ ମଧୁବନୀ ଚିତ୍ରକର ପରିବାରରେ ଜନ୍ମଗ୍ରହଣ କରିଥିବା ରମେଶ କୁମାର ମିଥିଳା ଚିତ୍ରକଳାର ପ୍ରାଚୀନ କଳାକୁ ସିଦ୍ଧ କରିବାରେ ୧୫ ବର୍ଷରୁ ଅଧିକ ସମୟ ଅତିବାହିତ କରିଛନ୍ତି | ତାଙ୍କ କାର୍ଯ୍ୟର ପ୍ରତ୍ୟେକ ସ୍ପର୍ଶ ଭାରତୀୟ ପୁରାଣ, ପ୍ରକୃତି ଏବଂ ସମୃଦ୍ଧ ସାଂସ୍କୃତିକ ଐତିହ୍ୟର ଏକ କାହାଣୀ କହେ |',
      philo: 'Art is not just a skill, it is a prayer to our ancestors.',
      philo_or: 'କଳା କେବଳ ଏକ ଦକ୍ଷତା ନୁହେଁ, ଏହା ଆମର ପୂର୍ବପୁରୁଷଙ୍କ ପାଇଁ ଏକ ପ୍ରାର୍ଥନା |'
    },
    'Sambalpuri Weaves': {
      name_or: 'ସମ୍ବଲପୁରୀ ବୁଣାକାର',
      location: 'Sambalpur, Odisha',
      location_or: 'ସମ୍ବଲପୁର, ଓଡ଼ିଶା',
      years: 25,
      bio: 'Master weavers of the famous Sambalpuri Ikat, preserving the tie-dye tradition for generations. Our sarees are entirely hand-woven using natural dyes and organic cotton.',
      bio_or: 'ପ୍ରସିଦ୍ଧ ସମ୍ବଲପୁରୀ ଇକାତର ମୁଖ୍ୟ ବୁଣାକାର, ପିଢ଼ି ପିଢ଼ି ଧରି ବାନ୍ଧକଳա ପରମ୍ପରାକୁ ବଞ୍ଚାଇ ରଖିଛନ୍ତି | ଆମର ଶାଢୀ ଗୁଡ଼ିକ ସମ୍ପୂର୍ଣ୍ଣ ରୂପେ ପ୍ରାକୃତିକ ରଙ୍ଗ ଏବଂ ଜୈବିକ କପା ବ୍ୟବହାର କରି ହାତରେ ବୁଣାଯାଇଛି |',
      philo: 'Every thread tells a story of patience and heritage.',
      philo_or: 'ପ୍ରତ୍ୟେକ ସୂତା ଧୈର୍ଯ୍ୟ ଏବଂ ଐତିହ୍ୟର ଏକ କାହାଣୀ କହେ |'
    }
  };

  const data = artisanData[seller] || {
    name_or: seller,
    location: 'Odisha, India',
    location_or: 'ଓଡ଼ିଶା, ଭାରତ',
    years: 5,
    bio: 'Dedicated artisan preserving Indian heritage through unique handmade creations and traditional techniques passed down through generations.',
    bio_or: 'ପିଢ଼ି ପିଢ଼ି ଧରି ଚାଲିଆସୁଥିବା ପାରମ୍ପରିକ କୌଶଳ ଏବଂ ଅନନ୍ୟ ହସ୍ତତନ୍ତ ସୃଷ୍ଟି ମାଧ୍ୟମରେ ଭାରତୀୟ ଐତିହ୍ୟକୁ ସଂରକ୍ଷଣ କରୁଥିବା ଏକ କାରିଗର |',
    philo: 'Crafting beauty with hands and soul to keep our culture alive.',
    philo_or: 'ଆମର ସଂସ୍କୃତିକୁ ଜୀବନ୍ତ ରଖିବା ପାଇଁ ହାତ ଏବଂ ଆତ୍ମା ସହିତ ସୌନ୍ଦର୍ଯ୍ୟ ଗଢ଼ିବା |'
  };

  const nameElem = document.getElementById('seller-profile-name');
  nameElem.innerText = (lang === 'or') ? data.name_or : seller;
  nameElem.setAttribute('data-raw-name', seller);
  
  const badgeContainer = document.getElementById('seller-badge-container');
  const yearsElem = document.getElementById('seller-years');
  const locationText = (lang === 'or') ? data.location_or : data.location;
  
  // UI Updates with Odia Support
  const t = translations[lang];
  const verifiedText = t.verified_master || "Verified Master Artisan";
  const yearsLabel = t.years_exp || "Years Experience";
  
  const badgePara = document.querySelector('.seller-badges');
  if(badgePara) {
    badgePara.innerHTML = `<i class="fa-solid fa-certificate"></i> ${verifiedText} • <i class="fa-solid fa-location-dot"></i> ${locationText}`;
  }
  
  if(yearsElem) yearsElem.innerHTML = `<b>${data.years}</b> ${yearsLabel}`;

  if(badgeContainer) {
    if(data.years >= 5) {
      badgeContainer.innerHTML = `<span class="artist-tag tag-pro"><i class="fa-solid fa-crown"></i> PRO</span>`;
    } else {
      badgeContainer.innerHTML = `<span class="artist-tag tag-beginner"><i class="fa-solid fa-leaf"></i> Rising</span>`;
    }
  }

  // Update bio and philosophy
  const bioTitle = document.querySelector('.about-text h3:first-child');
  const bioTexts = document.querySelectorAll('.about-text p');
  const philoTitle = document.querySelector('.about-text h3.mt-2');
  const philoText = document.querySelector('.about-text blockquote');
  
  if(bioTitle) bioTitle.innerText = t.history_of_craft;
  if(bioTexts[0]) bioTexts[0].innerText = (lang === 'or') ? data.bio_or : data.bio;
  if(bioTexts[1]) bioTexts[1].style.display = (lang === 'or') ? 'none' : 'block'; 
  
  if(philoTitle) philoTitle.innerText = t.artisan_philo;
  if(philoText) philoText.innerText = `"${(lang === 'or') ? data.philo_or : data.philo}"`;

  // Update tabs
  const tabShop = document.querySelector('.seller-tabs button:nth-child(1)');
  const tabHeritage = document.querySelector('.seller-tabs button:nth-child(2)');
  const tabReviews = document.querySelector('.seller-tabs button:nth-child(3)');
  
  if(tabShop) tabShop.innerText = t.profile_shop;
  if(tabHeritage) tabHeritage.innerText = t.profile_heritage;
  if(tabReviews) tabReviews.innerText = t.profile_reviews;

  // Filter products by this seller
  const sellerProducts = currentProducts.filter(p => {
    const pSeller = p.seller || 'Artisan Ramesh';
    return pSeller === seller;
  });
  renderProductsGrid(sellerProducts, 'seller-products-grid');
  
  showSection('seller-profile');
}

function switchSellerTab(tabName) {
  // Update buttons
  const tabs = document.querySelectorAll('.seller-tabs .tab');
  tabs.forEach(t => {
    t.classList.remove('active');
    if(t.innerText.toLowerCase().includes(tabName.toLowerCase())) t.classList.add('active');
  });
  
  // Update content
  const contents = document.querySelectorAll('.seller-tab-content');
  contents.forEach(c => c.classList.remove('active'));
  
  const targetId = `seller-${tabName}-tab`;
  const target = document.getElementById(targetId);
  if (target) target.classList.add('active');
}

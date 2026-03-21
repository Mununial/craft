// --- Unified Product Component ---

function getProductComponent(product) {
  const lang = localStorage.getItem('app-lang') || 'en';
  const displayTitle = (lang === 'or' && product.title_or) ? product.title_or : product.title;
  const displaySeller = (lang === 'or' && product.seller_or) ? product.seller_or : (product.seller || 'Artisan Name');
  const viewText = (lang === 'or') ? "ଦେଖନ୍ତୁ" : "View Details";
  const byText = (lang === 'or') ? "ଦ୍ଵାରା" : "by";
  
  const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : 'images/pots.jpg';
  
  return `
    <div class="product-card">
      <div class="img-wrapper">
        <img src="${imageUrl}" alt="${displayTitle}">
      </div>
      <div class="product-info">
        <h3>${displayTitle}</h3>
        <p>${byText} <strong onclick="event.stopPropagation(); openSellerProfile('${product.seller || 'Artisan Ramesh'}')" style="cursor:pointer; color:var(--primary-color);">${displaySeller}</strong></p>
        
        <div class="price-row">
          <span class="price">₹${parseFloat(product.price).toFixed(2)}</span>
          <span style="color:var(--secondary-color);"><i class="fa-solid fa-star"></i> ${product.rating || '4.5'}</span>
        </div>
        
        <div class="card-actions">
          <button class="btn-primary full-width" onclick="openProductDetail('${product.id}')">${viewText}</button>
          <div style="display:flex; gap:5px; width:100%;">
            <button class="btn-secondary" style="flex:1" onclick="addToWishlist('${product.id}')"><i class="fa-solid fa-heart"></i></button>
            <button class="btn-primary" style="flex:1" onclick="addToCart(event, '${product.id}')"><i class="fa-solid fa-cart-shopping"></i></button>
          </div>
        </div>
      </div>
    </div>
  `;
}

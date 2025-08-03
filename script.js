document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });

    // Also hide the header back button just in case
    const headerBackButton = document.getElementById("back-button");
    if (headerBackButton) {
        headerBackButton.style.display = "none";
    }
});


// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sample data
    initSampleData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load artworks
    loadArtworks();
    
    // Initialize scroll button
    initScrollButton();
});

// Initialize sample data
function initSampleData() {
    if (!localStorage.getItem('artworks')) {
        const sampleArtworks = [
            {
                id: 1,
                title: "Mona Lisa",
                artist: "Leonardo Da Vinci",
                year: 1503,
                size: "A2",
                price: 200000,
                description: "The Mona Lisa is a half-length portrait painting by Italian artist Leonardo da Vinci.",
                image: "https://cdn.britannica.com/24/189624-050-F3C5BAA9/Mona-Lisa-oil-wood-panel-Leonardo-da.jpg"
            },
            {
                id: 2,
                title: "Women with a parasol",
                artist: "Claude Monet",
                year: 1875,
                size: "A3",
                price: 100000,
                description: "High quality replica of the original artwork - captures every detail beautifully.",
                image: "https://cdn.britannica.com/17/193217-050-DF5BB2D1/Claude-Monet-Woman-Parasol-oil-canvas-Her-1875.jpg"
            },
            {
                id: 3,
                title: "The old guitarist",
                artist: "Pablo Picasso",
                year: 1903,
                size: "A3",
                price: 150000,
                description: "The Old Guitarist is an oil painting by Pablo Picasso created late 1903–early 1904.",
                image: "https://upload.wikimedia.org/wikipedia/en/b/bc/Old_guitarist_chicago.jpg"
            }
        ];
        localStorage.setItem('artworks', JSON.stringify(sampleArtworks));
    }
    
    if (!localStorage.getItem('carts')) {
        localStorage.setItem('carts', JSON.stringify({}));
    }
    
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('userProfile')) {
        const userProfile = {
            name: "Josh Smith",
            email: "joshsmith@gmail.com"
        };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
}

// Set up event listeners
function setupEventListeners() {
    // Cart link
    document.getElementById('nav-cart').addEventListener('click', function(e) {
        e.preventDefault();
        openCartModal();
    });
    
    // Profile link
    document.getElementById('nav-profile').addEventListener('click', function(e) {
        e.preventDefault();
        openProfilePage();
    });
    
    // Search functionality
    document.querySelector('.search-icon').addEventListener('click', searchArtworks);
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchArtworks();
    });
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Bank details modal
    document.getElementById('show-bank-details')?.addEventListener('click', function() {
        document.getElementById('bankDetailsModal').style.display = 'block';
    });
    
    // Cash on delivery button
    document.getElementById('cash-on-delivery')?.addEventListener('click', placeOrderWithCOD);
    
    // Continue shopping button
    document.getElementById('continue-shopping')?.addEventListener('click', closeAllModals);
    
    // Profile page buttons
    document.getElementById('edit-profile-page')?.addEventListener('click', openEditProfileModal);
    document.getElementById('favorite-list-page')?.addEventListener('click', openFavoritesModal);
    document.getElementById('order-history-page')?.addEventListener('click', openOrderHistoryModal);
    document.getElementById('logout-page')?.addEventListener('click', function() {
        if (confirm('Are you sure you want to log out?')) {
            alert('You have been logged out');
            closeAllModals();
        }
    });
}

// Initialize scroll button
function initScrollButton() {
    window.addEventListener('scroll', function() {
        const scrollButton = document.getElementById('scrollButton');
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'flex';
        } else {
            scrollButton.style.display = 'none';
        }
    });

    document.getElementById('scrollButton').addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Load artworks to the main page
function loadArtworks(filteredArtworks = null) {
    const artworks = filteredArtworks || JSON.parse(localStorage.getItem('artworks'));
    const artContainer = document.querySelector('.art-container');
    
    if (artContainer && artworks) {
        artContainer.innerHTML = '';
        
        artworks.forEach(artwork => {
            const artItem = document.createElement('div');
            artItem.className = 'art-item';
            artItem.innerHTML = `
                <img src="${artwork.image}" alt="${artwork.title}" class="art-image" onclick="viewArtwork(${artwork.id})">
                <h3 onclick="viewArtwork(${artwork.id})">${artwork.title}</h3>
                <p onclick="viewArtwork(${artwork.id})">${artwork.artist}</p>
                <div class="button-container">
                    <button class="buy-now" onclick="buyNow(${artwork.id})">Buy now</button>
                    <button class="add-cart" onclick="addToCart(${artwork.id}, 1)">Add cart</button>
                </div>
            `;
            artContainer.appendChild(artItem);
        });
    }
}

// Search artworks
function searchArtworks() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const artworks = JSON.parse(localStorage.getItem('artworks'));
    
    if (searchTerm) {
        const filtered = artworks.filter(artwork => 
            artwork.title.toLowerCase().includes(searchTerm) || 
            artwork.artist.toLowerCase().includes(searchTerm)
        );
        loadArtworks(filtered);
    } else {
        loadArtworks();
    }
}

// View artwork details
function viewArtwork(artworkId) {
    const artworks = JSON.parse(localStorage.getItem('artworks'));
    const artwork = artworks.find(a => a.id === artworkId);
    
    if (artwork) {
        document.getElementById('detail-art-image').src = artwork.image;
        document.getElementById('detail-art-title').textContent = artwork.title;
        document.getElementById('detail-art-artist').textContent = `Artist: ${artwork.artist}`;
        document.getElementById('detail-art-year').textContent = `Year: ${artwork.year}`;
        document.getElementById('detail-art-size').textContent = `Size: ${artwork.size}`;
        document.getElementById('detail-art-price').textContent = `Price: Rs.${artwork.price.toLocaleString()}`;
        document.getElementById('detail-art-description').textContent = artwork.description;
        
        // Set up buttons
        document.getElementById('detail-buy-now').onclick = function() {
            buyNow(artworkId);
        };
        
        document.getElementById('detail-add-cart').onclick = function() {
            addToCart(artworkId, 1);
        };
        
        // Open modal
        document.getElementById('artDetailModal').style.display = 'block';
    }
}

        
        // Open modal
        document.getElementById('artDetailModal').style.display = 'block';
    


function closeArtDetailModal() {
    document.getElementById('artDetailModal').style.display = 'none';
}

// Buy now function - directly proceed to checkout without showing details
function buyNow(artworkId) {
    // Clear current cart
    const carts = JSON.parse(localStorage.getItem('carts'));
    carts['guest'] = {};
    
    // Add the selected artwork to cart with quantity 1
    addToCart(artworkId, 1);
    
    // Immediately proceed to checkout
    placeOrderWithCOD();
}

function closeArtDetailModal() {
    document.getElementById('artDetailModal').style.display = 'none';
}

// Cart functions
function addToCart(artworkId, quantity) {
    const carts = JSON.parse(localStorage.getItem('carts'));
    const guestCart = carts['guest'] || {};
    const artworks = JSON.parse(localStorage.getItem('artworks'));
    const artwork = artworks.find(a => a.id === artworkId);
    
    if (guestCart[artworkId]) {
        guestCart[artworkId] += quantity;
    } else {
        guestCart[artworkId] = quantity;
    }
    
    carts['guest'] = guestCart;
    localStorage.setItem('carts', JSON.stringify(carts));
    
    // Update cart count in UI
    updateCartCount();
    
    // Show notification
    showNotification(`${artwork.title} added to cart!`);
}

function openCartModal() {
    const carts = JSON.parse(localStorage.getItem('carts'));
    const guestCart = carts['guest'] || {};
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartItems) {
        cartItems.innerHTML = '';
        
        let subtotal = 0;
        const artworks = JSON.parse(localStorage.getItem('artworks'));
        
        for (const artworkId in guestCart) {
            const artwork = artworks.find(a => a.id === parseInt(artworkId));
            if (artwork) {
                const quantity = guestCart[artworkId];
                const itemTotal = artwork.price * quantity;
                subtotal += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${artwork.image}" alt="${artwork.title}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${artwork.title}</div>
                        <div class="cart-item-artist">${artwork.artist}</div>
                        <div class="cart-item-price">Rs.${artwork.price.toLocaleString()}</div>
                        <div class="cart-item-quantity">
                            <button onclick="updateCartQuantity(${artwork.id}, -1)">-</button>
                            <span>${quantity}</span>
                            <button onclick="updateCartQuantity(${artwork.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${artwork.id})">Remove</button>
                `;
                cartItems.appendChild(cartItem);
            }
        }
        
        const shippingFee = 350;
        const total = subtotal + shippingFee;
        
        cartSubtotal.textContent = `Rs.${subtotal.toLocaleString()}`;
        cartTotal.innerHTML = `<strong>Rs.${total.toLocaleString()}</strong>`;
        
        if (Object.keys(guestCart).length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
        }
    }
    
    document.getElementById('cartModal').style.display = 'block';
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

function updateCartQuantity(artworkId, change) {
    const carts = JSON.parse(localStorage.getItem('carts'));
    const guestCart = carts['guest'] || {};
    
    if (guestCart[artworkId]) {
        guestCart[artworkId] += change;
        
        if (guestCart[artworkId] <= 0) {
            delete guestCart[artworkId];
        }
    }
    
    carts['guest'] = guestCart;
    localStorage.setItem('carts', JSON.stringify(carts));
    
    openCartModal();
    updateCartCount();
}

function removeFromCart(artworkId) {
    const carts = JSON.parse(localStorage.getItem('carts'));
    const guestCart = carts['guest'] || {};
    
    delete guestCart[artworkId];
    carts['guest'] = guestCart;
    localStorage.setItem('carts', JSON.stringify(carts));
    
    openCartModal();
    updateCartCount();
}

function updateCartCount() {
    const carts = JSON.parse(localStorage.getItem('carts'));
    const guestCart = carts['guest'] || {};
    const cartCount = Object.keys(guestCart).length;
    
    const cartSpan = document.querySelector('.cart-link span');
    if (cartCount > 0) {
        cartSpan.textContent = `Cart (${cartCount})`;
    } else {
        cartSpan.textContent = 'Cart';
    }
}

// Place order with Cash on Delivery
function placeOrderWithCOD() {
    const carts = JSON.parse(localStorage.getItem('carts'));
    const guestCart = carts['guest'] || {};
    
    if (Object.keys(guestCart).length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const artworks = JSON.parse(localStorage.getItem('artworks'));
    let subtotal = 0;
    const orderItems = [];
    
    for (const artworkId in guestCart) {
        const artwork = artworks.find(a => a.id === parseInt(artworkId));
        if (artwork) {
            const quantity = guestCart[artworkId];
            const itemTotal = artwork.price * quantity;
            subtotal += itemTotal;
            
            orderItems.push({
                artworkId: artwork.id,
                title: artwork.title,
                quantity,
                price: artwork.price
            });
        }
    }
    
    const shippingFee = 350;
    const total = subtotal + shippingFee;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const newOrder = {
        id: orders.length + 1,
        items: orderItems,
        date: new Date().toISOString(),
        paymentMethod: 'Cash on Delivery',
        subtotal,
        shippingFee,
        total,
        status: 'Pending'
    };
    
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    delete carts['guest'];
    localStorage.setItem('carts', JSON.stringify(carts));
    updateCartCount();
    
    closeAllModals();
    showThankYouNotification(newOrder);
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Bank Details Modal functions
function closeBankDetailsModal() {
    document.getElementById('bankDetailsModal').style.display = 'none';
    openCartModal(); // Open cart modal after closing bank details
}

// Profile functions
function openProfilePage() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    
    if (userProfile) {
        document.getElementById('profile-page-name').textContent = userProfile.name;
        document.getElementById('profile-page-email').textContent = userProfile.email;
    }
    
    document.getElementById('profilePageModal').style.display = 'block';
}

function openEditProfileModal() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    
    if (userProfile) {
        document.getElementById('edit-name').value = userProfile.name;
        document.getElementById('edit-email').value = userProfile.email;
    }
    
    document.getElementById('editProfileModal').style.display = 'block';
}

// Function to close profile page modal
function closeProfilePage() {
    document.getElementById('profilePageModal').style.display = 'none';
}

// Modified openProfilePage function with back button support
function openProfilePage() {
    // Close any other open modals first
    closeAllModals();
    
    // Load user profile data
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
        name: "Josh Smith",
        email: "joshsmith@gmail.com"
    };
    
    // Update profile information in the modal
    document.getElementById('profile-page-name').textContent = userProfile.name;
    document.getElementById('profile-page-email').textContent = userProfile.email;
    
    // Set up back button
    const backButton = document.querySelector('#profilePageModal .modal-back-button');
    backButton.onclick = closeProfilePage;
    
    // Set up profile action buttons
    document.getElementById('edit-profile-page').onclick = openEditProfileModal;
    document.getElementById('favorite-list-page').onclick = openFavoritesModal;
    document.getElementById('order-history-page').onclick = openOrderHistoryModal;
    document.getElementById('logout-page').onclick = function() {
        if (confirm('Are you sure you want to log out?')) {
            alert('You have been logged out');
            closeProfilePage();
        }
    };
    
    // Show the profile modal
    document.getElementById('profilePageModal').style.display = 'block';
}

// Bank Details Modal back button function (unchanged)
function closeBankDetailsModal() {
    document.getElementById('bankDetailsModal').style.display = 'none';
    openCartModal(); // Open cart modal after closing bank details
}

// Art Detail Modal back button function (unchanged)
function closeArtDetailModal() {
    document.getElementById('artDetailModal').style.display = 'none';
}

// Cart Modal back button function (unchanged)
function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

// Generic function to close all modals (unchanged)
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function openFavoritesModal() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const artworks = JSON.parse(localStorage.getItem('artworks'));
    const favoritesContainer = document.getElementById('favorites-container');
    
    favoritesContainer.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>You have no favorites yet</p>';
    } else {
        favorites.forEach(artworkId => {
            const artwork = artworks.find(a => a.id === artworkId);
            if (artwork) {
                const favoriteItem = document.createElement('div');
                favoriteItem.className = 'favorite-item';
                favoriteItem.innerHTML = `
                    <img src="${artwork.image}" alt="${artwork.title}">
                    <div class="favorite-info">
                        <h4>${artwork.title}</h4>
                        <p>${artwork.artist}</p>
                        <p>Rs.${artwork.price.toLocaleString()}</p>
                    </div>
                `;
                favoritesContainer.appendChild(favoriteItem);
            }
        });
    }
    
    document.getElementById('favoritesModal').style.display = 'block';
}

function openOrderHistoryModal() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersContainer = document.getElementById('orders-container');
    
    ordersContainer.innerHTML = '';
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>You have no orders yet</p>';
    } else {
        orders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            
            let itemsHtml = '';
            order.items.forEach(item => {
                itemsHtml += `
                    <div class="order-item-row">
                        <span>${item.title} (x${item.quantity})</span>
                        <span>Rs.${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                `;
            });
            
            orderItem.innerHTML = `
                <div class="order-header">
                    <div>
                        <span class="order-id">Order #${order.id}</span>
                        <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-items">
                    ${itemsHtml}
                </div>
                <div class="order-total">
                    Total: Rs.${order.total.toLocaleString()}
                </div>
            `;
            
            ordersContainer.appendChild(orderItem);
        });
    }
    
    document.getElementById('orderHistoryModal').style.display = 'block';
}

// Notification functions
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    notification.className = 'notification';
    notification.classList.add(type);
    notification.classList.add('show');
    notificationMessage.textContent = message;
    
    const icon = notification.querySelector('i');
    icon.className = 'fas ' + 
        (type === 'success' ? 'fa-check-circle' : 
         type === 'error' ? 'fa-times-circle' : 
         'fa-exclamation-circle');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showThankYouNotification(order) {
    const orderDetails = document.getElementById('order-details');
    orderDetails.innerHTML = '';
    
    let subtotal = 0;
    
    order.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <span>${item.title} (x${item.quantity})</span>
            <span>Rs.${itemTotal.toLocaleString()}</span>
        `;
        orderDetails.appendChild(itemElement);
    });
    
    orderDetails.innerHTML += `
        <div class="order-item">
            <span>Shipping Fee</span>
            <span>Rs.${order.shippingFee.toLocaleString()}</span>
        </div>
        <div class="order-total">
            <span>Total:</span>
            <span>Rs.${order.total.toLocaleString()}</span>
        </div>
    `;
    
    document.getElementById('thankYouNotification').classList.add('show');
}

function closeThankYouNotification() {
    document.getElementById('thankYouNotification').classList.remove('show');
}
document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const overlay = document.querySelector('.overlay');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.total-price');
    const cartCount = document.querySelector('.cart-count');
    const contactForm = document.getElementById('contact-form');
    
    let cart = [];
    
    // Menu Toggle
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    // Cart Toggle
    cartIcon.addEventListener('click', function() {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    overlay.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Add to Cart
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            
            addToCart(id, name, price);
        });
    });
    
    function addToCart(id, name, price) {
        // Check if item already in cart
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                quantity: 1
            });
        }
        
        updateCart();
        
        // Show cart sidebar
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    }
    
    function updateCart() {
        // Update cart items display
        cartItemsContainer.innerHTML = '';
        
        let total = 0;
        
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            
            cartItemElement.innerHTML = `
                <img src="https://via.placeholder.com/60" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <i class="fas fa-times cart-item-remove" data-id="${item.id}"></i>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
            
            // Add to total
            total += item.price * item.quantity;
        });
        
        // Update total
        cartTotal.textContent = `$${total.toFixed(2)}`;
        
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.cart-item-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const idToRemove = button.getAttribute('data-id');
                removeFromCart(idToRemove);
            });
        });
    }
    
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }
    
    // Contact Form Submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the form data to a server
        console.log('Form submitted:', { name, email, message });
        
        // Show success message
        alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
        
        // Reset form
        contactForm.reset();
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                nav.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });
    
    // Initialize cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
    
    // Save cart to localStorage before page unload
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('cart', JSON.stringify(cart));
    });
});
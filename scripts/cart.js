/**
 * Cart Management System
 * Handles shopping cart functionality including:
 * - Adding/removing items
 * - Updating quantities
 * - Persistent storage using localStorage
 * - Cart UI updates and animations
 */

// Cart management class
class CartManager {
    constructor() {
        this.cart = [];
        this.loadCart();
        this.initializeListeners();
        this.setupAutoSave();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('cart');
        this.cart = savedCart ? JSON.parse(savedCart) : [];
        this.updateCartDisplay();
    }

    setupAutoSave() {
        // Auto-save cart every 30 seconds
        setInterval(() => this.saveCart(), 30000);
    }

    // Add item to cart with animation
    addItem(item) {
        const existingItem = this.cart.find(i => i.name === item.name);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            item.quantity = 1;
            this.cart.push(item);
        }
        this.saveCart();
        this.updateCartDisplay();
        this.animateCartIcon();
    }

    // Remove item from cart
    removeItem(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartDisplay();
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartDisplay() {
        const cartIcon = document.querySelector('.cart-icon');
        const cartItems = document.getElementById('cart-items');
        const hasItems = this.cart.length > 0;

        if (cartIcon) {
            cartIcon.setAttribute('data-count', this.getTotalItems());
        }

        if (cartItems) {
            cartItems.innerHTML = hasItems
                ? `<div class="cart-header">
                    <span class="cart-title">Shopping Cart (${this.getTotalItems()} items)</span>
                   </div>
                   ${this.cart.map((item, index) => `
                       <li class="cart-item">
                           <span>${item.name}</span>
                           <div class="cart-item-quantity">
                               <button class="quantity-btn decrease" data-index="${index}">-</button>
                               <span>${item.quantity}</span>
                               <button class="quantity-btn increase" data-index="${index}">+</button>
                           </div>
                           <div class="cart-item-actions">
                               <span>$${(item.price * item.quantity).toFixed(2)}</span>
                               <button class="remove-item" data-index="${index}">×</button>
                           </div>
                       </li>
                   `).join('')}
                   <div class="cart-actions">
                       <div class="total">Total: $${this.getTotal().toFixed(2)}</div>
                       <button class="cart-action-btn clear-cart">Clear Cart</button>
                       <button class="cart-action-btn proceed-to-checkout">Checkout</button>
                   </div>`
                : '<p class="cart-empty">Your cart is empty</p>';
        }
    }

    getTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getTotalItems() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Animate cart icon when adding items
    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        cartIcon.classList.add('flash');
        setTimeout(() => cartIcon.classList.remove('flash'), 300);
    }

    // Optimize event listeners
    initializeListeners() {
        document.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(e) {
        const target = e.target;
        
        // Prevent event bubbling for cart interactions
        if (target.closest('.cart-popup')) {
            e.stopPropagation();
            
            // Handle quantity buttons and remove button clicks
            if (target.closest('.quantity-btn') || target.closest('.remove-item')) {
                const button = target.closest('.quantity-btn') || target.closest('.remove-item');
                const index = parseInt(button.dataset.index);
                
                if (button.classList.contains('increase')) {
                    this.updateQuantity(index, 1);
                } else if (button.classList.contains('decrease')) {
                    this.updateQuantity(index, -1);
                } else if (button.classList.contains('remove-item')) {
                    this.removeItem(index);
                }
                
                // Prevent any parent handlers from being triggered
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        }
        
        // Use delegation instead of multiple event listeners
        if (target.closest('.cart-popup') || target.closest('.cart-icon')) {
            e.stopPropagation();
        }

        if (target.classList.contains('add-to-cart')) {
            this.handleAddToCart(target);
        }

        if (target.closest('.remove-item')) {
            e.stopPropagation();
            this.handleRemoveItem(target.closest('.remove-item'));
        }

        if (target.classList.contains('clear-cart')) {
            this.handleClearCart();
        }

        if (target.classList.contains('proceed-to-checkout') || target.classList.contains('buy-now')) {
            alert('Checkout functionality coming soon!');
        }

        if (target.classList.contains('quantity-btn')) {
            e.stopPropagation();
            const index = parseInt(target.dataset.index);
            if (target.classList.contains('increase')) {
                this.updateQuantity(index, 1);
            } else if (target.classList.contains('decrease')) {
                this.updateQuantity(index, -1);
            }
        }
    }

    // Split handlers for better organization
    handleAddToCart(target) {
        const product = target.closest('.product');
        if (product) {
            const name = product.querySelector('h2').textContent;
            const price = parseFloat(product.querySelector('.price').textContent.replace('$', ''));
            this.addItem({ name, price });
        }
    }

    handleRemoveItem(target) {
        const index = parseInt(target.dataset.index);
        if (!isNaN(index)) {
            this.removeItem(index);
        }
    }

    handleClearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    updateQuantity(index, change) {
        const item = this.cart[index];
        if (item) {
            const newQuantity = Math.max(1, (item.quantity || 1) + change);
            
            if (newQuantity === item.quantity && change < 0) {
                return;
            }
            
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }
}

// The cart automatically saves every 30 seconds and on page unload
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});

// This file contains JavaScript functionality for the store website, including "Add to Cart" functionality and other interactive features.

console.log('main.js loaded successfully.');

/**
 * Main Application Logic
 * Handles:
 * - Event listeners and delegation
 * - Form submissions and validation
 * - Image error handling and fallbacks
 * - Performance optimizations (lazy loading, scroll handling)
 * - UI interactions (cart toggle, buy now functionality)
 */

// Main application functionality
class App {
    constructor() {
        this.initializeEventListeners();
        this.handleImageErrors();
        this.initializeLoadingStates();
        this.optimizeScrolling();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Use event delegation instead of multiple listeners
        document.addEventListener('click', this.handleGlobalClick.bind(this), true);
        
        // Handle form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', this.handleFormSubmission.bind(this));
        });
    }

    handleGlobalClick(e) {
        const target = e.target;
        
        // Don't close cart if user clicks inside it
        if (target.closest('.cart-popup')) {
            return;
        }

        // Handle cart icon click
        if (target.closest('.cart-icon')) {
            this.toggleCart();
            e.stopPropagation();
            return;
        }

        // Handle cart popup close
        if (!target.closest('.cart-popup') && !target.closest('.cart-icon')) {
            this.closeCart();
        }

        // Handle buy now button
        if (target.classList.contains('buy-now')) {
            e.preventDefault();
            this.handleBuyNow(e);
        }
    }

    toggleCart() {
        const cartPopup = document.querySelector('.cart-popup');
        if (cartPopup) {
            cartPopup.style.display = cartPopup.style.display === 'block' ? 'none' : 'block';
        }
    }

    closeCart() {
        const cartPopup = document.querySelector('.cart-popup');
        if (cartPopup) {
            cartPopup.style.display = 'none';
        }
    }

    // Handle form submissions
    handleFormSubmission(e) {
        e.preventDefault();
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        
        submitButton.classList.add('loading-state');
        form.classList.add('processing');

        // Simulate form submission
        setTimeout(() => {
            submitButton.classList.remove('loading-state');
            form.classList.remove('processing');
            form.reset();
        }, 1000);
    }

    // Handle buy now clicks
    handleBuyNow(e) {
        e.preventDefault();
        alert('Checkout functionality coming soon!');
    }

    // Handle image loading errors
    handleImageErrors() {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', (e) => {
                const container = img.closest('.product-image-container');
                if (container) {
                    container.classList.add('no-image');
                    img.style.display = 'none';
                    if (!container.querySelector('.no-image-text')) {
                        const noImageText = document.createElement('div');
                        noImageText.className = 'no-image-text';
                        noImageText.textContent = 'Image not available';
                        container.appendChild(noImageText);
                    }
                }
            });
        });
    }

    // Initialize loading states
    initializeLoadingStates() {
        // Add loading animation to buttons when clicked
        document.querySelectorAll('.button').forEach(button => {
            button.addEventListener('click', () => {
                button.classList.add('loading');
                setTimeout(() => button.classList.remove('loading'), 500);
            });
        });
    }

    optimizeScrolling() {
        // Debounce scroll events
        let ticking = false;
        document.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Handle scroll updates here if needed
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Use Intersection Observer for lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.product').forEach(product => {
            observer.observe(product);
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
'use strict'

// Main Favorites Module
const FavoritesManager = {
    // Initialize the favorites functionality
    init: function() {
        this.bindFavoriteButtons()
        this.bindRemoveButtons()
    },

    // Bind click events to favorite buttons
    bindFavoriteButtons: function() {
        document.addEventListener('click', async (e) => {
            if (e.target.matches('.favorite-btn')) {
                e.preventDefault()
                const button = e.target
                const invId = button.dataset.invId
                const action = button.dataset.action

                if (action === 'login') {
                    this.showLoginNotification()
                    return
                }

                try {
                    button.disabled = true // Prevent double clicks
                    if (action === 'add') {
                        await this.addFavorite(invId, button)
                    } else if (action === 'remove') {
                        await this.removeFavorite(invId, button)
                    }
                } catch (error) {
                    console.error('Favorite action failed:', error)
                    this.showError(error.message || 'Failed to update favorite status. Please try again.')
                } finally {
                    button.disabled = false
                }
            }
        })
    },

    // Bind events to remove buttons (on favorites page)
    bindRemoveButtons: function() {
        const favoritesGrid = document.querySelector('.favorites-grid')
        if (!favoritesGrid) return // Exit if not on favorites page

        favoritesGrid.addEventListener('click', async (e) => {
            if (e.target.matches('.remove-favorite')) {
                e.preventDefault()
                const button = e.target
                const invId = button.dataset.invId
                const card = button.closest('.favorite-card')

                try {
                    button.disabled = true // Prevent double clicks
                    await this.removeFavorite(invId)
                    
                    // Animate and remove the card
                    card.style.opacity = '0'
                    card.style.transform = 'translateX(100%)'
                    
                    setTimeout(() => {
                        card.remove()
                        this.checkEmptyFavorites()
                    }, 300)
                } catch (error) {
                    console.error('Remove favorite failed:', error)
                    this.showError(error.message || 'Failed to remove favorite. Please try again.')
                } finally {
                    button.disabled = false
                }
            }
        })
    },

    // Add a favorite
    addFavorite: async function(invId, button) {
        const response = await fetch(`/favorites/add/${invId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data.message || 'Failed to add favorite')
        }

        const data = await response.json()
        
        // Update button state
        button.dataset.action = 'remove'
        button.classList.add('favorited')
        button.textContent = '♥ Favorited'
        button.title = 'Remove from favorites'
        
        this.showSuccess('Vehicle added to favorites')
    },

    // Remove a favorite
    removeFavorite: async function(invId, button = null) {
        const response = await fetch(`/favorites/remove/${invId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data.message || 'Failed to remove favorite')
        }

        const data = await response.json()

        // Update button state if provided
        if (button) {
            button.dataset.action = 'add'
            button.classList.remove('favorited')
            button.textContent = '♡ Favorite'
            button.title = 'Add to favorites'
        }
        
        this.showSuccess('Vehicle removed from favorites')
    },

    // Check if favorites page is empty
    checkEmptyFavorites: function() {
        const favoritesGrid = document.querySelector('.favorites-grid')
        if (favoritesGrid && !favoritesGrid.children.length) {
            const wrapper = document.getElementById('favorites-wrapper')
            if (wrapper) {
                wrapper.innerHTML = `
                    <div class="no-favorites">
                        <p>You haven't added any vehicles to your favorites yet.</p>
                        <a href="/inv" class="browse-inventory">Browse Inventory</a>
                    </div>
                `
            }
        }
    },

    // Show success message
    showSuccess: function(message) {
        const notification = document.createElement('div')
        notification.className = 'success-notification'
        notification.textContent = message
        document.body.appendChild(notification)
        
        setTimeout(() => {
            notification.remove()
        }, 3000)
    },

    // Show error message
    showError: function(message) {
        const notification = document.createElement('div')
        notification.className = 'error-notification'
        notification.textContent = message
        document.body.appendChild(notification)
        
        setTimeout(() => {
            notification.remove()
        }, 5000)
    },

    // Show login notification popup
    showLoginNotification: function() {
        const notification = document.createElement('div')
        notification.className = 'login-notification'
        notification.innerHTML = `
            <p>Please log in to add vehicles to your favorites.</p>
            <div class="actions">
                <button class="dismiss-btn">Dismiss</button>
                <button class="login-btn">Log In</button>
            </div>
        `

        document.body.appendChild(notification)

        notification.querySelector('.dismiss-btn').addEventListener('click', () => {
            notification.remove()
        })

        notification.querySelector('.login-btn').addEventListener('click', () => {
            window.location.href = '/account/login'
        })

        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove()
            }
        }, 5000)
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    FavoritesManager.init()
})
describe('Shopping Cart Tests', () => {
    
    beforeEach(async () => {
        // Navigate to Sauce Demo
        await browser.url('https://www.saucedemo.com/');
        
        // Login
        await $('#user-name').setValue('standard_user');
        await $('#password').setValue('secret_sauce');
        await $('#login-button').click();
        
        // CRITICAL: Wait for the actual product buttons to load, not just the container
        await browser.waitUntil(
            async () => {
                const buttons = await $$('button[data-test^="add-to-cart"]');
                return buttons.length > 0;
            },
            {
                timeout: 10000,
                timeoutMsg: 'Add to cart buttons never appeared on page'
            }
        );
        
        // Extra pause to ensure everything is stable
        await browser.pause(1000);
    });

    // ============ POSITIVE TESTS ============
    
    it('POSITIVE: Should add item to cart and display badge with count', async () => {
        // Click Add to cart button (no waitForDisplayed needed - beforeEach ensures it exists)
        const addButton = await $('button[data-test="add-to-cart-sauce-labs-bike-light"]');
        await addButton.click();
        await browser.pause(500);
        
        // Check cart badge
        const cartBadge = await $('.shopping_cart_badge');
        const badgeText = await cartBadge.getText();
        expect(badgeText).toBe('1');
        
        console.log('✓ POSITIVE TEST PASSED: Item added to cart!');
    });

    it('POSITIVE: Should display added item on cart page', async () => {
        // Add item to cart
        const addButton = await $('button[data-test="add-to-cart-sauce-labs-bike-light"]');
        await addButton.click();
        await browser.pause(500);
        
        // Click shopping cart
        const cartLink = await $('.shopping_cart_link');
        await cartLink.click();
        await browser.pause(1000);
        
        // Verify we're on cart page
        const pageTitle = await $('.title');
        const titleText = await pageTitle.getText();
        expect(titleText).toBe('Your Cart');
        
        // Verify item is in cart
        const cartItems = await $$('.cart_item');
        expect(cartItems.length).toBeGreaterThan(0);
        
        console.log('✓ POSITIVE TEST PASSED: Cart displays item!');
    });

    it('POSITIVE: Should add multiple items and update badge count', async () => {
        // Add first item
        const firstButton = await $('button[data-test="add-to-cart-sauce-labs-bike-light"]');
        await firstButton.click();
        await browser.pause(300);
        
        // Add second item
        const secondButton = await $('button[data-test="add-to-cart-sauce-labs-bike-light"]');
        await secondButton.click();
        await browser.pause(500);
        
        // Check badge
        const cartBadge = await $('.shopping_cart_badge');
        const badgeText = await cartBadge.getText();
        expect(badgeText).toBe('2');
        
        console.log('✓ POSITIVE TEST PASSED: Multiple items added!');
    });

    it('POSITIVE: Should remove item from cart', async () => {
        // Add item
        const addButton = await $('button[data-test="add-to-cart-sauce-labs-bike-light"]');
        await addButton.click();
        await browser.pause(500);
        
        // Go to cart
        const cartLink = await $('.shopping_cart_link');
        await cartLink.click();
        await browser.pause(1000);
        
        // Remove item
        const removeButton = await $('button[data-test="remove-sauce-labs-bike-light"]');
        await removeButton.click();
        await browser.pause(500);
        
        // Check badge is gone
        const cartBadgeExists = await $('.shopping_cart_badge').isDisplayed().catch(() => false);
        expect(cartBadgeExists).toBe(false);
        
        console.log('✓ POSITIVE TEST PASSED: Item removed!');
    });

    // ============ NEGATIVE TESTS ============
    
    it('NEGATIVE: Should show empty cart when no items added', async () => {
        // This test starts fresh from beforeEach with empty cart
        // Go to cart without adding anything
        const cartLink = await $('.shopping_cart_link');
        await cartLink.click();
        await browser.pause(1000);
        
        // Verify cart is empty
        const cartItems = await $$('.cart_item');
        expect(cartItems.length).toBe(0);
        
        console.log('✓ NEGATIVE TEST PASSED: Empty cart works!');
    });

    it('NEGATIVE: Should not display cart badge when cart is empty', async () => {
        // This test starts fresh from beforeEach with empty cart
        // Check if badge exists - should be false with fresh login
        const cartBadgeExists = await $('.shopping_cart_badge').isDisplayed().catch(() => false);
        expect(cartBadgeExists).toBe(false);
        
        console.log('✓ NEGATIVE TEST PASSED: No badge when empty!');
    });

});
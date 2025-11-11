describe('Additional Feature Tests', () => {
    
    beforeEach(async () => {
        // Navigate and login
        await browser.url('https://www.saucedemo.com/');
        await $('#user-name').setValue('standard_user');
        await $('#password').setValue('secret_sauce');
        await $('#login-button').click();
        
        // Wait for products to load
        await browser.waitUntil(
            async () => {
                const buttons = await $$('button[data-test^="add-to-cart"]');
                return buttons.length > 0;
            },
            { timeout: 10000 }
        );
        await browser.pause(1000);
    });

    // ============ CART PAGE BUTTON TESTS ============
    
    describe('Cart Page Buttons', () => {
        
        it('POSITIVE: Continue Shopping button should return to products page', async () => {
            // Add item and go to cart
            await $('button[data-test="add-to-cart-sauce-labs-backpack"]').click();
            await $('.shopping_cart_link').click();
            await browser.pause(1000);
            
            // Click Continue Shopping
            const continueButton = await $('[data-test="continue-shopping"]');
            await continueButton.click();
            await browser.pause(1000);
            
            // Verify we're back on products page
            const currentUrl = await browser.getUrl();
            expect(currentUrl).toContain('inventory.html');
            
            console.log('✓ Continue Shopping button works!');
        });

        it('POSITIVE: Checkout button should go to checkout page', async () => {
            // Add item and go to cart
            await $('button[data-test="add-to-cart-sauce-labs-backpack"]').click();
            await $('.shopping_cart_link').click();
            await browser.pause(1000);
            
            // Click Checkout
            const checkoutButton = await $('[data-test="checkout"]');
            await checkoutButton.click();
            await browser.pause(1000);
            
            // Verify we're on checkout page
            const currentUrl = await browser.getUrl();
            expect(currentUrl).toContain('checkout-step-one');
            
            console.log('✓ Checkout button works!');
        });

        it('POSITIVE: Remove button should remove item from cart', async () => {
            // Add item and go to cart
            await $('button[data-test="add-to-cart-sauce-labs-backpack"]').click();
            await $('.shopping_cart_link').click();
            await browser.pause(1000);
            
            // Remove the item
            const removeButton = await $('button[data-test="remove-sauce-labs-backpack"]');
            await removeButton.click();
            await browser.pause(500);
            
            // Verify cart is empty
            const cartItems = await $$('.cart_item');
            expect(cartItems.length).toBe(0);
            
            console.log('✓ Remove button works in cart!');
        });
    });

    // ============ ITEM TITLE LINK TESTS ============
    
    describe('Item Title Links', () => {
        
        it('POSITIVE: Clicking item title in cart should go to product detail', async () => {
            // Add item and go to cart
            await $('button[data-test="add-to-cart-sauce-labs-backpack"]').click();
            await $('.shopping_cart_link').click();
            await browser.pause(1000);
            
            // Click on item title
            const itemTitle = await $('.inventory_item_name');
            await itemTitle.click();
            await browser.pause(1000);
            
            // Verify we're on product detail page
            const currentUrl = await browser.getUrl();
            expect(currentUrl).toContain('inventory-item.html');
            
            // Verify product name is displayed
            const productName = await $('.inventory_details_name');
            await expect(productName).toHaveText('Sauce Labs Backpack');
            
            console.log('✓ Item title link works!');
        });

        it('POSITIVE: Clicking item title on products page should go to detail', async () => {
            // Click on first product title
            const productTitle = await $('#item_4_title_link');
            await productTitle.click();
            await browser.pause(1000);
            
            // Verify we're on product detail page
            const currentUrl = await browser.getUrl();
            expect(currentUrl).toContain('inventory-item.html?id=4');
            
            console.log('✓ Product title link works from products page!');
        });
    });

    // ============ HAMBURGER MENU TESTS ============
    
    describe('Hamburger Menu Options', () => {
        
        it('POSITIVE: All Items link should show all products', async () => {
            // Open hamburger menu
            await $('#react-burger-menu-btn').click();
            await browser.pause(500);
            
            // Click All Items
            const allItemsLink = await $('#inventory_sidebar_link');
            await allItemsLink.click();
            await browser.pause(1000);
            
            // Verify we're on inventory page
            const currentUrl = await browser.getUrl();
            expect(currentUrl).toContain('inventory.html');
            
            // Verify products are displayed
            const products = await $$('.inventory_item');
            expect(products.length).toBeGreaterThan(0);
            
            console.log('✓ All Items menu option works!');
        });

        it('POSITIVE: About link should go to Sauce Labs website', async () => {
            // Open hamburger menu
            await $('#react-burger-menu-btn').click();
            await browser.pause(500);
            
            // Click About
            const aboutLink = await $('#about_sidebar_link');
            await aboutLink.click();
            await browser.pause(2000);
            
            // Verify URL changed to saucelabs.com
            const currentUrl = await browser.getUrl();
            expect(currentUrl).toContain('saucelabs.com');
            
            console.log('✓ About menu option works!');
        });

        it('POSITIVE: Logout should return to login page', async () => {
            // Open hamburger menu
            await $('#react-burger-menu-btn').click();
            await browser.pause(500);
            
            // Click Logout
            const logoutLink = await $('#logout_sidebar_link');
            await logoutLink.click();
            await browser.pause(1000);
            
            // Verify we're on login page
            const loginButton = await $('#login-button');
            await expect(loginButton).toBeDisplayed();
            
            const currentUrl = await browser.getUrl();
            expect(currentUrl).not.toContain('inventory');
            
            console.log('✓ Logout menu option works!');
        });

        it('POSITIVE: Reset App State should clear cart', async () => {
            // Add items to cart
            await $('button[data-test="add-to-cart-sauce-labs-backpack"]').click();
            await $('button[data-test="add-to-cart-sauce-labs-bike-light"]').click();
            await browser.pause(500);
            
            // Verify cart has items
            const cartBadge = await $('.shopping_cart_badge');
            const badgeText = await cartBadge.getText();
            expect(badgeText).toBe('2');
            
            // Open hamburger menu
            await $('#react-burger-menu-btn').click();
            await browser.pause(500);
            
            // Click Reset App State
            const resetLink = await $('#reset_sidebar_link');
            await resetLink.click();
            await browser.pause(500);
            
            // Close menu
            const closeButton = await $('#react-burger-cross-btn');
            await closeButton.click();
            await browser.pause(500);
            
            // Verify cart badge is gone
            const badgeExists = await $('.shopping_cart_badge').isDisplayed().catch(() => false);
            expect(badgeExists).toBe(false);
            
            console.log('✓ Reset App State menu option works!');
        });

        it('NEGATIVE: Hamburger menu should close when X is clicked', async () => {
            // Open hamburger menu
            await $('#react-burger-menu-btn').click();
            await browser.pause(500);
            
            // Verify menu is visible
            const menu = await $('.bm-menu');
            await expect(menu).toBeDisplayed();
            
            // Click X to close
            const closeButton = await $('#react-burger-cross-btn');
            await closeButton.click();
            await browser.pause(500);
            
            // Verify menu is hidden
            const menuHidden = await menu.getAttribute('aria-hidden');
            expect(menuHidden).toBe('true');
            
            console.log('✓ Hamburger menu close button works!');
        });
    });

});
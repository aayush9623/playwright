const { test,expect } = require('@playwright/test');


require('@playwright/test')

test("Network security test", async ({ page }) => {
    const userName = page.locator('#userEmail')
    const password = page.locator('#userPassword')
    const loginButton = page.locator('#login')
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
    console.log(await page.title());
    await expect(page).toHaveTitle("Let's Shop")
    await userName.fill("lillyjohn@gmail.com");
    await password.fill("Learning@1");
    await loginButton.click();


    //console.log(await page.locator('.card-body b').first().textContent());
    //to wait until the DOM is loaded we can make use of the below method to wait until the network calls are made 
    await page.waitForLoadState('networkidle');
    //OR
    //this can also be used to synchronised wait 
    await page.locator('.card-body b').first().waitFor()

    //before sending it to server it was tweaked 
        await page.locator("button[routerlink*='myorders']").click();
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=7960eae1c941646b7a8b357" }));
    await page.locator("button:has-text('View')").first().click();
    //await page.pause();
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
})
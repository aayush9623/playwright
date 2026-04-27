
const {test, expect} = require('@playwright/test');
let webContext;
test.beforeAll(async({browser})=>{
    const context = await browser.newContext(); 
    const page = await context.newPage();
    const userName = page.locator('#userEmail')
    const password = page.locator('#userPassword')
    const loginButton = page.locator('#login')
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
    await userName.fill("lillyjohn@gmail.com");
    await password.fill("Learning@1");
    await loginButton.click();
    await page.waitForLoadState('networkidle');
    await context.storageState({path:'state.json'})
    webContext = await browser.newContext({storageState:'state.json'})
})


test('first playwright test browser session',async ()=>{
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
    const products = page.locator('.card-body')
    const productName = "ZARA COAT 3"
    const email="lillyjohn@gmail.com"

    //OR
    //this can also be used to synchronised wait 
    await page.locator('.card-body b').first().waitFor()
    const getTitles = await page.locator('.card-body b').allTextContents();
    console.log(getTitles)
    const productCount = await products.count();
    for(let i =0;i<productCount;++i){
        if(await products.nth(i).locator("b").textContent()===productName){
            await products.nth(i).locator("text= Add To Cart").click();
       }

    }
    await page.locator('[routerlink*="cart"]').click()
    await page.locator('div li').first().waitFor();
    //playwright provided sudo classes to get the exact element 
    expect(await page.locator("h3:has-text('ZARA COAT 3')").isVisible).toBeTruthy
    await page.locator('text=Checkout').click();
    await page.locator('[placeholder*="Country"]').pressSequentially("ind",{delay:100});
    const options = page.locator(".ta-results");
    await options.waitFor();
    const optionsCount = await options.locator("button").count();
    console.log(optionsCount);
    for(let i=0;i<optionsCount;++i){
        let text = await options.locator("button").nth(i).textContent();
        console.log(text);
        if(text.trim() ==="India"){
            console.log(text);
            await options.locator("button").nth(i).click(); 
            break;
        }
    }
    expect(page.locator(".mt-5 label[type='text']")).toHaveText(email);
    await page.locator(".action__submit").click();

    expect(await page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ")
    const orderID = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderID) 
    await page.locator("button[routerlink*='myorders']").click();
    const tableRow =page.locator("tr.ng-star-inserted");
    await tableRow.locator("th").first().waitFor();
    const orderIDcounts = await tableRow.locator("th").count();
    console.log(orderIDcounts)
    for(let k=0;k<orderIDcounts;++k){
        tableRow.locator("th").first().waitFor();
//        console.log(await tableRow.locator("th").nth(k).textContent())
 //       console.log("--"+orderID.replaceAll("|"," ").trim()+"--") 
        if(await tableRow.locator("th").nth(k).textContent() === orderID.replaceAll("|"," ").trim()){
            await tableRow.nth(k).locator(".btn-primary").click();
            break;
        }
    }
    console.log(await page.locator("div .-main").textContent());
    let orderIDTrimmed = orderID.replaceAll("|"," ").trim();
    await page.locator("div .-main").waitFor();
    expect(await page.locator("div .-main")).toHaveText(orderIDTrimmed);

}); 
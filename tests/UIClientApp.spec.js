
const {test, expect} = require('@playwright/test');

test('@Web first playwright test UI client app',async ({page})=>{

    const userName = page.locator('#userEmail')
    const password = page.locator('#userPassword')
    const loginButton = page.locator('#login')
    const products = page.locator('.card-body')
    const productName = "ZARA COAT 3"
    const email="lillyjohn@gmail.com"
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
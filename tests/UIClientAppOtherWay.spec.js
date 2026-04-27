
const {test, expect} = require('@playwright/test');

test('@Web first playwright test Ui Client other way',async ({page})=>{


    const productName = "ZARA COAT 3"
    const email="lillyjohn@gmail.com"
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
    console.log(await page.title());
    await expect(page).toHaveTitle("Let's Shop")
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill("Learning@1");
    await page.getByRole("button",{name: "Login"}).click();



    //console.log(await page.locator('.card-body b').first().textContent());
    //to wait until the DOM is loaded we can make use of the below method to wait until the network calls are made 
    await page.waitForLoadState('networkidle');
    //OR
    //this can also be used to synchronised wait 
    await page.locator('.card-body b').first().waitFor()
    await page.locator('.card-body').filter({hasText:"ZARA COAT 3"}).getByRole("button",{name:"Add To Cart"}).click();
    
    await page.getByRole("listitem").getByRole("button",{name:"Cart"}).click();

    await page.locator('div li').first().waitFor();
    //playwright provided sudo classes to get the exact element 
    expect(await page.getByText("ZARA COAT 3").isVisible).toBeTruthy
    await page.getByRole("button",{name:"Checkout"}).click();
    await page.getByPlaceholder("Select Country").pressSequentially("ind");
    await page.getByRole("button",{name:"India"}).nth(1).click();

    await page.getByText("Place Order").click();

    expect(await page.getByText(" Thankyou for the order. ").isVisible).toBeTruthy();
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
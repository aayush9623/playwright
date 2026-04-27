const {test,expect} = require('@playwright/test')

test("Pop up validation",async({page})=>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    //page.goto("https://www.google.com/");
    //page.goBack();
    //page.goForward();

    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();

    //await page.on('dialog',dailog => dailog.dismiss());
    //await page.locator("#confirmbtn").click();
    await page.on('dialog',dailog => dailog.accept());
    await page.locator("#confirmbtn").click(); 
    
    await page.locator("#mousehover").hover();
    const framesPage = page.frameLocator("#courses-iframe");
    //to get only visible elements 
    framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const textCheck=await framesPage.locator("div.text h2").innerText();
    console.log(textCheck.split(" ")[1]);
})


test("screenshot validation",async({page})=>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#displayed-text").screenshot({path:'partialscreenshot.png'})
    await page.locator("#hide-textbox").click();
    await page.screenshot({path:'screenshot.png'})
    await expect(page.locator("#displayed-text")).toBeHidden();
})

test("visual testing",async({page})=>{
    // will fail as the timestamp will change every time 
    //await page.goto("https://www.flightaware.com/")
    
    await page.goto("https://www.google.com")
    expect(await page.screenshot()).toMatchSnapshot('landing.png')
})
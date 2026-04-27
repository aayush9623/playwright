//These tests are executed in Playwright environment that launches the browser and provides a fresh page to each test.
const {test, expect} = require('@playwright/test');

//async is mandatory to make ue of await
//test('first playwright test',async function(){
//better to wright light weight function with =>
//browser here is global fixture and need not be declared before use
//playwright fixture are recognized when wrapped in {} ex-{browser}
test('first playwright test',async ({browser})=>{
//playwright code 
//here javascript code is asynchronous so use await that means all the code starts executing simultaneosly  
    //chrome-plugins/cookies
    //new instance of browser and inject the cookies 
    
    const context = await browser.newContext();
    const page = await context.newPage();
    //blocks all the css in the website 
    //page.route("**/*.css",route=>route.abort())
    
    //blocks the images
    //page.route("**/*.{jpg,png,jpeg}",route=>route.abort())

    const userName = page.locator('#username')
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    page.on('request',request=> console.log(request.url()));
    page.on('response',response=> console.log(response.url(), response.status()));

    console.log(await page.title());
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy")
    await userName.fill("learning");
    await page.locator("[type='password']").fill("Learning@830$3mK2");
    await page.locator('#signInBtn').click();
    console.log(await page.locator("[style*='block']").textContent())
    await expect(page.locator("[style*='block']")).toContainText("Incorrect username/password.")
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await page.locator('#signInBtn').click();

    console.log(await page.locator('.card-body a').nth(0).textContent());
    console.log(await page.locator('.card-body a').nth(1).textContent());
    console.log(await page.locator('.card-body a').first().textContent());
    console.log(await page.locator('.card-body a').last().textContent());
    const allTitles = await page.locator('.card-body a').allTextContents();

    console.log(allTitles);
    
});
//to run the only test in file use as below 
//test.only('first playwright test google',async ({browser,page})=>{
test('first playwright test google',async ({browser,page})=>{
    //if the browswer needs to be opened with default setting no need of below two line just pass the global parameter as page 
        //const context = await browser.newContext();
        //const page = await context.newPage();
    await page.goto("https://google.com")
    console.log(await page.title());
    await expect(page).toHaveTitle("Google")
    
});

test('first playwright dropdown basics',async ({page})=>{
    const userName = page.locator('#username')
    const documentLink = page.locator("[href*='documents-request']")
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    await userName.fill("learning");
    await page.locator("[type='password']").fill("Learning@830$3mK2");
    const dropdown = page.locator('select.form-control');
    await dropdown.selectOption('Consultant');
    
    //await page.locator('#signInBtn').click();
    //radio button 
    await page.locator('.radiotextsty').nth(1).click();
    await page.locator('#okayBtn').click();
    expect(await page.locator('.radiotextsty').nth(1).toBeChecked);
    console.log(await page.locator('.radiotextsty').nth(1).isChecked());
    await page.locator('#terms').click();
    expect(await page.locator('#terms').toBeChecked);
    await page.locator('#terms').uncheck();
    expect(await page.locator('#terms').isChecked()).toBeFalsy();
    await expect(documentLink).toHaveAttribute("class","blinkingText")
    //await page.locator('radiotextsty').nth(1).click();
    //halts the execution and opens the inspector of the code to help debugging 
    //await page.pause();

});

test('first child window handles basics',async ({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username')

    const documentLink = page.locator("[href*='documents-request']")
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    
/*
    if you want the dependency of having the steps should go parllelly then use Promise.all

    there are 3 status of each step in javascript pending, rejected,fulfilled
    where Promise.all verifies the status of all the step is marked as fulfilled or not 
    Below asynchronous step are executing simultaneosly  
*/
    const [newPage] = await Promise.all([
        //listen to new page 
        context.waitForEvent('page'),
        documentLink.click(),
    ])
    let text = await newPage.locator("p.red").textContent();
    let domain = text.split('@')[1].split(" ")[0];
    console.log(domain)

    await page.locator('#username').fill(domain)
    console.log("--------------")
    console.log(await page.locator('#username').inputValue())
    

    });
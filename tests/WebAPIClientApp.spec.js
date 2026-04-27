import APIUtils from '../utils/APIUtils';


const {test, expect, request} = require('@playwright/test');
const loginPayload ={userEmail: "lillyjohn@gmail.com",userPassword: "Learning@1"}
const createOrderPayload= {orders: [{country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68"}]}
let response;

test.beforeAll(async ()=>{
    const apiContext = await request.newContext(); 
    const apiUtils = new APIUtils(apiContext,loginPayload)
    response = await apiUtils.createOrder(createOrderPayload)
   });

test('@API first playwright test with api call',async ({page})=>{
    
    await page.addInitScript(value =>{
        window.localStorage.setItem('token',value)
    },response.token);
    await page.goto("https://rahulshettyacademy.com/client/");

    await page.locator("button[routerlink*='myorders']").click();
    const tableRow =page.locator("tr.ng-star-inserted");
    await tableRow.locator("th").first().waitFor();
    const orderIDcounts = await tableRow.locator("th").count();
    console.log(orderIDcounts)
    for(let k=0;k<orderIDcounts;++k){
        tableRow.locator("th").first().waitFor();
//        console.log(await tableRow.locator("th").nth(k).textContent())
 //       console.log("--"+orderID.replaceAll("|"," ").trim()+"--") 
        console.log("orderID "+response.orderId );
        if(await tableRow.locator("th").nth(k).textContent() === response.orderId ){
            await tableRow.nth(k).locator(".btn-primary").click();
            break;
        }
    }
    console.log(await page.locator("div .-main").textContent());
    await page.locator("div .-main").waitFor();
    expect(await page.locator("div .-main")).toHaveText(response.orderId);

}); 


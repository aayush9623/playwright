import APIUtils from '../utils/APIUtils';


const {test, expect, request} = require('@playwright/test');
const loginPayload ={userEmail: "lillyjohn@gmail.com",userPassword: "Learning@1"}
const createOrderPayload= {orders: [{country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68"}]}
const fakePayloadBody = {data:[],message:"No Orders"}


let response;

test.beforeAll(async ()=>{
    const apiContext = await request.newContext(); 
    const apiUtils = new APIUtils(apiContext,loginPayload)
    response = await apiUtils.createOrder(createOrderPayload)
   });

test('first playwright test with api call',async ({page})=>{
    
    await page.addInitScript(value =>{
        window.localStorage.setItem('token',value)
    },response.token);
    await page.goto("https://rahulshettyacademy.com/client/");
    //specific accounts
    //await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/69a99c15415d779f9b5ad450",
    //all accounts
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*", 
    async route=>{
            //to get the real response 
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(fakePayloadBody);
            route.fulfill({
                response,
                body,
            });
            //intercepting the response -> API response ->||(playwright fake response)|| browser -> render data on frontend 
    })
    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    console.log(await page.locator(".mt-4").textContent());

    
}); 


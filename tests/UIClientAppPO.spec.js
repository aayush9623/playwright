import { test, expect } from '@playwright/test';

const {POManager}= require('../pageObjects/POManager');
const {customtest} =require('../utils/test-base')
//json>>String>>js object 
const dataset = JSON.parse(JSON.stringify(require('../testData/placeOrderTestData.json')))

for(const data of dataset){
test(`@Web first playwright test for ${data.productName}`,async ({page})=>{

    const poManager = new POManager(page,expect);
    const loginPage=poManager.getLoginPage();
    const dashboardPage=poManager.getDashboardPage();
    const cartPage =poManager.getCartPage();    
    const paymentPage=poManager.getPaymentPage();
    const myOrderPage=poManager.getMyOrderPage();

    await loginPage.landToWebsite();
    await loginPage.validLogin(data.userName,data.password)
    await dashboardPage.searchProductAddCart(data.productName);
    await dashboardPage.navigateToCart();
    await cartPage.cartPageLoadCheck();
    await cartPage.checkProductInCart();
    await cartPage.clickCheckout();
    await paymentPage.processPaymentForOrder();
    await paymentPage.validateEmail(data.userName);
    await paymentPage.ClickPlaceorderButton();
    const orderID=await paymentPage.getOrderId();
    await myOrderPage.clickMyOrder();
    await myOrderPage.checkOrderId(orderID);

}); 
}

customtest(`first playwright test for fixture style testdata`,async ({page,testDataForOrder})=>{

    const poManager = new POManager(page,expect);
    const loginPage=poManager.getLoginPage();
    const dashboardPage=poManager.getDashboardPage();
    const cartPage =poManager.getCartPage();    
    const paymentPage=poManager.getPaymentPage();
    const myOrderPage=poManager.getMyOrderPage();

    await loginPage.landToWebsite();
    await loginPage.validLogin(testDataForOrder.userName,testDataForOrder.password)
    await dashboardPage.searchProductAddCart(testDataForOrder.productName);
    await dashboardPage.navigateToCart();
    await cartPage.cartPageLoadCheck();
    await cartPage.checkProductInCart();
    await cartPage.clickCheckout();
    await paymentPage.processPaymentForOrder();
    await paymentPage.validateEmail(testDataForOrder.userName);
    await paymentPage.ClickPlaceorderButton();
    const orderID=await paymentPage.getOrderId();
    await myOrderPage.clickMyOrder();
    await myOrderPage.checkOrderId(orderID);

});


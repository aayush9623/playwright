const { LoginPage } = require('../pageObjects/LoginPage')
const { DashboardPage } = require('../pageObjects/DashboardPage')
const { CartPage } = require('../pageObjects/CartPage')
const { PaymentPage } = require('../pageObjects/PaymentPage')
const {MyOrderPage} =require('../pageObjects/MyOrderPage')

class POManager {
    constructor(page,expect) {
        this.page = page;
        this.expect=expect;
        this.loginPage = new LoginPage(this.page,this.expect);
        this.dashboardPage = new DashboardPage(this.page);
        this.cartPage = new CartPage(this.page,this.expect);
        this.paymentPage = new PaymentPage(this.page,this.expect)
        this.myOrderPage = new MyOrderPage(this.page, this.expect)

    }
    getLoginPage(){
        return this.loginPage;
    }
    getDashboardPage(){
        return this.dashboardPage;
    }
    getCartPage(){
        return this.cartPage;
    }
    getPaymentPage(){
        return this.paymentPage;
    }
    getMyOrderPage(){
        return this.myOrderPage;
    }
}
module.exports={POManager}
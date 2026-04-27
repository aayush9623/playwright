class PaymentPage{
    constructor(page,expect){
        this.page=page;
        this.expect=expect;
        this.countryField = page.locator('[placeholder*="Country"]');
        this.countryOptions =page.locator(".ta-results");
        this.userNameField= page.locator(".mt-5 label[type='text']");
        this.placeOrderButton =page.locator(".action__submit");
        this.thankyouText = page.locator(".hero-primary");
        this.orderID = page.locator(".em-spacer-1 .ng-star-inserted");
    }

    async processPaymentForOrder(){
        await this.countryField.pressSequentially("ind",{delay:100});
        await this.countryOptions.waitFor();
        const optionsCount = await this.countryOptions.locator("button").count();
        console.log(optionsCount);
        for(let i=0;i<optionsCount;++i){
            let text = await this.countryOptions.locator("button").nth(i).textContent();
            console.log(text);
            if(text.trim() ==="India"){
                console.log(text);
                await this.countryOptions.locator("button").nth(i).click(); 
                break;
            }
        }
    }
    async validateEmail(userName){
        this.expect(this.userNameField).toHaveText(userName);
    }
    async ClickPlaceorderButton(){
        await this.placeOrderButton.click();
    }
        
    async getOrderId(){
        this.expect(await this.thankyouText).toHaveText(" Thankyou for the order. ")
        const orderID = await this.orderID.textContent();
        console.log("Your orderID is: "+orderID)
        return orderID;
    }

}
module.exports ={PaymentPage}
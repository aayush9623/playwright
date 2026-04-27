class CartPage{
constructor(page,expect){
    this.page=page;
    this.expect=expect;
    this.cartpageConfirmation = page.locator('div li')
    this.productInCart = page.locator("h3:has-text('Product')")
    this.checkoutButton = page.locator('text=Checkout');
  
}


async cartPageLoadCheck(){
    await this.cartpageConfirmation.first().waitFor();
}
async checkProductInCart(productName){

     this.expect(await this.page.locator("h3:has-text('"+productName+"')").isVisible).toBeTruthy
    
}
async clickCheckout(){
    await this.checkoutButton.click();
}


}
module.exports = {CartPage}
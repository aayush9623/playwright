class DashboardPage{
    constructor(page){
        this.page=page
        this.products = page.locator('.card-body')
        this.productText = page.locator('.card-body b')
        this.cart=page.locator('[routerlink*="cart"]')
    }

    async searchProductAddCart(productName){

            //this can also be used to synchronised wait 
            await this.productText.first().waitFor()
            const getTitles = await this.productText.allTextContents();
            console.log(getTitles)
            const productCount = await this.products.count();
            for(let i =0;i<productCount;++i){
                if(await this.products.nth(i).locator("b").textContent()===productName){
                    await this.products.nth(i).locator("text= Add To Cart").click();
               }
        
            }
    }
    async navigateToCart(){
        await this.cart.click();
    }
}
module.exports ={DashboardPage};
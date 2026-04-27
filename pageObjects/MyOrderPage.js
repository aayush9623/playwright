
class MyOrderPage {
    constructor(page, expect) {
        this.page = page;
        this.expect = expect;
        this.myOdersButton = this.page.locator("button[routerlink*='myorders']");
        this.orderIdInTable = this.page.locator("div .-main");
    }
    async clickMyOrder() {
        await this.myOdersButton.click();
    }

    async checkOrderId(orderID) {
        const tableRow = this.page.locator("tr.ng-star-inserted");
        await tableRow.locator("th").first().waitFor();
        const orderIDcounts = await tableRow.locator("th").count();
        console.log(orderIDcounts)
        for (let k = 0; k < orderIDcounts; ++k) {
            tableRow.locator("th").first().waitFor();
            //        console.log(await tableRow.locator("th").nth(k).textContent())
            //       console.log("--"+orderID.replaceAll("|"," ").trim()+"--") 
            if (await tableRow.locator("th").nth(k).textContent() === orderID.replaceAll("|", " ").trim()) {
                await tableRow.nth(k).locator(".btn-primary").click();
                break;
            }
        }
        console.log(await this.page.locator("div .-main").textContent());
        let orderIDTrimmed = orderID.replaceAll("|", " ").trim();
        await this.page.locator("div .-main").waitFor();
        this.expect(await this.page.locator("div .-main")).toHaveText(orderIDTrimmed);

    }
}
module.exports = { MyOrderPage }



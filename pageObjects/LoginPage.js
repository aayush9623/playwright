class LoginPage {
    constructor(page,expect) {
        this.page = page;
        this.expect=expect;
        this.signInButton = page.locator('#login')
        this.userName = page.locator('#userEmail')
        this.password = page.locator('#userPassword')
    }

    async landToWebsite() {
        await this.page.goto("https://rahulshettyacademy.com/client/#/auth/login")
        console.log(await this.page.title());
        await this.expect(this.page).toHaveTitle("Let's Shop")
    }

    async validLogin(userName, password) {
        await this.userName.type(userName);
        await this.password.type(password);
        await this.signInButton.click();
        //console.log(await page.locator('.card-body b').first().textContent());
        //to wait until the DOM is loaded we can make use of the below method to wait until the network calls are made 
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = { LoginPage };
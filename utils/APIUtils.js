
export default class APIUtils {

    constructor(apiContext,loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload =loginPayload;
    }
    async getToken() {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", { data: this.loginPayload });

        const loginJsonResponse = await loginResponse.json();
        const token = loginJsonResponse.token;
        console.log(token);
        return token;
    }
    async createOrder(createOrderPayload){
        let response ={};
        response.token = await this.getToken();
        const orderResponse =await  this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
        data:createOrderPayload,
        headers:{
            'Authorization': response.token,
            'Content-type':'application/json'
        }
    })
    const orderJsonResponse = await orderResponse.json();
    console.log(orderJsonResponse);
    console.log("oreder response JSON finder "+orderJsonResponse.orders[0]);
    response.orderId  = orderJsonResponse.orders[0];
    console.log(response.orderID);
    return response;
    }
}

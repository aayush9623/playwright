const {test} = require('@playwright/test')

exports.customtest=test.extend({
    testDataForOrder : {
        productName : "ZARA COAT 3",
        userName:"lillyjohn@gmail.com",
        password : "Learning@1"
    }
})
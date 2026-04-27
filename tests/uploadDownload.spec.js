const ExcelJS = require('exceljs')
const{test,expect}= require('@playwright/test')

async function readExcelFile(worksheet,searchText) {
    const output = {targetRow:-1,targetCol:-1}
    worksheet.eachRow((row, rownumber) => {
        row.eachCell((cell, colnumber) => {

            if (cell.value === searchText) {
                console.log(rownumber + " is a rownumber")
                console.log(colnumber + " is a colnumber")
                output.targetRow = rownumber;
                output.targetCol = colnumber;
            }
        })
    })
    return output;

}
async function excelValueFindAndReplace(searchText, replaceText,change, filePath) {


    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1')

    const output = await readExcelFile(worksheet,searchText);

    const cell = worksheet.getCell(output.targetRow+change.rowChange, output.targetCol+change.colChange)
    cell.value = replaceText;
    await workbook.xlsx.writeFile(filePath);

}
//exceltest();
console.log("==============================")
//excelValueFindAndReplace("error_user", "Test", "C:/workspace/Automation/Playwright/TestData.xlsx");
test("upload download excel validation",async({page})=>{
    const searchText = "Mango"
    const updateText='350';
    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
    const downloadPromise = page.waitForEvent('download')
    await page.locator("#downloadButton").click();
    await downloadPromise;
    await excelValueFindAndReplace(searchText,updateText,{rowChange:0,colChange:2},"C:/Users/aayus/Downloads/download.xlsx");
    await page.locator("#fileinput").click();
    //type of the attribute should be set to file thenn it works
    await page.locator("#fileinput").setInputFiles("C:/Users/aayus/Downloads/download.xlsx");
    const searchedText = page.getByText(searchText);
    const desiredRow = await page.getByRole("row").filter({has:searchedText});
    await expect(desiredRow.locator("#cell-4-undefined")).toContainText(updateText);   

})
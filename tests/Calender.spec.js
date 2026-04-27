const {test, expect}= require("@playwright/test");

test("calender validation",async({page})=>{
    const month_number="6";
    const date="15";
    const year="2027";
    const expectedDate =[month_number,date,year];

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers")
    await page.locator("div .react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label__labelText").click();
    await page.locator(".react-calendar__navigation__label__labelText").click();
    await page.getByText(year).click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(month_number)-1).click();
    await page.locator("//abbr[text()='"+date+"']").click();
    const inputs = await page.locator("input.react-date-picker__inputGroup__input");
    for(let i=0;i<expectedDate.length;++i){
        const value=await inputs.nth(i).inputValue();
        expect(value).toEqual(expectedDate[i]);
    }

    console.log("test complete")



})

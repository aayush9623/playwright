const {test,expect}=require("@playwright/test");
const { eventNames } = require("node:cluster");
const { TIMEOUT } = require("node:dns");
const BASE_URL = "https://eventhub.rahulshettyacademy.com";
async function login(page,email,password){
        await page.goto(`${BASE_URL}/login`);
        await page.locator("#email").fill(email);
        await page.locator("#password").fill(password);
        await page.locator("#login-btn").click();
        await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
    }

test("event seat booking flow",async({page})=>{
    //step 1
    await login(page,"lillyjohn@gmail.com","Learning@1");
    //step 2
    await page.locator(".relative button").nth(0).click();
    await page.locator(".top-full [href*='/admin/events']").click();
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    let eventname = "Test Event "+currentDate;
    
    await page.locator("#event-title-input").fill(eventname);
    await page.locator("#admin-event-form textarea").fill(eventname+" is fun event")
    await page.getByLabel("City").fill("Pune");
    await page.getByLabel("Venue").fill("Apex hall");
    await page.getByLabel("Event Date & Time").fill("2027-12-31T10:00");
    await page.getByLabel("Price ($)").fill("150");
    await page.getByLabel("Total Seats").fill("50");
    await page.locator("#add-event-btn").click();
    await expect(page.getByText("Event created!")).toBeVisible();

    //step 3
    await page.goto(`${BASE_URL}/events`);
    const cards= page.locator("#event-card");
    await expect(cards.first()).toBeVisible();
    const targetCard =  cards.filter({hasText:eventname}).first();
    await expect(targetCard).toBeVisible({TIMEOUT:5000});
    // Capture seat count before booking
    const seatsBeforeBooking = parseInt(await targetCard.getByText('seats available').first().innerText());
    console.log(`Seats before booking: ${seatsBeforeBooking}`);
    //step 4
    await targetCard.getByTestId("book-now-btn").click();

    //step 5
    expect(await page.locator("#ticket-count").textContent()).toEqual("1");
    await page.getByLabel("Full Name").fill("john")
    await page.locator("#customer-email").fill("lillyjohn@gmail.com");
    await page.getByPlaceholder("+91 98765 43210").fill("+91 8754125478");
    await page.locator(".confirm-booking-btn").click();
    await expect(page.locator(".booking-ref")).toBeVisible();
    const bookingRef = await page.locator(".booking-ref").first().innerText();
    console.log("--"+bookingRef+"--")
    //step 6
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);

    const bookingCards = page.locator('#booking-card');
    await expect(bookingCards.first()).toBeVisible();

    const matchingCard = bookingCards.filter({ has: page.locator('.booking-ref', { hasText: bookingRef }) });
    await expect(matchingCard).toBeVisible();

    await expect(matchingCard).toContainText(eventname);
    console.log(`Booking card found in My Bookings for ref: ${bookingRef}`);

    await page.goto(`${BASE_URL}/events`);
    await expect(page.locator("#event-card").first()).toBeVisible();

    const updatedCard =  cards.filter({hasText:eventname}).first();
    await expect(updatedCard).toBeVisible({TIMEOUT:5000});

    const seatsAfterBooking = parseInt(await targetCard.getByText('seats available').first().innerText());
    console.log(`Seats after booking: ${seatsAfterBooking}`);
    expect(`${seatsAfterBooking}-1 === ${seatsAfterBooking}`).toBeTruthy();

})
async function loginAndGoToBooking(page,email,password){ 

    await page.goto(`${BASE_URL}/login`);
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);
    await page.locator("#login-btn").click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();  

}
test("event single seat booking flow ",async({page})=>{
    await loginAndGoToBooking(page,"lillyjohn@gmail.com","Learning@1"); 
    await page.goto(`${BASE_URL}/events`);

    await page.locator("#event-card").first().locator("#book-now-btn").click();
    await page.getByLabel("Full Name").fill("john")
    await page.locator("#customer-email").fill("lillyjohn@gmail.com");
    await page.getByPlaceholder("+91 98765 43210").fill("+91 8754125478");
    await page.locator(".confirm-booking-btn").click();
    //step 3
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);
    await expect(page.locator("#booking-card button").getByText("View Details").first()).toBeVisible();
    await page.locator("#booking-card button").getByText("View Details").first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();
    //step 4
    const eventTitle = await page.locator("h1.font-bold").innerText();
    const bookingref = await page.locator("span.font-mono.font-bold").innerText();
    expect(eventTitle.charAt(0)).toBe(bookingref.charAt(0));

    //step 5 
    await page.locator("#check-refund-btn").click();

    // Spinner must appear immediately
    await expect(page.locator('#refund-spinner')).toBeVisible();

    // Wait for spinner to disappear after 4s
    await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });
    //step 6
    let refundInfo = await page.locator("#refund-result span").innerText();
    expect(await page.locator("#refund-result span")).toContainText("Eligible for refund.");
    expect(await page.locator("#refund-result span")).toContainText("Single-ticket bookings qualify for a full refund");
    console.log(refundInfo);
})

test('refund not eligible for group ticket booking', async ({ page }) => {
    await loginAndGoToBooking(page,"lillyjohn@gmail.com","Learning@1"); 
    await page.goto(`${BASE_URL}/events`);
    await page.locator("#event-card").first().locator("#book-now-btn").click();
    expect(await page.locator("#ticket-count").textContent()).toEqual("1");
    await page.getByRole("button",{name:'+'}).click();
    await page.getByRole("button",{name:'+'}).click();
    expect(await page.locator("#ticket-count").textContent()).toEqual("3");
    
    await page.getByLabel("Full Name").fill("john")
    await page.locator("#customer-email").fill("lillyjohn@gmail.com");
    await page.getByPlaceholder("+91 98765 43210").fill("+91 8754125478");
    await page.locator(".confirm-booking-btn").click();
        //step 3
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);
    await expect(page.locator("#booking-card button").getByText("View Details").first()).toBeVisible();
    await page.locator("#booking-card button").getByText("View Details").first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();
    //step 4
    const eventTitle = await page.locator("h1.font-bold").innerText();
    const bookingref = await page.locator("span.font-mono.font-bold").innerText();
    expect(eventTitle.charAt(0)).toBe(bookingref.charAt(0));

    //step 5 
    await page.locator("#check-refund-btn").click();
    // Spinner must appear immediately
    await expect(page.locator('#refund-spinner')).toBeVisible();
    // Wait for spinner to disappear after 4s
    await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });
    //step 6
    let refundInfo = await page.locator("#refund-result span").innerText();
    expect(await page.locator("#refund-result span")).toContainText("Not eligible for refund");
    expect(await page.locator("#refund-result span")).toContainText("Group bookings (3 tickets) are non-refundable");
    

})
    

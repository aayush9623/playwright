const { test, expect } = require('@playwright/test');

const BASE_URL = "https://eventhub.rahulshettyacademy.com";
const API_URL  = 'https://api.eventhub.rahulshettyacademy.com/api';
const yahooUser = { email: "lillyjohn@yahoo.com",password: "Learning@1" }
const gmailUser = { email: "lillyjohn@gmail.com",password: "Learning@1" }

async function login(page, email, password) {
    await page.goto(`${BASE_URL}/login`);
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);
    await page.locator("#login-btn").click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

test("Assignemnet network 2", async ({ page,request }) => {
    //Step 1 — Login as Yahoo user via API
    const loginResult = await request.post(`${API_URL}/auth/login`,{
        data:{ email:yahooUser.email, password:yahooUser.password},
    });
    expect(loginResult.ok()).toBeTruthy();
    const {token} = await loginResult.json();
    //console.log(token)

    const eventsList = await request.get(`${API_URL}/events`,{
        headers: {Authorization: `Bearer ${token}`}
    });
    expect(eventsList.ok()).toBeTruthy();
    const events = await eventsList.json()
    const eventID=events.data[0].id;
    console.log(eventID)

    const bookingRes = await request.post(`${API_URL}/bookings`,{
         headers: {Authorization: `Bearer ${token}`},
         data: {
        "eventId": eventID,
        "customerName": "Yahoo User",
        "customerEmail": "lillyjohn@yahoo.com",
        "customerPhone": "7894561237",
        "quantity": 1
    },
    });
    expect(bookingRes.ok()).toBeTruthy();
    const yahooBookings = await bookingRes.json();
    const yahooBookingId=yahooBookings.data.id;
    console.log("yahoo booking ID is "+yahooBookingId)
    
    await login(page,gmailUser.email,gmailUser.password);
    await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`,{ waitUntil: 'networkidle' });
    await expect(page.getByText("Access Denied")).toBeVisible();
    await expect(page.getByText("You are not authorized to view this booking.")).toBeVisible();
    

})

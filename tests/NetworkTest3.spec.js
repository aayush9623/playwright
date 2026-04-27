const { test, expect } = require('@playwright/test');

const BASE_URL = "https://eventhub.rahulshettyacademy.com";
const SIX_EVENTS_RESPONSE = {
    data: [
        { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
        { id: 2, title: 'Rock Night Live', category: 'Concert', eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
        { id: 3, title: 'IPL Finals', category: 'Sports', eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
        { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
        { id: 5, title: 'Lollapalooza India', category: 'Festival', eventDate: '2025-06-20T12:00:00.000Z', venue: 'Mahalaxmi Racecourse', city: 'Mumbai', price: '3000', totalSeats: 5000, availableSeats: 2000, imageUrl: null, isStatic: false },
        { id: 6, title: 'AI & ML Expo', category: 'Conference', eventDate: '2025-06-25T10:00:00.000Z', venue: 'Bangalore International Exhibition Centre', city: 'Bangalore', price: '750', totalSeats: 300, availableSeats: 180, imageUrl: null, isStatic: false },
    ],
    pagination: { page: 1, totalPages: 1, total: 6, limit: 12 },
};

const FOUR_EVENTS_RESPONSE = {
    data: [
        { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
        { id: 2, title: 'Rock Night Live', category: 'Concert', eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
        { id: 3, title: 'IPL Finals', category: 'Sports', eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
        { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
    ],
    pagination: { page: 1, totalPages: 1, total: 4, limit: 12 },
};

async function login(page, email, password) {
    await page.goto(`${BASE_URL}/login`);
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);
    await page.locator("#login-btn").click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

test("Banner IS visible when 6 events are returned", async ({ page }) => {
    //Step 1 — Set up the API mock


    //before sending it to server it was tweaked 
    await page.route("**/api/events**",
        async route => {
            //to get the real response 
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(SIX_EVENTS_RESPONSE);
            route.fulfill({
                response,
                status: 200,
                contentType: 'application/json',
                body,
            });
            //intercepting the response -> API response ->||(playwright fake response)|| browser -> render data on frontend 
        })
    await login(page, "lillyjohn@gmail.com", "Learning@1");
    await page.getByRole('link', { name: 'Browse Events →' }).click();
    const eventCards= page.getByTestId('event-card')
    await expect(eventCards.first()).toBeVisible();
    expect(await eventCards.count()).toBe(6);
    //using the regex as below 
    const banner = page.getByText(/sandbox holds up to/i);
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('9');
    await page.pause();
    
})
test("Banner is NOT visible when 4 events are returned", async ({ page }) => {
    //Step 1 — Set up the API mock


    //before sending it to server it was tweaked 
    await page.route("**/api/events**",
        async route => {
            //to get the real response 
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(FOUR_EVENTS_RESPONSE);
            route.fulfill({
                response,
                status: 200,
                contentType: 'application/json',
                body,
            });
            //intercepting the response -> API response ->||(playwright fake response)|| browser -> render data on frontend 
        })
    await login(page, "lillyjohn@gmail.com", "Learning@1");
    await page.getByRole('link', { name: 'Browse Events →' }).click();
    const eventCards= page.getByTestId('event-card')
    await expect(eventCards.first()).toBeVisible();
    expect(await eventCards.count()).toBe(4);
    //using the regex as below 
    const banner = page.getByText(/sandbox holds up to/i);
    await expect(banner).not.toBeVisible();
    await page.pause();
    
})

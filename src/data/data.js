const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchAPI(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();

    return result?.data || [];
}


// ===============================
// Dashboard Stats
// ===============================

export async function API_getStats() {
    return fetchAPI("/api/dashboard/stats");
}


// ===============================
// Revenue
// ===============================

export async function API_getRevenueData() {
    return fetchAPI("/api/dashboard/revenue");
}


// ===============================
// Categories
// ===============================

export async function API_getCategoryData() {
    return fetchAPI("/api/dashboard/categories");
}

// Alias for pages/components using API_getCategories
export async function API_getCategories() {
    return fetchAPI("/api/dashboard/categories");
}


// ===============================
// Pending Books
// ===============================

export async function API_getPendingBooks() {
    return fetchAPI("/api/dashboard/pending-books");
}


// ===============================
// Users
// ===============================

export async function API_getUsers() {
    return fetchAPI("/api/dashboard/users");
}


// ===============================
// Books
// ===============================

export async function API_getBooks() {
    return fetchAPI("/api/dashboard/books");
}


// ===============================
// Transactions
// ===============================

export async function API_getTransactions() {
    return fetchAPI("/api/dashboard/transactions");
}


// ===============================
// Earnings
// ===============================

export async function API_getEarnings() {
    return fetchAPI("/api/dashboard/earnings");
}
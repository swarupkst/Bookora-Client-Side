'use server';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const addBook = async (newBookData) => {
    try {
        console.log("API URL:", `${baseUrl}/api/books`);

        const res = await fetch(`${baseUrl}/api/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBookData),
            cache: 'no-store',
        });

        const text = await res.text();

        console.log("Response status:", res.status);
        console.log("Response:", text);

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            return {
                success: false,
                message: `Server returned non-JSON response. Status: ${res.status}`,
            };
        }

        if (!res.ok) {
            return {
                success: false,
                message: data?.message || 'Failed to add book',
            };
        }

        return data;

    } catch (error) {
        console.error("Add book error:", error);

        return {
            success: false,
            message: error.message || 'Something went wrong',
        };
    }
};
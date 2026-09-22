const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// Get books
export const getBook = async (
    bookId,
    status = ""
) => {
    const params = new URLSearchParams();

    if (bookId) {
        params.append("bookId", bookId);
    }

    if (status) {
        params.append("status", status);
    }

    const res = await fetch(
        `${baseUrl}/api/books?${params.toString()}`
    );

    if (!res.ok) {
        throw new Error(
            "Failed to fetch books"
        );
    }

    return res.json();
};

// Get single book
export const getBookById = async (id) => {
    const res = await fetch(
        `${baseUrl}/api/books/${id}`
    );

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error(
                "Book not found"
            );
        }

        throw new Error(
            "Failed to fetch book"
        );
    }

    return res.json();
};
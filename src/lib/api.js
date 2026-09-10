const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

/**
 * Common API fetch helper
 * Supports both JSON and FormData requests.
 */
export async function apiFetch(endpoint, options = {}) {
  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  const headers = {
    ...(isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        }),
    ...(options.headers || {}),
  };

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      credentials: "include",
      headers,
    }
  );

  const contentType =
    response.headers.get("content-type") || "";

  let data = {};

  if (contentType.includes("application/json")) {
    data =
      await response.json().catch(() => ({}));
  } else {
    const text =
      await response.text().catch(() => "");

    data = text ? { message: text } : {};
  }

  if (!response.ok) {
    console.error(
      "API ERROR STATUS:",
      response.status
    );

    console.error(
      "API ERROR RESPONSE:",
      JSON.stringify(data, null, 2)
    );

    throw new Error(
      data.message ||
        data.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

// ----------------------------------------
// PUBLIC
// ----------------------------------------

export function getBooks(params = {}) {
  const searchParams =
    new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParams.append(
          key,
          String(value)
        );
      }
    }
  );

  const query =
    searchParams.toString();

  return apiFetch(
    `/books${query ? `?${query}` : ""}`
  );
}

export function getBook(id) {
  return apiFetch(`/books/${id}`);
}

// ----------------------------------------
// LIBRARIAN
// ----------------------------------------

export function getMyBooks() {
  return apiFetch(
    "/books/librarian/my-books"
  );
}

export function createBook(bookData) {
  return apiFetch("/books", {
    method: "POST",
    body: JSON.stringify(bookData),
  });
}

export function updateBook(id, bookData) {
  return apiFetch(`/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(bookData),
  });
}

export function deleteBook(id) {
  return apiFetch(`/books/${id}`, {
    method: "DELETE",
  });
}

export function unpublishBook(id) {
  return apiFetch(
    `/books/${id}/unpublish`,
    {
      method: "PATCH",
    }
  );
}

// ----------------------------------------
// ADMIN
// ----------------------------------------

export function getAllBooks() {
  return apiFetch("/books/admin/all");
}

export function getPendingBooks() {
  return apiFetch(
    "/books/admin/pending"
  );
}

export function approveBook(id) {
  return apiFetch(
    `/books/${id}/approve`,
    {
      method: "PATCH",
    }
  );
}

export function rejectBook(id) {
  return apiFetch(
    `/books/${id}/reject`,
    {
      method: "PATCH",
    }
  );
}

export function publishBook(id) {
  return apiFetch(
    `/books/${id}/publish`,
    {
      method: "PATCH",
    }
  );
}
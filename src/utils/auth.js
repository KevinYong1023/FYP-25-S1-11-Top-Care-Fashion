// src/utils/auth.js

/**
 * Retrieves the authentication token from localStorage.
 * @returns {string | null} The token string or null if not found.
 */
export const getAuthToken = () => {
    // Reads the item named 'authToken' from the browser's localStorage
    return localStorage.getItem('authToken');
};

/**
 * Removes the authentication token from localStorage.
 */
export const removeAuthToken = () => {
    // Removes the item named 'authToken' from localStorage
    localStorage.removeItem('authToken');
    console.log("Auth token removed."); // Optional log for debugging
};

/**
 * Stores the authentication token in localStorage.
 * (You call this from your Login component after successful login)
 * @param {string} token - The JWT token received from the backend.
 */
export const storeAuthToken = (token) => {
     if (token) {
         localStorage.setItem('authToken', token);
         console.log("Auth token stored."); // Optional log
     } else {
         console.error("Attempted to store an invalid token.");
     }
};

// You can add other auth-related utility functions here later, like:
// - function to check if token is expired (requires a JWT decoding library like jwt-decode)
// - function to get user details from the token payload (requires decoding)
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
    console.log("Auth token removed."); 
};

/**
 * Stores the authentication token in localStorage.
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

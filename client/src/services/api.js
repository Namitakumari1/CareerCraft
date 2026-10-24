
const API_BASE_URL = import.meta.env.VITE_API_URL;

const TOKEN_KEY = "careercraft_token";

// Reusable function for all backend requests
export const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem(TOKEN_KEY);

    const headers = {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
    };

    // Attach JWT when available
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;

    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
    } catch {
        throw new Error(
            "Cannot connect to CareerCraft server. Check whether the backend is running."
        );
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

// Authentication APIs
export const authApi = {
    register: (userData) =>
        apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify(userData),
        }),

    login: async (credentials) => {
        const data = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });

        if (data.token) {
            localStorage.setItem(TOKEN_KEY, data.token);
        }

        return data;
    },

    getMe: () => apiRequest("/auth/me"),

    updateMe: (profileData) =>
        apiRequest("/auth/me", {
            method: "PUT",
            body: JSON.stringify(profileData)
        }),
        
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
    },
};

// Resume APIs
export const resumeApi = {
    create: (resumeData) =>
        apiRequest("/resumes", {
            method: "POST",
            body: JSON.stringify(resumeData),
        }),

    getAll: () => apiRequest("/resumes"),

    getById: (id) => apiRequest(`/resumes/${id}`),

    update: (id, resumeData) =>
        apiRequest(`/resumes/${id}`, {
            method: "PUT",
            body: JSON.stringify(resumeData),
        }),

    remove: (id) =>
        apiRequest(`/resumes/${id}`, {
            method: "DELETE",
        }),
};

// Job application APIs
export const applicationApi = {
    create: (applicationData) =>
        apiRequest("/applications", {
            method: "POST",
            body: JSON.stringify(applicationData),
        }),

    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();

        return apiRequest(
            `/applications${query ? `?${query}` : ""}`
        );
    },

    getById: (id) => apiRequest(`/applications/${id}`),

    update: (id, applicationData) =>
        apiRequest(`/applications/${id}`, {
            method: "PUT",
            body: JSON.stringify(applicationData),
        }),

    remove: (id) =>
        apiRequest(`/applications/${id}`, {
            method: "DELETE",
        }),
};

// Dashboard analytics API
export const dashboardApi = {
    getSummary: () => apiRequest("/dashboard/summary"),
};
import * as db from './database';

export const login = (email: string, pass: string): boolean => {
    // Mock login logic: in a real app, this would be an API call.
    if (email && pass) {
        localStorage.setItem('userToken', 'mock-user-token-for-demo');
        // Let's derive a name from the email for the demo
        const name = email.split('@')[0];
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        localStorage.setItem('userName', capitalizedName);
        return true;
    }
    return false;
};

export const register = (name: string, email: string, pass: string): boolean => {
    // Mock register logic: in a real app, this would be an API call.
    console.log('Registering user:', { name, email });
    // For this demo, registration automatically logs the user in.
    if (name && email && pass) {
        localStorage.setItem('userToken', 'mock-user-token-for-demo');
        localStorage.setItem('userName', name);
        // Clear any previous data on new registration
        db.clearAllData();
        return true;
    }
    return false;
};

export const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    // Clear all profile data from our mock db
    db.clearAllData();
    // Using hash property to navigate, which works well with HashRouter
    window.location.hash = '/login';
    // A full page reload can also help clear any lingering state.
    window.location.reload();
};

export const isAuthenticated = (): boolean => {
    return localStorage.getItem('userToken') !== null;
};

export const getUserName = (): string => {
    return localStorage.getItem('userName') || 'Usuario';
};
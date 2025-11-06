import { debug } from './debug.js';

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {Object} - { isValid: boolean, message: string }
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim() === '') {
        return { isValid: false, message: 'Email is required' };
    }
    if (!emailRegex.test(email)) {
        return { isValid: false, message: 'Please enter a valid email address' };
    }
    return { isValid: true };
}

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {Object} - { isValid: boolean, message: string }
 */
export function validatePassword(password) {
    if (!password || password.trim() === '') {
        return { isValid: false, message: 'Password is required' };
    }
    if (password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    return { isValid: true };
}

/**
 * Validates a name
 * @param {string} name - The name to validate
 * @returns {Object} - { isValid: boolean, message: string }
 */
export function validateName(name) {
    if (!name || name.trim() === '') {
        return { isValid: false, message: 'Name is required' };
    }
    if (name.trim().length < 2) {
        return { isValid: false, message: 'Name must be at least 2 characters long' };
    }
    return { isValid: true };
}

/**
 * Validates login form data
 * @param {Object} data - The login form data
 * @param {string} data.email - The email address
 * @param {string} data.password - The password
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export function validateLogin(data) {
    const errors = {};
    const emailValidation = validateEmail(data.email);
    const passwordValidation = validatePassword(data.password);

    if (!emailValidation.isValid) {
        errors.email = emailValidation.message;
    }
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message;
    }

    debug('Login validation results:', { hasErrors: Object.keys(errors).length > 0, errors });
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Validates registration form data
 * @param {Object} data - The registration form data
 * @param {string} data.name - The user's name
 * @param {string} data.email - The email address
 * @param {string} data.password - The password
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export function validateRegistration(data) {
    const errors = {};
    const nameValidation = validateName(data.name);
    const emailValidation = validateEmail(data.email);
    const passwordValidation = validatePassword(data.password);

    if (!nameValidation.isValid) {
        errors.name = nameValidation.message;
    }
    if (!emailValidation.isValid) {
        errors.email = emailValidation.message;
    }
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message;
    }

    debug('Registration validation results:', { hasErrors: Object.keys(errors).length > 0, errors });
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
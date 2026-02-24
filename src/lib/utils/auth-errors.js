/**
 * Mapea códigos de error de BetterAuth a mensajes amigables en español.
 */
export const translateError = (error) => {
    // BetterAuth a veces devuelve el error como un objeto con código o directamente el código
    const code = typeof error === 'string' ? error : error?.body?.code || error?.code || 'UNKNOWN_ERROR';

    const errorMap = {
        'INVALID_EMAIL_OR_PASSWORD': 'El correo o la contraseña son incorrectos.',
        'PASSWORD_TOO_SHORT': 'La contraseña es demasiado corta (mínimo 8 caracteres).',
        'USER_NOT_FOUND': 'No encontramos ninguna cuenta con este correo.',
        'INVALID_TOKEN': 'El enlace ha expirado o ya no es válido.',
        'EMAIL_NOT_VERIFIED': 'Debes verificar tu correo antes de continuar.',
        'USER_ALREADY_EXISTS': 'Ya existe una cuenta con este correo electrónico.',
        'ACCOUNT_ALREADY_LINKED': 'Esta cuenta ya está vinculada a otro proveedor.',
        'SESSION_EXPIRED': 'Tu sesión ha expirado. Por favor, ingresa de nuevo.',
        'TOO_MANY_REQUESTS': 'Demasiados intentos. Por favor, intenta más tarde.',
        'INTERNAL_SERVER_ERROR': 'Ocurrió un error en el servidor. Inténtalo de nuevo.',
        'WEAK_PASSWORD': 'La contraseña no cumple con los requisitos mínimos de seguridad.'
    };

    return errorMap[code] || 'Ocurrió un error inesperado. Inténtalo de nuevo.';
};

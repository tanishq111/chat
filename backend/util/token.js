import jwt from 'jsonwebtoken';

const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
    };
};

export const issueToken = (user) => {
    return jwt.sign({ id: user._id, name: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const issueRefreshToken = (user) => {
    return jwt.sign({ id: user._id, name: user.username }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};


export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};


export const setAuthCookies = (res, token, refreshToken) => {
    const cookieOptions = getCookieOptions();

    res.cookie('token', token, {
        ...cookieOptions,
        path: '/',
        maxAge: 60 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        path: '/api/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const clearAuthCookies = (res) => {
    const cookieOptions = getCookieOptions();

    res.clearCookie('token', { ...cookieOptions, path: '/' });
    res.clearCookie('refreshToken', { ...cookieOptions, path: '/api/auth' });
};
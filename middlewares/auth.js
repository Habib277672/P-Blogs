const { validateToken } = require("../services/auth");

const checkForAuthCookie = (cookieName) => {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName]

        // FIX: added `return` to stop execution — without it next() was called
        // twice (once here and once at the bottom), causing "headers already sent" errors
        if (!tokenCookieValue) {
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue)
            req.user = userPayload;
        } catch (err) {
            // Invalid or expired token — clear the bad cookie
            res.clearCookie(cookieName);
        }

        next();
    }
}

module.exports = {
    checkForAuthCookie
}

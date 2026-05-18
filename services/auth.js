const jwt = require('jsonwebtoken')

// FIX: use environment variable — never hardcode secrets in source code
// Create a .env file with: JWT_SECRET=your_long_random_secret_here
const secretKey = process.env.JWT_SECRET || "habibq12"

const createTokenForUser = (user) => {
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        // FIX: was `profileImageURL` (capital URL) — schema field is `profileImageUrl`
        profileImageUrl: user.profileImageUrl,
        role: user.role
    }
    // FIX: added expiresIn — tokens should always expire
    const token = jwt.sign(payload, secretKey, { expiresIn: '7d' })
    return token;
}

const validateToken = (token) => {
    const payload = jwt.verify(token, secretKey)
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken
}

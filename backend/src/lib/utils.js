import jwt from 'jsonwebtoken';
import { ENV } from "./env.js";

export const generateToken = (userID, res) => {
    const token = jwt.sign({ userId: userID }, ENV.JWT_SECRET, {
        expiresIn: '7d',
    });

    // Set cookie for local dev (optional fallback)
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });

    return token;
};

export const clearTokenCookie = (res) => {
    res.cookie("jwt", "", { maxAge: 0 });
};
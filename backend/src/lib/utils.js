import jwt from 'jsonwebtoken';
import { ENV } from "./env.js";

const getCookieOptions = () => ({
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
    secure: ENV.NODE_ENV === "production",
});

export const generateToken = (userID, res) => {
    const token = jwt.sign({ userId: userID }, ENV.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie("jwt", token, getCookieOptions());

    return token;
};

export const clearTokenCookie = (res) => {
    res.cookie("jwt", "", {
        ...getCookieOptions(),
        maxAge: 0,
    });
};
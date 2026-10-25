import { parseCookie } from "cookie";
import User from "../model/user.model.js";
import { verifyToken } from "../util/token.js";

export const socketAuth = async (socket, next) => {
  try {
    const rawCookies = socket.handshake.headers.cookie || "";
    const cookies = parseCookie(rawCookies);

    const token = cookies.token;
    if (!token) return next(new Error("UNAUTHORIZED"));
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("username");
    if (!user) return next(new Error("UNAUTHORIZED"));
    socket.user = { id: user._id.toString(), username: user.username };
    next();
    
  } catch (err) {
    next(new Error("UNAUTHORIZED"));
  }
};
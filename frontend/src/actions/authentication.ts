"use server";
/** @notice Local imports */
import { cookies } from "next/headers";
import { sign, verify } from "jsonwebtoken";

const COOKIE_SECRET = process.env.COOKIE_SECRET;

export const setCookieOnAuth = async (payload: {
  address: string;
  nonce: string;
}) => {
  const cookieStore = await cookies();
  const authCookie = sign(payload, COOKIE_SECRET!);
  cookieStore.set("orbitsphere", authCookie, {
    httpOnly: true,
  });
};

export const removeAuthCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("orbitsphere");
};

export const getIsAuthenticated = async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("orbitsphere");
  if (!cookie) return null;

  try {
    const payload = verify(cookie.value, COOKIE_SECRET!) as {
      account: string;
    };
    return payload;
  } catch (error) {
    return null;
  }
};

import { CookieSetOptions } from 'universal-cookie'

export const AUTH_TOKEN_KEY = 'auth_token';

export interface SiteCookieValues {
  auth_token?: string;
}

export const SITE_COOKIES = [AUTH_TOKEN_KEY];

export const cookieDefaults: CookieSetOptions = {
  path: "/",
  secure: true,
  sameSite: "strict",
  domain: process.env.NODE_ENV === "production" ? "pricetra.com" : undefined,
}

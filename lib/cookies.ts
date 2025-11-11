import { CookieSetOptions } from 'universal-cookie'

export const SITE_COOKIES = ['auth_token'];

export const cookieDefaults: CookieSetOptions = {
  path: "/",
  secure: true,
  sameSite: "strict",
  domain: process.env.NODE_ENV === "production" ? "pricetra.com" : undefined,
}

"use server"

import { DocumentNode, print } from "graphql";
import { cookies } from "next/headers";
import { AUTH_TOKEN_KEY } from "./cookies";

export async function fetchGraphql<V, R>(DOCUMENT: DocumentNode, type: 'query' | 'mutation', variables?: V, token?: string) {
  const headers: HeadersInit = {
    "content-type": "application/json;charset=UTF-8",
  }

  let authToken = token;
  if (!token) {
    const cookieList = await cookies();
    authToken = cookieList.get(AUTH_TOKEN_KEY)?.value;
  }

  if (authToken) {
    headers['authorization'] = `Bearer ${authToken}`;
  }

  const body: { [key: string]: unknown } = {}
  body["query"] = print(DOCUMENT);
  if (variables) {
    body['variables'] = variables
  }

  try {
    const res = await fetch(process.env.API_URL ?? "https://api.pricetra.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return await res.json() as { data?: R, errors?: unknown };
  } catch (err) {
    console.error("Fetch error", body[type], body['variables'], err);
    throw err;
  }
}

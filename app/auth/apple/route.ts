import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  const code = formData.get("code");
  const idToken = formData.get("id_token");
  const state = formData.get("state");
  const user = formData.get("user"); // JSON string (first login only)

  if (!code || !idToken) {
    return NextResponse.json(
      { error: "Missing code or id_token from Apple" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams();
  params.append("code", code.toString());
  params.append("id_token", idToken.toString());
  if (user) {
    params.append("user", user.toString());
  }

  if (state) {
    const parsedState: {returnTo?: string | null} = JSON.parse(state.toString());
    if (parsedState.returnTo) {
      if (!parsedState.returnTo.startsWith("http://localhost:")) {
        return NextResponse.json(
          { error: "Invalid returnTo URL in state" },
          { status: 400 }
        );
      }

      const url = `${parsedState.returnTo}?${params.toString()}`;
      return NextResponse.redirect(url, 303);
    }
  }

  return NextResponse.redirect(`https://pricetra.com/auth/apple/success?${params.toString()}`, 303);
}

export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "GET method not allowed in production" },
      { status: 405 }
    );
  }

  const params = new URL(req.url).searchParams;
  if (!params.get('code') || !params.get('id_token')) {
    return NextResponse.json(
      { error: "Missing code or id_token from Apple" },
      { status: 400 }
    );
  }

  return NextResponse.redirect(`http://localhost:3000/auth/apple/success?${params.toString()}`, 303);
}

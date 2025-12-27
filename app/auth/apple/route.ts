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

  if (state) {
    const parsedState = JSON.parse(state.toString());
    if (parsedState.returnTo) {
      const params = new URLSearchParams();
      params.append("code", code.toString());
      params.append("id_token", idToken.toString());
      if (user) {
        params.append("user", user.toString());
      }

      const url = `${parsedState.returnTo}?${params.toString()}`;
      console.log("Redirecting to:", url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.json({
    code: code.toString(),
    idToken: idToken.toString(),
    user: user ? user.toString() : null,
  });
}

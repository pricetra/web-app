import { NextResponse } from "next/server";
import { handleOAuthRedirectStateValue } from "../utils";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";

export async function GET(req: Request) {
  const parsedUrl = parseUrl(req.url)
  const reqSearchParams = new URLSearchParams(parsedUrl.search);
  const code = reqSearchParams.get("code");
  const state = reqSearchParams.get("state");
  if (!code) {
    return NextResponse.json(
      { error: "Missing code or id_token from Apple" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams();
  params.append("code", code.toString());

  handleOAuthRedirectStateValue(params, state);
  return NextResponse.redirect(`https://pricetra.com/auth/yahoo/success?${params.toString()}`, 303);
}

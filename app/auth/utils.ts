import { NextResponse } from "next/server";

export function handleOAuthRedirectStateValue(
  params: URLSearchParams,
  state: FormDataEntryValue | null,
) {
  if (!state) return;

  let parsedState: { returnTo?: string | null } = {};
  try {
    parsedState = JSON.parse(state.toString());
  } catch {
    return NextResponse.json(
      { error: "Invalid state param" },
      { status: 400 },
    );
  }
  if (!parsedState.returnTo) return;

  if (!parsedState.returnTo.startsWith("http://localhost:")) {
    return NextResponse.json(
      { error: "Invalid returnTo URL in state" },
      { status: 400 },
    );
  }

  const url = `${parsedState.returnTo}?${params.toString()}`;
  return NextResponse.redirect(url, 303);
}

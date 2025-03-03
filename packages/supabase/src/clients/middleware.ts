import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const localeRegex = /^\/(en|fr|de)(\/|$)/; // Add supported locales here

export async function updateSession(
  request: NextRequest,
  i18nResponse?: NextResponse,
) {
  // Use the i18n response if provided, otherwise create a new response
  let supabaseResponse =
    i18nResponse ??
    NextResponse.next({
      request,
    });

  const url = new URL("/", request.url);
  const nextUrl = request.nextUrl;

  const pathnameWithoutLocale = nextUrl.pathname.replace(localeRegex, "/");
  const newUrl = new URL(pathnameWithoutLocale || "/", request.url);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({
            request,
          });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !newUrl.pathname.startsWith("/teams/invite/") &&
    !newUrl.pathname.startsWith("/login") &&
    !newUrl.pathname.startsWith("/signup")
  ) {
    const encodedSearchParams = `${newUrl.pathname.substring(1)}${newUrl.search}`;

    const url = new URL("/login", request.url);

    if (encodedSearchParams) {
      url.searchParams.append("return_to", encodedSearchParams);
    }

    return NextResponse.redirect(url);
  }
  const {
    data: { user: userData },
  } = await supabase.auth.getUser();

  // If authenticated but no full_name redirect to user setup page
  if (
    newUrl.pathname !== "/setup" &&
    newUrl.pathname !== "/teams/create" &&
    userData &&
    !userData?.user_metadata?.full_name
  ) {
    // Check if the URL contains an invite code
    const inviteCodeMatch = newUrl.pathname.startsWith("/teams/invite/");

    if (inviteCodeMatch) {
      return NextResponse.redirect(`${url.origin}${newUrl.pathname}`);
    }

    return NextResponse.redirect(`${url.origin}/setup`);
  }

  // if (session?.access_token) {
  //   const jwt = jwtDecode<JwtPayload>(session.access_token);

  //   // if not a business account, redirect to the home page
  //   if (!jwt.industry || jwt.industry !== "business") {
  //     // sign out & redirect to login
  //     await supabase.auth.signOut();
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }

  const { data: mfaData } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  // Enrolled for mfa but not verified
  if (
    mfaData &&
    mfaData.nextLevel === "aal2" &&
    mfaData.nextLevel !== mfaData.currentLevel &&
    newUrl.pathname !== "/mfa/verify"
  ) {
    return NextResponse.redirect(`${url.origin}/mfa/verify`);
  }

  return supabaseResponse;
}

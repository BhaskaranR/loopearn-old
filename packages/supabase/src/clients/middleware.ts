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

  // 1. Not authenticated
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

  // If authenticated, proceed with other checks
  if (user) {
    // 2. Check user setup (full_name)
    if (
      newUrl.pathname !== "/setup" &&
      newUrl.pathname !== "/teams/create" &&
      newUrl.pathname !== "/teams" &&
      !userData?.user_metadata?.full_name
    ) {
      // Check if the URL contains an invite code
      const inviteCodeMatch = newUrl.pathname.startsWith("/teams/invite/");

      if (inviteCodeMatch) {
        // Allow proceeding to invite page even without setup
        // Redirecting with the original path including locale if present
        return NextResponse.redirect(
          `${url.origin}${request.nextUrl.pathname}`,
        );
      }
      // Redirect to setup if not on setup, create team, or invite page and full_name is missing
      return NextResponse.redirect(`${url.origin}/setup`);
    }

    // 3. Check MFA Verification
    const { data: mfaData } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (
      mfaData &&
      mfaData.nextLevel === "aal2" &&
      mfaData.nextLevel !== mfaData.currentLevel &&
      newUrl.pathname !== "/mfa/verify"
    ) {
      // Redirect to MFA verification if needed and not already there
      return NextResponse.redirect(`${url.origin}/mfa/verify`);
    }

    // 4. Check for team selection (Only if authenticated, setup complete, and MFA verified if necessary)
    if (
      newUrl.pathname !== "/mfa/verify" && // Ensure we don't redirect away from MFA verify
      !newUrl.pathname.startsWith("/teams") && // Allow access to team pages
      !request.cookies.has(selectedTeamIdCookieName) // Check if team cookie is missing
    ) {
      // Redirect to team selection page if no team is selected and not on a team-related page or MFA page
      return NextResponse.redirect(`${url.origin}/teams`);
    }
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

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let { action, ...payload } = await req.json();

    console.log(`[API Auth] Action: ${action}`, payload);

    const isDev = process.env.FLAG === "development";

    if (isDev) {
      const mockData = {
        register: { id: 1, ...payload },
        login: { access: "mock-access", refresh: "mock-refresh" },
        refresh: { access: "new-access", refresh: "new-refresh" },
        logout: {},
      }[action];

      const res = NextResponse.json(mockData);

      if (action === "logout") {
        res.cookies.delete("access_token");
        res.cookies.delete("refresh_token");
      }

      if (["login", "refresh"].includes(action)) {
        res.cookies.set("access_token", mockData.access);
        res.cookies.set("refresh_token", mockData.refresh);
      }

      return res;
    }

    const endpoints = {
      login: "/api/token/",
      register: "/api/auth/register/",
      refresh: "/api/token/refresh/",
      logout: "/api/auth/logout/",
    };

    if (!endpoints[action]) {
      return NextResponse.json(
        { error: "Invalid action type" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.DJANGO_API?.replace(/\/$/, "");
    const endpoint = endpoints[action].replace(/^\//, "");
    const url = `${baseUrl}/${endpoint}`;

    console.log("url = ", url);

    let body = payload;
    console.log("body = ", JSON.stringify(body));

    if (action === "logout") {
      body = { refresh: (await cookies()).get("refresh_token")?.value };
    }
    if (action === "refresh") {
      body = { refresh: (await cookies()).get("refresh_token")?.value };
    }

    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error("Network error:", error);
      return NextResponse.json(
        { error: `Network error: ${error.message}` },
        { status: 500 }
      );
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Backend error:", {
        status: response.status,
        url,
        errorData,
      });

      return NextResponse.json(
        { error: `Backend error: ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const nextRes = NextResponse.json(data);
    // let cookieOptions = {
    //   httpOnly: true,
    //   secure: !isDev,
    //   sameSite: "strict",
    //   path: "/",
    // };

    if (["login", "refresh"].includes(action)) {
      // cookieOptions = {
      //   httpOnly: true,
      //   secure: !isDev,
      //   sameSite: "strict",
      //   path: "/",
      // };

      if (data.access) {
        nextRes.cookies.set("access_token", data.access, {
          httpOnly: true,
          secure: !isDev,
          sameSite: "strict",
          path: "/",
        });
      }
      if (data.refresh) {
        nextRes.cookies.set("refresh_token", data.refresh, {
          httpOnly: true,
          secure: !isDev,
          sameSite: "strict",
          path: "/",
        });
      }
    }

    return nextRes;
  } catch (error) {
    console.error("Global error handler:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // eslint-disable-next-line prefer-const
    let { action, ...payload } = await req.json();

    // Разработка
    // if (process.env.NODE_ENV === "development") {
    //   const mockData =
    //     action === "register"
    //       ? { id: 1, ...payload }
    //       : { access: "mock-access", refresh: "mock-refresh" };

    //   console.log(mockData);

    //   const res = NextResponse.json(mockData);
    //   if (action === "logout") {
    //     res.cookies.delete("access_token");
    //     res.cookies.delete("refresh_token");
    //     return res;
    //   }
    //   if (action !== "register") {
    //     res.cookies.set("access_token", mockData.access);
    //     res.cookies.set("refresh_token", mockData.refresh);
    //   }
    //   return res;
    // }

    // Прод
    const endpoints: { [key: string]: string } = {
      // login: "/api/auth/login/",
      login: "/api/token/",
      register: "/api/auth/register/",
      refresh: "/api/token/refresh/",
      logout: "/api/auth/logout/",
    };

    const refreshToken = (await cookies()).get("refresh_token")?.value;
    const accessToken = (await cookies()).get("access_token")?.value;

    if (action === "logout") {
      payload = {
        refresh_token: refreshToken,
      };
    } else if (action === "refresh") {
      payload = {
        refresh: refreshToken,
      };
    }

    const response = await fetch(
      `${process.env.DJANGO_API}${endpoints[action]}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(!["login", "register"].includes(action) && {
            Authorization: `Bearer ${accessToken}`,
          }),
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    const nextRes = NextResponse.json(data);

    console.log("access = ", data);

    if (action === "login") {
      nextRes.cookies.set("access_token", data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      nextRes.cookies.set("refresh_token", data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    } else if (action === "refresh") {
      nextRes.cookies.set("access_token", data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      nextRes.cookies.set("refresh_token", data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    } else if (action === "logout") {
      nextRes.cookies.delete("access_token");
      nextRes.cookies.delete("refresh_token");
    }

    return nextRes;
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

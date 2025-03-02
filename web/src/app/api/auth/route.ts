import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { action, ...payload } = await req.json();

    // Разработка
    if (process.env.NODE_ENV === "development") {
      const mockData =
        action === "register"
          ? { id: 1, ...payload }
          : { access: "mock-access", refresh: "mock-refresh" };

      const res = NextResponse.json(mockData);
      if (action !== "register") {
        res.cookies.set("access_token", mockData.access);
        res.cookies.set("refresh_token", mockData.refresh);
      }
      return res;
    }

    // Прод
    const endpoints: { [key: string]: string } = {
      login: "/api/auth/login/",
      register: "/api/auth/register/",
      refresh: "/api/auth/refresh/",
    };

    const response = await fetch(
      `${process.env.DJANGO_API}${endpoints[action]}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    const nextRes = NextResponse.json(data);

    if (action === "login" || action === "refresh") {
      nextRes.cookies.set("access_token", data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      nextRes.cookies.set("refresh_token", data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }

    return nextRes;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

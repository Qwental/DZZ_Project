import { NextResponse } from "next/server";
import { login, refreshToken } from "@/lib/api";

export async function POST(request: Request) {
  const { action, ...payload } = await request.json();

  if (process.env.NODE_ENV === "development") {
    if (action === "register") {
      const mockData = {
        id: 1,
        username: payload.username,
        email: payload.email,
      };

      return NextResponse.json(mockData);
    }
    const mockData = {
      access: "mock-access-token",
      refresh: "mock-refresh-token",
    };

    const response = NextResponse.json(mockData);
    response.cookies.set("access_token", mockData.access);
    response.cookies.set("refresh_token", mockData.refresh);
    return response;
  }

  try {
    let data;
    if (action === "login") {
      data = await login(payload.username, payload.password);
    } else if (action === "refresh") {
      data = await refreshToken(payload.refresh);
    }

    const response = NextResponse.json(data);
    response.cookies.set("access_token", data.access, { httpOnly: true });
    response.cookies.set("refresh_token", data.refresh, { httpOnly: true });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}

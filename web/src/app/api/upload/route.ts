import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("я зашел сюды");
  try {
    // Моки для проверки
    if (process.env.NODE_ENV === "development") {
      const mockUrls = [
        "https://i.imgur.com/YzFSzED.jpeg",
        "https://i.imgur.com/3giN25k.jpeg",
      ];
      return NextResponse.json({ urls: mockUrls });
    }

    // Прод
    const formData = await req.formData();
    // const files = formData.getAll("images") as File[];

    const accessToken = (await cookies()).get("access_token")?.value;

    const djangoResponse = await fetch(
      `${process.env.DJANGO_API}/api/upload/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!djangoResponse.ok) {
      throw new Error("Ошибка загрузки изображений");
    }

    const data = await djangoResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

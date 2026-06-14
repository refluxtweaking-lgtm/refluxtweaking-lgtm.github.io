import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { REFLUX_BRAND_BANNER } from "@/data/downloads";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "downloads", REFLUX_BRAND_BANNER.filename);

  try {
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${REFLUX_BRAND_BANNER.filename}"`,
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Banner not found" }, { status: 404 });
  }
}

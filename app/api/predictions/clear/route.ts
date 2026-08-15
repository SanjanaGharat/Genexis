export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { clearPredictionsForDevice } from "@/lib/predictionsRepo";

export async function DELETE(req: NextRequest) {
  const deviceId = req.headers.get("x-device-id");
  if (!deviceId) {
    return NextResponse.json({ error: "Missing x-device-id header." }, { status: 400 });
  }

  try {
    const deleted = clearPredictionsForDevice(deviceId);
    return NextResponse.json({ deleted });
  } catch (err) {
    console.error("Failed to clear predictions:", err);
    return NextResponse.json({ error: "Database delete failed." }, { status: 500 });
  }
}

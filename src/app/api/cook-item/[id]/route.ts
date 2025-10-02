import { db } from "@/db/drizzle";
import { cookItem } from "@/db/schema";
import { formatActionResponse } from "@/lib/formatActionResponse";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop(); // Extract 'id' from the URL path

    if (!id) {
      return NextResponse.json(
        formatActionResponse(null, false, 400, "ID is required")
      );
    }

    const deleteResult = await db.delete(cookItem).where(eq(cookItem.id, id));

    if (deleteResult.rowCount === 0) {
      return NextResponse.json(
        formatActionResponse(null, false, 404, "Item not found")
      );
    }

    return NextResponse.json(
      formatActionResponse(deleteResult, true, 200, "Item deleted successfully")
    );
  } catch (error) {
    console.error("Error deleting cook item:", error);
    return NextResponse.json(
      formatActionResponse(null, false, 500, "Internal server error")
    );
  }
}

import { WishlistItem } from "@/service/wishlist-item/wishlist-item";
import { Search } from "@upstash/search";
import { NextRequest } from "next/server";

const semanticSearchClient = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN,
});

export interface SyncSemanticStoreRequest {
  userId: string;
  userWishlistItems: WishlistItem[];
}

export async function POST(request: NextRequest) {
  const { userId, userWishlistItems }: SyncSemanticStoreRequest =
    await request.json();

  console.log(`\n--- Sync request received ---`);
  console.log(`User ID: ${userId}`);
  console.log(`Incoming items count: ${userWishlistItems.length}`);
  console.log(
    `Incoming items:`,
    userWishlistItems.map((i) => i.id)
  );

  try {
    const indexInfo = await semanticSearchClient.index(userId).info();
    const documentCount = indexInfo.documentCount;

    console.log(`Current index document count: ${documentCount}`);

    // If database has more items, add the missing ones
    if (userWishlistItems.length > documentCount) {
      console.log(
        `Adding ${userWishlistItems.length - documentCount} missing items...`
      );

      const existingItemsResponse = await semanticSearchClient
        .index(userId)
        .range({
          cursor: "0",
          limit: documentCount,
        });

      console.log(
        `Fetched ${existingItemsResponse.documents.length} existing items from index`
      );
      const existingIds = new Set(
        existingItemsResponse.documents.map((item) => item.id)
      );
      const itemsToAdd = userWishlistItems.filter(
        (item) => !existingIds.has(item.id)
      );

      console.log(
        `Items to add:`,
        itemsToAdd.map((i) => i.id)
      );

      for (const item of itemsToAdd) {
        console.log(`Upserting new item: ${item.id}`);
        await semanticSearchClient.index(userId).upsert({
          id: item.id,
          content: {
            title: item.title,
            description: item.description,
            price: item.price,
            purchased: item.purchased,
          },
          metadata: {
            imageUrl: item.imageUrl,
            url: item.url,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            lastAccessed: new Date().toISOString(),
          },
        });
      }
    }
    // If database has fewer items, remove the extra ones
    else if (userWishlistItems.length < documentCount) {
      console.log(
        `Removing ${documentCount - userWishlistItems.length} extra items...`
      );

      const existingItemsResponse = await semanticSearchClient
        .index(userId)
        .range({
          cursor: "0",
          limit: documentCount,
        });

      const dbIds = new Set(userWishlistItems.map((item) => item.id));
      const itemsToDelete = existingItemsResponse.documents
        .filter((item) => !dbIds.has(item.id))
        .map((item) => item.id);

      console.log(`Items to delete:`, itemsToDelete);

      if (itemsToDelete.length > 0) {
        await semanticSearchClient.index(userId).delete(itemsToDelete);
      }
    }
    // If counts match, just update all items
    else {
      console.log(
        `Counts match, updating all ${userWishlistItems.length} items...`
      );
      for (const item of userWishlistItems) {
        console.log(`Upserting item: ${item.id}`);
        await semanticSearchClient.index(userId).upsert({
          id: item.id,
          content: {
            title: item.title,
            description: item.description,
            price: item.price,
            purchased: item.purchased,
          },
          metadata: {
            imageUrl: item.imageUrl,
            url: item.url,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            lastAccessed: new Date().toISOString(),
          },
        });
      }
    }

    console.log(`✅ Sync completed for user ${userId}`);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("❌ Error syncing wishlist items:", error);
    return new Response(
      JSON.stringify({ error: "Failed to sync wishlist items" }),
      { status: 500 }
    );
  }
}

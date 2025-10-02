import { formatActionResponse } from "@/lib/formatActionResponse";
import type { WishlistItem } from "@/service/wishlist-item/wishlist-item";
import { SearchItemResult } from "@/types/search";
import { Search } from "@upstash/search";
import { NextRequest, NextResponse } from "next/server";

const semanticSearchClient = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN,
});

export interface SemanticSearchRequest {
  userId: string;
  query: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SemanticSearchRequest = await request.json();
    const { userId, query } = body;

    const response = await semanticSearchClient.index(userId).search({
      query,
    });

    const relevantResults = response.filter((item) => item.score > 0.5);
    const transformesResults = transformToWishlistItem(relevantResults, userId);

    const formattedResponse = formatActionResponse(
      transformesResults,
      true,
      200
    );
    return NextResponse.json(formattedResponse); // Added return statement
  } catch (error) {
    console.error(
      "Something went wrong while making the semantic search",
      error
    );
    const errorResponse = formatActionResponse({}, false, 500);
    return NextResponse.json(errorResponse); // Added return statement
  }
}

function transformToWishlistItem(data: any, userId: string) {
  const transformedData: WishlistItem[] = data.map((item: SearchItemResult) => {
    return {
      userId: userId,
      id: item.id,
      title: item.content.title,
      description: item.content.description,
      price: item.content.price,
      imageUrl: item.metadata.imageUrl,
      url: item.metadata.url,
      createdAt: item.metadata.createdAt,
      updatedAt: item.metadata.updatedAt,
      lastAccessed: item.metadata.lastAccessed,
      purchased: item.content.purchased,
    };
  });

  return transformedData;
}

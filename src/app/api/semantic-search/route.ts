import { formatActionResponse } from "@/lib/formatActionResponse";
import { WishlistItem } from "@/service/wishlist-item/wishlist-item";
import { Search } from "@upstash/search";
import { NextRequest, NextResponse } from "next/server";


const semanticSearchClient = new Search({
    url: process.env.UPSTASH_SEARCH_REST_URL,
    token: process.env.UPSTASH_SEARCH_REST_TOKEN,
});

interface AddToSemanticDatabaseRequest {
    userId: string
    wishlistItem: WishlistItem
}

export async function POST(request: NextRequest) {
    try {
        const { userId, wishlistItem }: AddToSemanticDatabaseRequest = await request.json()

        const response = await semanticSearchClient.index(userId).upsert({
            id: wishlistItem.id,
            content: {
                title: wishlistItem.title,
                description: wishlistItem.description,
                price: wishlistItem.price,
                purchased: wishlistItem.purchased
            },
            metadata: {
                imageUrl: wishlistItem.imageUrl,
                url: wishlistItem.url,
                createdAt: wishlistItem.createdAt,
                updatedAt: wishlistItem.updatedAt,
                lastAccessed: new Date().toISOString()
            }
        })
        const formattedResponse = formatActionResponse(response, true, 200)
        return NextResponse.json(formattedResponse)
    } catch (error) {
        console.error("Something went wrong: ", error)
        const errorResponse = formatActionResponse({}, false, 500)
        return NextResponse.json(errorResponse) // Added return statement
    }
}
export interface SearchItemResult {
  id: string;
  content: {
    title: string;
    description: string;
    price: number;
    purchased: boolean;
  };
  metadata: {
    lastAccessed: string;
    imageUrl: string;
    url: string;
    createdAt: string;
    updatedAt: string;
  };
  score: number;
}

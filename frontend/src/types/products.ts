type Ratings = {
  rate: number;
  count: number;
};

type Products = {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: Ratings;
  title: string;
};

export type { Products };

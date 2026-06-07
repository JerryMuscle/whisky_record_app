export type User = {
  id: string;
  email: string;
  username: string;
  cognito_sub: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Bottle = {
  id: string;
  user_id: string;
  name: string;
  distillery: string;
  region: string;
  bottle_type: string | null;
  abv: number | null;
  price: number | null;
  photo_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type FlavorTag = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type TastingSession = {
  id: string;
  bottle_id: string;
  tasted_at: string;
  rating: number;
  serving_style: string | null;
  location: string | null;
  situation: string | null;
  memo: string | null;
  want_again: boolean | null;
  f_smoky: number | null;
  f_fruity: number | null;
  f_floral: number | null;
  f_spicy: number | null;
  f_woody: number | null;
  flavor_tags: FlavorTag[];
  created_at: string;
};

export type ApiError = {
  errors?: Record<string, string[]>;
  error?: string;
};

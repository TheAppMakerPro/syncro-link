export interface MapPoint {
  id: string;
  displayName: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  avatarUrl: string | null;
  bio: string;
  contactInfo: string;
}

export interface PostWithUser {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  hashtags: { hashtag: { id: string; name: string } }[];
  media: { id: string; url: string; type: string }[];
}

export interface HashtagWithCount {
  id: string;
  name: string;
  _count: { posts: number };
}

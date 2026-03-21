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
  markerColor: string;
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

export interface ChatRoomWithMeta {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  memberCount: number;
  lastMessage: {
    content: string;
    createdAt: string;
    sender: { displayName: string };
  } | null;
  unreadCount: number;
}

export interface MessageWithSender {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

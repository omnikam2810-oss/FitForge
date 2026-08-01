import { apiClient } from './client';

const unwrap = <T>(response: any): T => response.data.data ?? response.data;

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export const getFeed = async (): Promise<CommunityPost[]> => {
  const response = await apiClient.get('/community/feed');
  return unwrap(response);
};

export const createPost = async (content: string): Promise<CommunityPost> => {
  const response = await apiClient.post('/community/posts', { content });
  return unwrap(response);
};

export const likePost = async (postId: string): Promise<void> => {
  await apiClient.post(`/community/posts/${postId}/like`);
};

import { apiClient } from './client';

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
  return response.data;
};

export const createPost = async (content: string): Promise<CommunityPost> => {
  const response = await apiClient.post('/community/posts', { content });
  return response.data;
};

export const likePost = async (postId: string): Promise<void> => {
  await apiClient.post(`/community/posts/${postId}/like`);
};

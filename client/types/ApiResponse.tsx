export interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: User;
  post?: PostType;
  clientSecret?: string;
}

export interface LoginApiResponse extends ApiResponse {
  user: User;
}

export interface GetUserApiResponse extends ApiResponse {
  data: User;
}

export interface FetchChatGroups {
  id?: string;
  user_id?: string;
  title?: string;
  password?: string;
  created_at?: string;
}

export interface FetchChatGroupUserType {
  id: number;
  username: string;
  group_id: string;
  created_at: string;
}

export interface ApiResponseRatingSolutionType extends ApiResponse {}

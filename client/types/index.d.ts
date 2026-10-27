declare interface User {
  id?: string;
  username?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  provider?: string;
  oauth_id?: string;
  created_at?: string;
  jwtToken?: string;
  profile_image?: string;
  image?: string | StaticImport;
  coin?: string;
  free_coin_use?: string;
}

declare interface CreateGoogleAndGitHubUserProps {
  username?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  provider?: string;
  oauth_id?: string;
  profile_image?: string;
}

declare interface MessageType {
  id?: string;
  username: ?string;
  created_at?: string;
  group_id?: string;
  message?: string;
}

declare interface GroupChatUserType {
  id: number;
  username: string;
  group_id: string;
  created_at: string;
}

declare interface EventType {
  id?: string;
  title?: string;
  user_id?: string;
  date_of_event?: string;
  created_at?: string;
}

declare interface RatingsType {
  id: string;
  solution_id: string;
  user_id: string;
  created_at: string;
}

declare interface SolutionType {
  id: string;
  solution: string;
  rating_on_solution: number;
  post_id: string;
  created_at: string;
  username: string;
  Ratings?: Array<RatingsType> | [];
}

declare interface PostType {
  id: string;
  username: string;
  title: string;
  description: string;
  post_image: string;
  created_at: string;
  user_id: string;
  tags?: string[];
  is_solved?: boolean;
  accepted_solution_id?: string | null;
  Solutions?: Array<SolutionType> | [];
}

declare interface ContestProblemType {
  id: string;
  contest_id: string;
  title: string;
  description: string;
  constraints: string;
  examples: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  order_index: number;
}

declare interface ContestParticipantType {
  id: string;
  contest_id: string;
  user_id: string;
  username: string;
  total_points: number;
  joined_at: string;
}

declare interface ContestType {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  creator_username: string;
  start_time: string;
  end_time: string;
  created_at: string;
  Problems?: ContestProblemType[];
  Participants?: ContestParticipantType[];
}

declare interface ContestSubmissionType {
  id: string;
  contest_id: string;
  problem_id: string;
  user_id: string;
  username: string;
  language: string;
  code: string;
  score: number;
  status: string;
  feedback: string;
  time_complexity: string;
  submitted_at: string;
}

declare interface NotificationType {
  id: string;
  user_id: string;
  type: string;
  message: string;
  post_id?: string | null;
  is_read: boolean;
  created_at: string;
}

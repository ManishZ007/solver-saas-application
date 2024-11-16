declare interface CreateUserProps {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
  provider?: string;
  oauth_id?: string;
}

declare interface LoginUserProps {
  identifier?: string;
}

interface AuthUser {
  id: string;
  username: string;
  email: string;
}

declare namespace Express {
  export interface Request {
    user?: AuthUser;
  }
}

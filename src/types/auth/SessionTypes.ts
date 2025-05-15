
export interface Session {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface SessionContextProps {
  session: Session | null;
  isLoading: boolean;
}

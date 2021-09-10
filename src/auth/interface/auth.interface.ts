export type JwtPayload = {
  username: string;
  userId: string;
  roles?: string[];
};

export type JwtSigned = JwtPayload & {
  expires_in: number;
  access_token: string;
};

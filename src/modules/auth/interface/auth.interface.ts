export type JwtPayload = {
  sub: string;
  username: string;
  roles?: string[];
};

export type JwtSigned = JwtPayload & {
  expiresIn: number;
  accessToken: string;
};

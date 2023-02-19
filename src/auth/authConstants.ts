export const authConstants = {
  jwt_secretAT: process.env.ACCESS_TOKEN_SECRET || '123456',
  jwt_secretRT: process.env.REFRESH_TOKEN_SECRET || '987654',
};

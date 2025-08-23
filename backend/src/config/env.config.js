import dotenv from "dotenv";

dotenv.config();

export const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;

export const port = process.env.PORT;
export const frontendUrl = process.env.FRONTEND_URL;
export const databaseUrl = process.env.DATABASE_URL;
export const arcJetKey = process.env.ARCJET_KEY;
export const arcJetEnv = process.env.ARCJET_ENV;

// JWT Configuration
export const jwtSecretAccessToken = process.env.JWT_SECRET_ACCESS_TOKEN;
export const jwtAccessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXP;
export const jwtSecretRefreshToken = process.env.JWT_SECRET_REFRESH_TOKEN;
export const jwtRefreshTokenExpiry = process.env.JWT_REFRESH_TOKEN_EXP;

// Tax rate
export const taxRate = process.env.TAX_RATE;

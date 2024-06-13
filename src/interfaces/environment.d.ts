declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      FRONTEND_URL: "http://127.0.01:5173";
      PORT?: number;
<<<<<<< HEAD
      MONGODB_URI: string;
=======
      ACCESS_TOKEN_SECRET: string;
      HUDDLE_API_KEY: string
>>>>>>> 24c95cdf3e8c319e751fb05975f039972b920e0f
    }
  }
}

export {};

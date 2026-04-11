export const routes = {
  blogs: "/blogs",
  posts: "/posts",
  testing: "/testing/all-data",

  auth: {
    registration: "/auth/registration",
    registrationConfirm: "/auth/registration-confirmation",
    registrationResendCode: "/auth/registration-email-resending",
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
    refreshToken: "/auth/refresh-token",
  },

  deviceSessions: "/security/devices",

  users: "/users",
  comments: "/comments",
} as const;

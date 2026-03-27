export const routes = {
  blogs: "/blogs",
  posts: "/posts",
  testing: "/testing/all-data",

  auth: {
    registration: "/auth/registration",
    registrationConfirm: "/auth/registration-confirmation",
    registrationResendCode: "/auth/registration-email-resending",
    login: "/auth/login",
    me: "/auth/me",
    refreshToken: "refresh-token",
  },

  users: "/users",
  comments: "/comments",
} as const;

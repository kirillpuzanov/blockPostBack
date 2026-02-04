export const HTTP_STATUS = {
  ok: 200,
  created: 201,
  noContent: 204,

  badRequest: 400,
  unAuthorized: 401,
  forbidden: 403,
  notFound: 404,

  serverError: 500,
} as const;

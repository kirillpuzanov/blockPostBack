declare global {
  namespace Express {
    export interface Request {
      userMetaData: { userId: string } | null;
    }
  }
}
export {};

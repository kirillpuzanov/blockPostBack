declare global {
  namespace Express {
    export interface Request {
      userMetaData: { id: string } | null;
    }
  }
}
export {};

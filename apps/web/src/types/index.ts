export interface IRunStatusResponseDataScore {
  jobId: string;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
  id: string;
}

export interface IRunStatusResponseData {
  name: string;
  progress: string;
  scores: IRunStatusResponseDataScore[];
  id: string;
}

export interface IRunRequestPayload {
  name: string;
  loginUrl: string;
  usernameSelector: string;
  passwordSelector: string;
  submitSelector: string;
  hasPin: boolean;
  pinSelector: string;
  username: string;
  password: string;
  pin: string;
  url: string;
  count: number;
}

export interface IRunStatusRequestPayload {
  measureMongoId: string
}

export interface IRunResponseData {
  run: boolean
  measureMongoId: string
}

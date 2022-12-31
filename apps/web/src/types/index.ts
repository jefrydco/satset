export interface IRunStatusResponseDataScore {
  jobId: string;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
  id: string;
}

export interface IRunStatusResponseDataChart {
  dataset: (string | number)[][];
}

export enum IRunStatusProgressResponseDataEnum {
  INIT = 'INIT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface IRunStatusResponseData {
  exists: boolean;
  name: string;
  progress: IRunStatusProgressResponseDataEnum;
  scores: IRunStatusResponseDataScore[];
  id: string;
  chart: IRunStatusResponseDataChart;
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
  count: string;
}

export interface IRunStatusRequestPayload {
  measureMongoId: string
}

export interface IRunResponseData {
  run: boolean
  measureMongoId: string
}

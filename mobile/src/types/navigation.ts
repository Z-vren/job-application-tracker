import { Application } from './index';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  ApplicationsList: undefined;
  ApplicationForm: { application?: Application } | undefined;
  ApplicationDetail: { application: Application };
};


export const PATH = {
  auth: ['auth'],
  isFetching: ['isFetching'],
  ondokuList: ['ondokuList'],
};

export type Assginment = {
  id: string;
  downloadURL: string;
};

export const INITIAL_ASSIGNMENT: Assginment = {
  id: '',
  downloadURL: '',
};

export type OndokuSentence = {
  id: string;
  japanese: string;
};

export type Ondoku = {
  id: string;
  createdAt: number;
  downloadURL: string;
  title: string;
  sentences: OndokuSentence[];
  assignments: Assginment[];
  assignmentSentences: string[];
};

export type AuthState = {
  uid: string;
  initializing: boolean;
};
const INITIAL_AUTH_STATE: AuthState = {
  uid: '',
  initializing: true,
};
export type State = {
  auth: AuthState;
  isFetching: boolean;
  ondokuList: Ondoku[];
};

export const INITIAL_STATE: State = {
  auth: INITIAL_AUTH_STATE,
  isFetching: false,
  ondokuList: [],
};

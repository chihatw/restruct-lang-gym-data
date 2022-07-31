import * as R from 'ramda';
import { AuthState, Ondoku, PATH, State } from './Model';
export const ActionTypes = {
  setAuth: 'setAuth',
  deleteOndoku: 'deleteOndoku',
  setOndokuList: 'setOndokuList',
  startFetching: 'startFetching',
};

export type Action = { type: string; payload?: string | Ondoku[] };

export const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;
  const { ondokuList } = state;
  switch (type) {
    case ActionTypes.setAuth: {
      const uid = payload as string;
      return R.compose(
        R.assocPath<AuthState, State>(PATH.auth, { uid, initializing: false })
      )(state);
    }
    case ActionTypes.startFetching: {
      return R.compose(R.assocPath<boolean, State>(PATH.isFetching, true))(
        state
      );
    }
    case ActionTypes.setOndokuList: {
      const ondokuList = payload as Ondoku[];
      return R.compose(
        R.assocPath<boolean, State>(PATH.isFetching, false),
        R.assocPath<Ondoku[], State>(PATH.ondokuList, ondokuList)
      )(state);
    }
    case ActionTypes.deleteOndoku: {
      const ondokuId = payload as string;
      const updatedList = ondokuList.filter((item) => item.id !== ondokuId);
      return R.compose(
        R.assocPath<Ondoku[], State>(PATH.ondokuList, updatedList)
      )(state);
    }
    default:
      return R.compose(R.identity)(state);
  }
};

import React, { useEffect, useReducer } from 'react';
import { AuthState, INITIAL_STATE } from './Model';
import { ActionTypes, reducer } from './Update';
import { auth as firebaseAuth } from './repositories/firebase';
import { Route, Routes } from 'react-router-dom';
import TopPage from './pages/TopPage';
import OndokuList from './pages/OndokuList';

const App = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { auth } = state;
  const { uid, initializing } = auth;

  // 認証判定
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      let _uid = user?.uid || '';
      if (uid !== _uid || initializing) {
        const auth: AuthState = {
          uid: _uid,
          initializing: false,
        };
        dispatch({
          type: ActionTypes.setAuth,
          payload: _uid,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, uid, initializing]);

  return (
    <Routes>
      <Route path='/' element={<TopPage state={state} dispatch={dispatch} />} />
      <Route
        path='/ondokus'
        element={<OndokuList state={state} dispatch={dispatch} />}
      />
    </Routes>
  );
};

export default App;

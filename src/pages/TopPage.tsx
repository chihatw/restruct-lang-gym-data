import { Button, Container } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { State } from '../Model';
import { Action, ActionTypes } from '../Update';

const TopPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const navigate = useNavigate();
  return (
    <Container sx={{ paddingTop: 2 }} maxWidth='sm'>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <Button
          variant='contained'
          onClick={() => {
            navigate('ondokus');
            dispatch({ type: ActionTypes.startFetching });
          }}
        >
          ondokus
        </Button>
      </div>
    </Container>
  );
};

export default TopPage;

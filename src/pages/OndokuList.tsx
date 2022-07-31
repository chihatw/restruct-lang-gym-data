import { Delete } from '@mui/icons-material';
import {
  Button,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import { ref } from 'firebase/storage';
import React, { useEffect } from 'react';
import { Ondoku, State } from '../Model';
import { storage } from '../repositories/firebase';
import { deleteStorage } from '../repositories/storage';
import {
  deleteAssignments,
  deleteAssignmentSentences,
  deleteOndoku,
  deleteOndokuSentences,
  getOndokus,
} from '../services/ondoku';
import { Action, ActionTypes } from '../Update';

const OndokuList = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { ondokuList, isFetching } = state;
  useEffect(() => {
    if (!isFetching) return;
    const fetchData = async () => {
      let _ondokuList: Ondoku[] = ondokuList;
      if (!_ondokuList.length) {
        _ondokuList = await getOndokus();
      }
      dispatch({ type: ActionTypes.setOndokuList, payload: _ondokuList });
    };
    fetchData();
  }, [isFetching]);
  return (
    <Container maxWidth='md' sx={{ paddingTop: 2 }}>
      <Table>
        <TableBody>
          {ondokuList.map((_, index) => (
            <OndokuRow
              key={index}
              index={index}
              state={state}
              dispatch={dispatch}
            />
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default OndokuList;

const OndokuRow = ({
  state,
  dispatch,
  index,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  index: number;
}) => {
  const { ondokuList } = state;
  const ondoku = ondokuList[index];
  const {
    id,
    title,
    createdAt,
    downloadURL,
    sentences,
    assignments,
    assignmentSentences,
  } = ondoku;
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const handleDelete = () => {
    /////////////
    // storage //
    /////////////

    if (downloadURL) {
      const audioURL = new URL(downloadURL);
      const path = audioURL.pathname
        .split('/')
        .slice(-1)[0]
        .replace('%2F', '/');
      deleteStorage(path);
    }

    const assignmentURLs = assignments
      .filter((assignment) => assignment.downloadURL)
      .map((assignment) => new URL(assignment.downloadURL));

    const aPathnames = assignmentURLs.map((url) =>
      url.pathname.split('/').slice(-1)[0].replace('%2F', '/')
    );

    // aPathnames
    for (const path of aPathnames) {
      deleteStorage(path);
    }

    ///////////////
    // firestore //
    ///////////////

    // assignmentSentences
    deleteAssignmentSentences(assignmentSentences);

    // assignment
    deleteAssignments(assignments.map((a) => a.id));

    // sentences
    deleteOndokuSentences(sentences.map((s) => s.id));

    // ondoku
    deleteOndoku(id);
    dispatch({ type: ActionTypes.deleteOndoku, payload: id });
  };
  return (
    <TableRow>
      <TableCell>{title}</TableCell>
      <TableCell>{`${year}/${month}/${day}`}</TableCell>
      <TableCell>
        <div>
          {sentences.map((sentence, index) => (
            <div key={index}>{sentence.japanese}</div>
          ))}
        </div>
      </TableCell>
      <TableCell>
        {!!downloadURL && (
          <span>
            <a href={downloadURL} style={{ whiteSpace: 'nowrap' }}>
              録音
            </a>
          </span>
        )}
      </TableCell>
      <TableCell>
        {assignments.map((assignment, index) => {
          if (!assignment.downloadURL) return <div key={index}></div>;
          return (
            <div key={index}>
              <a href={assignment.downloadURL} style={{ whiteSpace: 'nowrap' }}>
                提出
              </a>
            </div>
          );
        })}
      </TableCell>
      <TableCell>{assignmentSentences.length}</TableCell>
      <TableCell>
        <IconButton sx={{ fontSize: 20 }} size='small' onClick={handleDelete}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

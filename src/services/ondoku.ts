import {
  collection,
  orderBy,
  query,
  limit,
  getDocs,
  DocumentData,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { Assginment, Ondoku, OndokuSentence } from '../Model';
import { db } from '../repositories/firebase';

const COLLECTIONS = {
  ondokus: 'ondokus',
  oSentences: 'oSentences',
  aSentences: 'aSentences',
  assignments: 'assignments',
};

export const getOndokus = async (): Promise<Ondoku[]> => {
  let q = query(
    collection(db, COLLECTIONS.ondokus),
    orderBy('createdAt'),
    limit(10)
  );
  console.log('get ondokus');
  let querySnapshot = await getDocs(q);
  let ondokuList: Ondoku[] = [];
  if (!querySnapshot.size) return [];

  querySnapshot.forEach((doc) => {
    ondokuList.push(buildOndoku(doc));
  });

  await Promise.all(
    ondokuList.map(async (ondoku) => {
      const { id } = ondoku;
      const sentences: OndokuSentence[] = [];
      q = query(
        collection(db, COLLECTIONS.oSentences),
        where('ondoku', '==', id),
        orderBy('line')
      );
      console.log('get ondoku Sentences');
      querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        sentences.push(buildOndokuSentence(doc));
      });
      ondoku.sentences = sentences;

      const assignments: Assginment[] = [];
      q = query(
        collection(db, COLLECTIONS.assignments),
        where('ondoku', '==', id)
      );
      console.log('get assignment');
      querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        assignments.push(buildAssignment(doc));
      });
      ondoku.assignments = assignments;

      const assignmentSentences: string[] = [];
      q = query(
        collection(db, COLLECTIONS.aSentences),
        where('ondoku', '==', id)
      );
      console.log('get assignment sentences');
      querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        assignmentSentences.push(doc.id);
      });
      ondoku.assignmentSentences = assignmentSentences;
    })
  );

  return ondokuList;
};

export const deleteOndoku = (id: string) => {
  console.log('delete ondoku');
  deleteDoc(doc(db, COLLECTIONS.ondokus, id)).catch((err) => console.warn(err));
  return;
};

export const deleteOndokuSentences = (ids: string[]) => {
  for (const id of ids) {
    console.log('delete ondoku sentence');
    deleteDoc(doc(db, COLLECTIONS.oSentences, id)).catch((err) =>
      console.warn(err)
    );
  }
};

export const deleteAssignments = (ids: string[]) => {
  for (const id of ids) {
    console.log('delete assignment');
    deleteDoc(doc(db, COLLECTIONS.assignments, id)).catch((err) =>
      console.warn(err)
    );
  }
};

export const deleteAssignmentSentences = (ids: string[]) => {
  for (const id of ids) {
    console.log('delete aSentence');
    deleteDoc(doc(db, COLLECTIONS.aSentences, id)).catch((err) =>
      console.warn(err)
    );
  }
};

const buildOndoku = (doc: DocumentData) => {
  const { createdAt, downloadURL, title } = doc.data();
  const ondoku: Ondoku = {
    id: doc.id,
    createdAt: createdAt || 0,
    downloadURL: downloadURL || '',
    title: title || '',
    sentences: [],
    assignments: [],
    assignmentSentences: [],
  };
  return ondoku;
};

const buildOndokuSentence = (doc: DocumentData) => {
  const { japanese } = doc.data();
  const ondokuSentence: OndokuSentence = {
    id: doc.id,
    japanese: japanese || '',
  };
  return ondokuSentence;
};

const buildAssignment = (doc: DocumentData) => {
  const { downloadURL } = doc.data();
  const assignment: Assginment = {
    id: doc.id,
    downloadURL: downloadURL || '',
  };
  return assignment;
};

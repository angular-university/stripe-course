import {db} from './init-db';


export async function getDocData(docPath) {

  const snap = await db.doc(docPath).get();

  return snap.data();
}



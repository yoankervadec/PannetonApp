//
// server/jobs/models/insertAndUpdateClanMembers.js

import { getConnection } from "../configs/db.config.js";

export const insertAndUpdateClanMembers = async () => {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `
      INSERT INTO
        clans_members
        ...
      `
    );
    await connection.query(
      `
      INSERT INTO
        clans_members
        ...
      `
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

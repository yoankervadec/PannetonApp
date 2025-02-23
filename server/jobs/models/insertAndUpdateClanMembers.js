//
// server/jobs/models/insertAndUpdateClanMembers.js

import { getConnection } from "../configs/db.config.js";

export const insertAndUpdateClanMembers = async (
  clanMembers,
  clanMembersMeta
) => {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    for (let i = 0; i < clanMembers.length; i++) {
      const { member_name, member_tag, member_role } = clanMembers[i];
      const {
        trophies,
        arena,
        level,
        donations,
        donations_received,
        last_seen,
      } = clanMembersMeta[i];
      // Insert or Update clan member
      const [result] = await connection.query(
        `
        INSERT INTO
          clan_members (
            -- member_id auto generated
            member_name,
            member_tag,
            member_role
          )
        VALUES
          (?, ?, ?)
        ON DUPLICATE KEY
        UPDATE
          member_role = VALUES(member_role)
        `,
        [member_name, member_tag, member_role]
      );
      // Get member_id
      const [memberRow] = await connection.query(
        `
        SELECT
          member_id
        FROM
          clan_members
        WHERE
          member_tag = ?
        `,
        [member_tag]
      );

      const member_id = memberRow[0]?.member_id;

      await connection.query(
        `
        INSERT INTO
          clan_members_meta (
            member_id,
            trophies,
            arena,
            level,
            donations,
            donations_received,
            last_seen
          )
        VALUES
          (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY
          UPDATE
            trophies = VALUES(trophies),
            arena = VALUES(arena),
            level = VALUES(level),
            donations = VALUES(donations),
            donations_received = VALUES(donations_received),
            last_seen = VALUES(last_seen)
        `,
        [
          member_id,
          trophies,
          arena,
          level,
          donations,
          donations_received,
          last_seen,
        ]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

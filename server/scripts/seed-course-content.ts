import mysql from "mysql2/promise";

import { levels, zones } from "../src/data/course-content";

async function main() {
  const pool = mysql.createPool({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "1234",
    database: "webquest",
  });

  try {
    for (const [index, zone] of zones.entries()) {
      await pool.execute(
        `
          INSERT INTO zones (
            id,
            name,
            slug,
            description,
            sort_order,
            required_level,
            status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            slug = VALUES(slug),
            description = VALUES(description),
            sort_order = VALUES(sort_order),
            required_level = VALUES(required_level),
            status = VALUES(status)
        `,
        [
          zone.id,
          zone.name,
          zone.slug,
          zone.description,
          index + 1,
          zone.requiredLevel,
          "active",
        ],
      );
    }

    for (const level of levels) {
      await pool.execute(
        `
          INSERT INTO levels (
            id,
            zone_id,
            title,
            description,
            story,
            difficulty,
            sort_order,
            reward_xp,
            starter_code_html,
            starter_code_css,
            starter_code_js,
            required_keywords,
            status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            zone_id = VALUES(zone_id),
            title = VALUES(title),
            description = VALUES(description),
            story = VALUES(story),
            difficulty = VALUES(difficulty),
            sort_order = VALUES(sort_order),
            reward_xp = VALUES(reward_xp),
            starter_code_html = VALUES(starter_code_html),
            starter_code_css = VALUES(starter_code_css),
            starter_code_js = VALUES(starter_code_js),
            required_keywords = VALUES(required_keywords),
            status = VALUES(status)
        `,
        [
          level.id,
          level.zoneId,
          level.title,
          level.description,
          level.story,
          level.difficulty,
          level.sortOrder,
          level.rewardXp,
          level.starterCode.html,
          level.starterCode.css,
          level.starterCode.javascript,
          JSON.stringify(level.requiredKeywords),
          "active",
        ],
      );
    }

    console.log(`Seeded ${zones.length} zones and ${levels.length} levels.`);
  } finally {
    await pool.end();
  }
}

void main();

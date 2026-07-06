CREATE DATABASE IF NOT EXISTS webquest
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE webquest;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(50) DEFAULT NULL,
  avatar_url VARCHAR(255) DEFAULT NULL,
  level INT NOT NULL DEFAULT 1,
  xp INT NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS zones (
  id CHAR(36) NOT NULL,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL,
  description TEXT DEFAULT NULL,
  icon VARCHAR(100) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  required_level INT NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_zones_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS levels (
  id CHAR(36) NOT NULL,
  zone_id CHAR(36) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  story TEXT DEFAULT NULL,
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'easy',
  sort_order INT NOT NULL DEFAULT 0,
  reward_xp INT NOT NULL DEFAULT 10,
  starter_code_html MEDIUMTEXT DEFAULT NULL,
  starter_code_css MEDIUMTEXT DEFAULT NULL,
  starter_code_js MEDIUMTEXT DEFAULT NULL,
  required_keywords JSON DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_levels_zone_id (zone_id),
  KEY idx_levels_sort_order (sort_order),
  CONSTRAINT fk_levels_zone
    FOREIGN KEY (zone_id) REFERENCES zones (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_level_progress (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  current_level_id CHAR(36) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_user_level_progress_user_id (user_id),
  KEY idx_user_level_progress_current_level_id (current_level_id),
  CONSTRAINT fk_user_level_progress_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_level_progress_current_level
    FOREIGN KEY (current_level_id) REFERENCES levels (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_completed_levels (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  level_id CHAR(36) NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_user_completed_levels_user_level (user_id, level_id),
  KEY idx_user_completed_levels_level_id (level_id),
  CONSTRAINT fk_user_completed_levels_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_completed_levels_level
    FOREIGN KEY (level_id) REFERENCES levels (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_unlocked_zones (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  zone_id CHAR(36) NOT NULL,
  unlocked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_user_unlocked_zones_user_zone (user_id, zone_id),
  KEY idx_user_unlocked_zones_zone_id (zone_id),
  CONSTRAINT fk_user_unlocked_zones_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_unlocked_zones_zone
    FOREIGN KEY (zone_id) REFERENCES zones (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS submissions (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  level_id CHAR(36) NOT NULL,
  code_html MEDIUMTEXT DEFAULT NULL,
  code_css MEDIUMTEXT DEFAULT NULL,
  code_js MEDIUMTEXT DEFAULT NULL,
  passed TINYINT(1) NOT NULL DEFAULT 0,
  score INT NOT NULL DEFAULT 0,
  earned_xp INT NOT NULL DEFAULT 0,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_submissions_user_id (user_id),
  KEY idx_submissions_level_id (level_id),
  KEY idx_submissions_submitted_at (submitted_at),
  CONSTRAINT fk_submissions_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_submissions_level
    FOREIGN KEY (level_id) REFERENCES levels (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS xp_logs (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  source VARCHAR(50) NOT NULL,
  source_id CHAR(36) DEFAULT NULL,
  amount INT NOT NULL,
  balance_after INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_xp_logs_user_id (user_id),
  KEY idx_xp_logs_source (source),
  CONSTRAINT fk_xp_logs_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS skills (
  id CHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  category VARCHAR(50) NOT NULL,
  parent_id CHAR(36) DEFAULT NULL,
  level_id CHAR(36) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_skills_parent_id (parent_id),
  KEY idx_skills_level_id (level_id),
  CONSTRAINT fk_skills_parent
    FOREIGN KEY (parent_id) REFERENCES skills (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_skills_level
    FOREIGN KEY (level_id) REFERENCES levels (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_skills (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  skill_id CHAR(36) NOT NULL,
  unlocked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_user_skills_user_skill (user_id, skill_id),
  KEY idx_user_skills_skill_id (skill_id),
  CONSTRAINT fk_user_skills_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_skills_skill
    FOREIGN KEY (skill_id) REFERENCES skills (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

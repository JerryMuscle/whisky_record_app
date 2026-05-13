-- コンテナ初回起動時に自動で実行されるSQL
-- whisky-appデータベースの初期スキーマ

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT        NOT NULL UNIQUE,
    username      TEXT        NOT NULL,
    cognito_sub   TEXT        NOT NULL UNIQUE,
    avatar_url    TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bottles (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name          TEXT        NOT NULL,
    distillery    TEXT        NOT NULL,
    region        TEXT        NOT NULL,
    bottle_type   TEXT,
    abv           NUMERIC(4,1),
    price         INTEGER,
    photo_url     TEXT,
    is_public     BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bottles_user_id ON bottles(user_id);

CREATE TABLE IF NOT EXISTS tasting_sessions (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    bottle_id     UUID        NOT NULL REFERENCES bottles(id) ON DELETE CASCADE,
    tasted_at     TIMESTAMPTZ NOT NULL,
    rating        SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
    serving_style TEXT,
    location      TEXT,
    situation     TEXT,
    memo          TEXT,
    want_again    BOOLEAN,
    f_smoky       SMALLINT    CHECK (f_smoky  BETWEEN 0 AND 5),
    f_fruity      SMALLINT    CHECK (f_fruity BETWEEN 0 AND 5),
    f_floral      SMALLINT    CHECK (f_floral BETWEEN 0 AND 5),
    f_spicy       SMALLINT    CHECK (f_spicy  BETWEEN 0 AND 5),
    f_woody       SMALLINT    CHECK (f_woody  BETWEEN 0 AND 5),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_bottle_id ON tasting_sessions(bottle_id);
CREATE INDEX IF NOT EXISTS idx_sessions_tasted_at ON tasting_sessions(tasted_at DESC);

CREATE TABLE IF NOT EXISTS flavor_tags (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name          TEXT        NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_flavor_tags_user_id ON flavor_tags(user_id);

CREATE TABLE IF NOT EXISTS session_flavor_tags (
    session_id    UUID        NOT NULL REFERENCES tasting_sessions(id) ON DELETE CASCADE,
    tag_id        UUID        NOT NULL REFERENCES flavor_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (session_id, tag_id)
);

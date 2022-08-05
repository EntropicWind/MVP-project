DROP TABLE IF EXISTS client, goals;

CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    age INTEGER,
    phone_number TEXT NOT NULL,
    email TEXT UNIQUE
);

CREATE TABLE goals (
    goals_id SERIAL,
    client_id INTEGER NOT NULL,
    FOREIGN KEY (client_id) REFERENCES client (id) ON DELETE CASCADE,
    goal_name TEXT,
    complete_by TEXT,
    priority TEXT,
    complete TEXT
);

-- CREATE TABLE goals_completed (
--     id SERIAL,
--     client_id INTEGER NOT NULL,
--     FOREIGN KEY (client_id) REFERENCES client (id) ON DELETE CASCADE,
--     goals_id INTEGER NOT NULL,
--     CONSTRAINT unique_goals_id UNIQUE (goals_id),
--     goal TEXT,
--     complete TEXT
-- );
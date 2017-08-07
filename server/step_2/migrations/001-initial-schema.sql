-- Up
CREATE TABLE Contacts (
    id    INTEGER PRIMARY KEY,
    hash  TEXT,
    salt  TEXT,
    phone TEXT  UNIQUE ON CONFLICT IGNORE NOT NULL
);
-- Down

CREATE KEYSPACE IF NOT EXISTS my_app WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};


CREATE TABLE IF NOT EXISTS my_app.words (position int PRIMARY KEY, words text);


COPY my_app.words (position, words) FROM '/words.csv' WITH HEADER = TRUE;

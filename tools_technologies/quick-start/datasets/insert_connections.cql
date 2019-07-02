CREATE KEYSPACE IF NOT EXISTS experiment1 WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};


CREATE TABLE experiment1.example_dataset (
    fk_numperso int,
    pk_anyomesdia text,
    fk_cod_operacion text,
    ip_terminal text,
    PRIMARY KEY (fk_numperso, pk_anyomesdia)
) WITH CLUSTERING ORDER BY (pk_anyomesdia ASC)
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = '99PERCENTILE';


COPY experiment1.example_dataset (fk_numperso, pk_anyomesdia, fk_cod_operacion, ip_terminal) FROM 'connections_dataset.csv' WITH HEADER = TRUE;

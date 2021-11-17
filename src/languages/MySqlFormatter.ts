import Formatter from '../core/Formatter';
import Tokenizer from '../core/Tokenizer';
import { isToken, Token, TokenType } from '../core/token';
import type { StringPatternType } from '../core/regexFactory';

// TODO: split this into object with function categories
/**
 * Priority 5 (last)
 * Full list of reserved functions
 * distinct from Keywords due to interaction with parentheses
 */
// https://dev.mysql.com/doc/refman/8.0/en/built-in-function-reference.html
const reservedFunctions = [
	'ABS',
	'ACOS',
	'ADDDATE',
	'ADDTIME',
	'AES_DECRYPT',
	'AES_ENCRYPT',
	'AND',
	'ANY_VALUE',
	'ASCII',
	'ASIN',
	'ATAN',
	'ATAN2',
	'AVG',
	'BENCHMARK',
	'BIN',
	'BIN_TO_UUID',
	'BINARY',
	'BIT_AND',
	'BIT_COUNT',
	'BIT_LENGTH',
	'BIT_OR',
	'BIT_XOR',
	'CAN_ACCESS_COLUMN',
	'CAN_ACCESS_DATABASE',
	'CAN_ACCESS_TABLE',
	'CAN_ACCESS_USER',
	'CAN_ACCESS_VIEW',
	'CASE',
	'CAST',
	'CEIL',
	'CEILING',
	'CHAR',
	'CHAR_LENGTH',
	'CHARACTER_LENGTH',
	'CHARSET',
	'COALESCE',
	'COERCIBILITY',
	'COLLATION',
	'COMPRESS',
	'CONCAT',
	'CONCAT_WS',
	'CONNECTION_ID',
	'CONV',
	'CONVERT',
	'CONVERT_TZ',
	'COS',
	'COT',
	'COUNT',
	'CRC32',
	'CUME_DIST',
	'CURDATE',
	'CURRENT_DATE',
	'CURRENT_ROLE',
	'CURRENT_TIME',
	'CURRENT_TIMESTAMP',
	'CURRENT_USER',
	'CURTIME',
	'DATABASE',
	'DATE',
	'DATE_ADD',
	'DATE_FORMAT',
	'DATE_SUB',
	'DATEDIFF',
	'DAY',
	'DAYNAME',
	'DAYOFMONTH',
	'DAYOFWEEK',
	'DAYOFYEAR',
	'DEFAULT',
	'DEGREES',
	'DENSE_RANK',
	'DIV',
	'ELT',
	'EXP',
	'EXPORT_SET',
	'EXTRACT',
	'ExtractValue',
	'FIELD',
	'FIND_IN_SET',
	'FIRST_VALUE',
	'FLOOR',
	'FORMAT',
	'FORMAT_BYTES',
	'FORMAT_PICO_TIME',
	'FOUND_ROWS',
	'FROM_BASE64',
	'FROM_DAYS',
	'FROM_UNIXTIME',
	'GeomCollection',
	'GeometryCollection',
	'GET_DD_COLUMN_PRIVILEGES',
	'GET_DD_CREATE_OPTIONS',
	'GET_DD_INDEX_SUB_PART_LENGTH',
	'GET_FORMAT',
	'GET_LOCK',
	'GREATEST',
	'GROUP_CONCAT',
	'GROUPING',
	'GTID_SUBSET',
	'GTID_SUBTRACT',
	'HEX',
	'HOUR',
	'ICU_VERSION',
	'IF',
	'IFNULL',
	'IN',
	'INET_ATON',
	'INET_NTOA',
	'INET6_ATON',
	'INET6_NTOA',
	'INSERT',
	'INSTR',
	'INTERNAL_AUTO_INCREMENT',
	'INTERNAL_AVG_ROW_LENGTH',
	'INTERNAL_CHECK_TIME',
	'INTERNAL_CHECKSUM',
	'INTERNAL_DATA_FREE',
	'INTERNAL_DATA_LENGTH',
	'INTERNAL_DD_CHAR_LENGTH',
	'INTERNAL_GET_COMMENT_OR_ERROR',
	'INTERNAL_GET_ENABLED_ROLE_JSON',
	'INTERNAL_GET_HOSTNAME',
	'INTERNAL_GET_USERNAME',
	'INTERNAL_GET_VIEW_WARNING_OR_ERROR',
	'INTERNAL_INDEX_COLUMN_CARDINALITY',
	'INTERNAL_INDEX_LENGTH',
	'INTERNAL_IS_ENABLED_ROLE',
	'INTERNAL_IS_MANDATORY_ROLE',
	'INTERNAL_KEYS_DISABLED',
	'INTERNAL_MAX_DATA_LENGTH',
	'INTERNAL_TABLE_ROWS',
	'INTERNAL_UPDATE_TIME',
	'INTERVAL',
	'IS',
	'IS_FREE_LOCK',
	'IS_IPV4',
	'IS_IPV4_COMPAT',
	'IS_IPV4_MAPPED',
	'IS_IPV6',
	'IS NOT',
	'IS NOT NULL',
	'IS NULL',
	'IS_USED_LOCK',
	'IS_UUID',
	'ISNULL',
	'JSON_ARRAY',
	'JSON_ARRAY_APPEND',
	'JSON_ARRAY_INSERT',
	'JSON_ARRAYAGG',
	'JSON_CONTAINS',
	'JSON_CONTAINS_PATH',
	'JSON_DEPTH',
	'JSON_EXTRACT',
	'JSON_INSERT',
	'JSON_KEYS',
	'JSON_LENGTH',
	'JSON_MERGE',
	'JSON_MERGE_PATCH',
	'JSON_MERGE_PRESERVE',
	'JSON_OBJECT',
	'JSON_OBJECTAGG',
	'JSON_OVERLAPS',
	'JSON_PRETTY',
	'JSON_QUOTE',
	'JSON_REMOVE',
	'JSON_REPLACE',
	'JSON_SCHEMA_VALID',
	'JSON_SCHEMA_VALIDATION_REPORT',
	'JSON_SEARCH',
	'JSON_SET',
	'JSON_STORAGE_FREE',
	'JSON_STORAGE_SIZE',
	'JSON_TABLE',
	'JSON_TYPE',
	'JSON_UNQUOTE',
	'JSON_VALID',
	'JSON_VALUE',
	'LAG',
	'LAST_DAY',
	'LAST_INSERT_ID',
	'LAST_VALUE',
	'LCASE',
	'LEAD',
	'LEAST',
	'LEFT',
	'LENGTH',
	'LIKE',
	'LineString',
	'LN',
	'LOAD_FILE',
	'LOCALTIME',
	'LOCALTIMESTAMP',
	'LOCATE',
	'LOG',
	'LOG10',
	'LOG2',
	'LOWER',
	'LPAD',
	'LTRIM',
	'MAKE_SET',
	'MAKEDATE',
	'MAKETIME',
	'MASTER_POS_WAIT',
	'MATCH',
	'MAX',
	'MBRContains',
	'MBRCoveredBy',
	'MBRCovers',
	'MBRDisjoint',
	'MBREquals',
	'MBRIntersects',
	'MBROverlaps',
	'MBRTouches',
	'MBRWithin',
	'MD5',
	'MEMBER OF',
	'MICROSECOND',
	'MID',
	'MIN',
	'MINUTE',
	'MOD',
	'MONTH',
	'MONTHNAME',
	'MultiLineString',
	'MultiPoint',
	'MultiPolygon',
	'NAME_CONST',
	'NOT',
	'NOT IN',
	'NOT LIKE',
	'NOT REGEXP',
	'NOW',
	'NTH_VALUE',
	'NTILE',
	'NULLIF',
	'OCT',
	'OCTET_LENGTH',
	'OR',
	'ORD',
	'PERCENT_RANK',
	'PERIOD_ADD',
	'PERIOD_DIFF',
	'PI',
	'Point',
	'Polygon',
	'POSITION',
	'POW',
	'POWER',
	'PS_CURRENT_THREAD_ID',
	'PS_THREAD_ID',
	'QUARTER',
	'QUOTE',
	'RADIANS',
	'RAND',
	'RANDOM_BYTES',
	'RANK',
	'REGEXP',
	'REGEXP_INSTR',
	'REGEXP_LIKE',
	'REGEXP_REPLACE',
	'REGEXP_SUBSTR',
	'RELEASE_ALL_LOCKS',
	'RELEASE_LOCK',
	'REPEAT',
	'REPLACE',
	'REVERSE',
	'RIGHT',
	'RLIKE',
	'ROLES_GRAPHML',
	'ROUND',
	'ROW_COUNT',
	'ROW_NUMBER',
	'RPAD',
	'RTRIM',
	'SCHEMA',
	'SEC_TO_TIME',
	'SECOND',
	'SESSION_USER',
	'SHA1',
	'SHA2',
	'SIGN',
	'SIN',
	'SLEEP',
	'SOUNDEX',
	'SOUNDS LIKE',
	'SOURCE_POS_WAIT',
	'SPACE',
	'SQRT',
	'ST_Area',
	'ST_AsBinary',
	'ST_AsGeoJSON',
	'ST_AsText',
	'ST_Buffer',
	'ST_Buffer_Strategy',
	'ST_Centroid',
	'ST_Collect',
	'ST_Contains',
	'ST_ConvexHull',
	'ST_Crosses',
	'ST_Difference',
	'ST_Dimension',
	'ST_Disjoint',
	'ST_Distance',
	'ST_Distance_Sphere',
	'ST_EndPoint',
	'ST_Envelope',
	'ST_Equals',
	'ST_ExteriorRing',
	'ST_FrechetDistance',
	'ST_GeoHash',
	'ST_GeomCollFromText',
	'ST_GeomCollFromWKB',
	'ST_GeometryN',
	'ST_GeometryType',
	'ST_GeomFromGeoJSON',
	'ST_GeomFromText',
	'ST_GeomFromWKB',
	'ST_HausdorffDistance',
	'ST_InteriorRingN',
	'ST_Intersection',
	'ST_Intersects',
	'ST_IsClosed',
	'ST_IsEmpty',
	'ST_IsSimple',
	'ST_IsValid',
	'ST_LatFromGeoHash',
	'ST_Latitude',
	'ST_Length',
	'ST_LineFromText',
	'ST_LineFromWKB',
	'ST_LineInterpolatePoint',
	'ST_LineInterpolatePoints',
	'ST_LongFromGeoHash',
	'ST_Longitude',
	'ST_MakeEnvelope',
	'ST_MLineFromText',
	'ST_MLineFromWKB',
	'ST_MPointFromText',
	'ST_MPointFromWKB',
	'ST_MPolyFromText',
	'ST_MPolyFromWKB',
	'ST_NumGeometries',
	'ST_NumInteriorRing',
	'ST_NumPoints',
	'ST_Overlaps',
	'ST_PointAtDistance',
	'ST_PointFromGeoHash',
	'ST_PointFromText',
	'ST_PointFromWKB',
	'ST_PointN',
	'ST_PolyFromText',
	'ST_PolyFromWKB',
	'ST_Simplify',
	'ST_SRID',
	'ST_StartPoint',
	'ST_SwapXY',
	'ST_SymDifference',
	'ST_Touches',
	'ST_Transform',
	'ST_Union',
	'ST_Validate',
	'ST_Within',
	'ST_X',
	'ST_Y',
	'STATEMENT_DIGEST',
	'STATEMENT_DIGEST_TEXT',
	'STD',
	'STDDEV',
	'STDDEV_POP',
	'STDDEV_SAMP',
	'STR_TO_DATE',
	'STRCMP',
	'SUBDATE',
	'SUBSTR',
	'SUBSTRING',
	'SUBSTRING_INDEX',
	'SUBTIME',
	'SUM',
	'SYSDATE',
	'SYSTEM_USER',
	'TAN',
	'TIME',
	'TIME_FORMAT',
	'TIME_TO_SEC',
	'TIMEDIFF',
	'TIMESTAMP',
	'TIMESTAMPADD',
	'TIMESTAMPDIFF',
	'TO_BASE64',
	'TO_DAYS',
	'TO_SECONDS',
	'TRIM',
	'TRUNCATE',
	'UCASE',
	'UNCOMPRESS',
	'UNCOMPRESSED_LENGTH',
	'UNHEX',
	'UNIX_TIMESTAMP',
	'UpdateXML',
	'UPPER',
	'USER',
	'UTC_DATE',
	'UTC_TIME',
	'UTC_TIMESTAMP',
	'UUID',
	'UUID_SHORT',
	'UUID_TO_BIN',
	'VALIDATE_PASSWORD_STRENGTH',
	'VALUES',
	'VAR_POP',
	'VAR_SAMP',
	'VARIANCE',
	'VERSION',
	'WAIT_FOR_EXECUTED_GTID_SET',
	'WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS',
	'WEEK',
	'WEEKDAY',
	'WEEKOFYEAR',
	'WEIGHT_STRING',
	'XOR',
	'YEAR',
	'YEARWEEK',
];

/**
 * Priority 5 (last)
 * Full list of reserved words
 * any words that are in a higher priority are removed
 */
// https://dev.mysql.com/doc/refman/8.0/en/keywords.html
const reservedKeywords = [
	'ACCESSIBLE',
	'ACCOUNT',
	'ACTION',
	'ACTIVE',
	'ADMIN',
	'AFTER',
	'AGAINST',
	'AGGREGATE',
	'ALGORITHM',
	'ALL',
	'ALTER',
	'ALWAYS',
	'ANALYSE',
	'ANALYZE',
	'ANY',
	'ARRAY',
	'AS',
	'ASC',
	'ASENSITIVE',
	'AT',
	'ATTRIBUTE',
	'AUTHENTICATION',
	'AUTOEXTEND_SIZE',
	'AUTO_INCREMENT',
	'AVG_ROW_LENGTH',
	'BACKUP',
	'BEFORE',
	'BEGIN',
	'BETWEEN',
	'BIGINT',
	'BIT',
	'BLOB',
	'BLOCK',
	'BOOL',
	'BOOLEAN',
	'BOTH',
	'BTREE',
	'BUCKETS',
	'BY',
	'BYTE',
	'CACHE',
	'CASCADE',
	'CASCADED',
	'CATALOG_NAME',
	'CHAIN',
	'CHALLENGE_RESPONSE',
	'CHANGE',
	'CHANGED',
	'CHANNEL',
	'CHARACTER',
	'CHECK',
	'CHECKSUM',
	'CIPHER',
	'CLASS_ORIGIN',
	'CLIENT',
	'CLOSE',
	'CODE',
	'COLLATE',
	'COLUMN',
	'COLUMNS',
	'COLUMN_FORMAT',
	'COLUMN_NAME',
	'COMMENT',
	'COMMITTED',
	'COMPACT',
	'COMPLETION',
	'COMPONENT',
	'COMPRESSED',
	'COMPRESSION',
	'CONCURRENT',
	'CONDITION',
	'CONNECTION',
	'CONSISTENT',
	'CONSTRAINT',
	'CONSTRAINT_CATALOG',
	'CONSTRAINT_NAME',
	'CONSTRAINT_SCHEMA',
	'CONTAINS',
	'CONTEXT',
	'CONTINUE',
	'CPU',
	'CREATE',
	'CROSS',
	'CUBE',
	'CURRENT',
	'CURSOR',
	'CURSOR_NAME',
	'DATA',
	'DATABASES',
	'DATAFILE',
	'DATETIME',
	'DAY_HOUR',
	'DAY_MICROSECOND',
	'DAY_MINUTE',
	'DAY_SECOND',
	'DEALLOCATE',
	'DEC',
	'DECIMAL',
	'DECLARE',
	'DEFAULT_AUTH',
	'DEFINER',
	'DEFINITION',
	'DELAYED',
	'DELAY_KEY_WRITE',
	'DESC',
	'DESCRIPTION',
	'DES_KEY_FILE',
	'DETERMINISTIC',
	'DIAGNOSTICS',
	'DIRECTORY',
	'DISABLE',
	'DISCARD',
	'DISK',
	'DISTINCT',
	'DISTINCTROW',
	'DOUBLE',
	'DROP',
	'DUAL',
	'DUMPFILE',
	'DUPLICATE',
	'DYNAMIC',
	'EACH',
	'EMPTY',
	'ENABLE',
	'ENCLOSED',
	'ENCRYPTION',
	'ENDS',
	'ENFORCED',
	'ENGINE',
	'ENGINES',
	'ENGINE_ATTRIBUTE',
	'ENUM',
	'ERROR',
	'ERRORS',
	'ESCAPE',
	'ESCAPED',
	'EVENT',
	'EVENTS',
	'EVERY',
	'EXCHANGE',
	'EXCLUDE',
	'EXISTS',
	'EXIT',
	'EXPANSION',
	'EXPIRE',
	'EXPORT',
	'EXTENDED',
	'EXTENT_SIZE',
	'FACTOR',
	'FAILED_LOGIN_ATTEMPTS',
	'FALSE',
	'FAST',
	'FAULTS',
	'FETCH',
	'FIELDS',
	'FILE',
	'FILE_BLOCK_SIZE',
	'FILTER',
	'FINISH',
	'FIRST',
	'FIXED',
	'FLOAT',
	'FLOAT4',
	'FLOAT8',
	'FOLLOWING',
	'FOLLOWS',
	'FOR',
	'FORCE',
	'FOREIGN',
	'FOUND',
	'FULL',
	'FULLTEXT',
	'FUNCTION',
	'GENERAL',
	'GENERATED',
	'GEOMCOLLECTION',
	'GEOMETRY',
	'GEOMETRYCOLLECTION',
	'GET',
	'GET_MASTER_PUBLIC_KEY',
	'GET_SOURCE_PUBLIC_KEY',
	'GLOBAL',
	'GRANTS',
	'GROUP',
	'GROUPS',
	'GROUP_REPLICATION',
	'GTID_ONLY',
	'HASH',
	'HIGH_PRIORITY',
	'HISTOGRAM',
	'HISTORY',
	'HOST',
	'HOSTS',
	'HOUR_MICROSECOND',
	'HOUR_MINUTE',
	'HOUR_SECOND',
	'IDENTIFIED',
	'IGNORE',
	'IGNORE_SERVER_IDS',
	'IMPORT',
	'INACTIVE',
	'INDEX',
	'INDEXES',
	'INFILE',
	'INITIAL',
	'INITIAL_SIZE',
	'INITIATE',
	'INNER',
	'INOUT',
	'INSENSITIVE',
	'INSERT_METHOD',
	'INSTALL',
	'INSTANCE',
	'INT',
	'INT1',
	'INT2',
	'INT3',
	'INT4',
	'INT8',
	'INTEGER',
	'INTO',
	'INVISIBLE',
	'INVOKER',
	'IO',
	'IO_AFTER_GTIDS',
	'IO_BEFORE_GTIDS',
	'IO_THREAD',
	'IPC',
	'ISOLATION',
	'ISSUER',
	'ITERATE',
	'JSON',
	'KEY',
	'KEYRING',
	'KEYS',
	'KEY_BLOCK_SIZE',
	'LANGUAGE',
	'LAST',
	'LEADING',
	'LEAVE',
	'LEAVES',
	'LESS',
	'LEVEL',
	'LINEAR',
	'LINES',
	'LINESTRING',
	'LIST',
	'LOAD',
	'LOCAL',
	'LOCK',
	'LOCKED',
	'LOCKS',
	'LOGFILE',
	'LOGS',
	'LONG',
	'LONGBLOB',
	'LONGTEXT',
	'LOOP',
	'LOW_PRIORITY',
	'MASTER',
	'MASTER_AUTO_POSITION',
	'MASTER_BIND',
	'MASTER_COMPRESSION_ALGORITHMS',
	'MASTER_CONNECT_RETRY',
	'MASTER_DELAY',
	'MASTER_HEARTBEAT_PERIOD',
	'MASTER_HOST',
	'MASTER_LOG_FILE',
	'MASTER_LOG_POS',
	'MASTER_PASSWORD',
	'MASTER_PORT',
	'MASTER_PUBLIC_KEY_PATH',
	'MASTER_RETRY_COUNT',
	'MASTER_SERVER_ID',
	'MASTER_SSL',
	'MASTER_SSL_CA',
	'MASTER_SSL_CAPATH',
	'MASTER_SSL_CERT',
	'MASTER_SSL_CIPHER',
	'MASTER_SSL_CRL',
	'MASTER_SSL_CRLPATH',
	'MASTER_SSL_KEY',
	'MASTER_SSL_VERIFY_SERVER_CERT',
	'MASTER_TLS_CIPHERSUITES',
	'MASTER_TLS_VERSION',
	'MASTER_USER',
	'MASTER_ZSTD_COMPRESSION_LEVEL',
	'MAXVALUE',
	'MAX_CONNECTIONS_PER_HOUR',
	'MAX_QUERIES_PER_HOUR',
	'MAX_ROWS',
	'MAX_SIZE',
	'MAX_UPDATES_PER_HOUR',
	'MAX_USER_CONNECTIONS',
	'MEDIUM',
	'MEDIUMBLOB',
	'MEDIUMINT',
	'MEDIUMTEXT',
	'MEMBER',
	'MEMORY',
	'MERGE',
	'MESSAGE_TEXT',
	'MIDDLEINT',
	'MIGRATE',
	'MINUTE_MICROSECOND',
	'MINUTE_SECOND',
	'MIN_ROWS',
	'MODE',
	'MODIFIES',
	'MODIFY',
	'MULTILINESTRING',
	'MULTIPOINT',
	'MULTIPOLYGON',
	'MUTEX',
	'MYSQL_ERRNO',
	'NAME',
	'NAMES',
	'NATIONAL',
	'NATURAL',
	'NCHAR',
	'NDB',
	'NDBCLUSTER',
	'NESTED',
	'NETWORK_NAMESPACE',
	'NEVER',
	'NEW',
	'NEXT',
	'NO',
	'NODEGROUP',
	'NONE',
	'NOWAIT',
	'NO_WAIT',
	'NO_WRITE_TO_BINLOG',
	'NULL',
	'NULLS',
	'NUMBER',
	'NUMERIC',
	'NVARCHAR',
	'OF',
	'OFF',
	'OFFSET',
	'OJ',
	'OLD',
	'ONE',
	'ONLY',
	'OPEN',
	'OPTIMIZE',
	'OPTIMIZER_COSTS',
	'OPTION',
	'OPTIONAL',
	'OPTIONALLY',
	'OPTIONS',
	'ORDER',
	'ORDINALITY',
	'ORGANIZATION',
	'OTHERS',
	'OUT',
	'OUTER',
	'OUTFILE',
	'OVER',
	'OWNER',
	'PACK_KEYS',
	'PAGE',
	'PARSER',
	'PARSE_GCOL_EXPR',
	'PARTIAL',
	'PARTITION',
	'PARTITIONING',
	'PARTITIONS',
	'PASSWORD',
	'PASSWORD_LOCK_TIME',
	'PATH',
	'PERSIST',
	'PERSIST_ONLY',
	'PHASE',
	'PLUGIN',
	'PLUGINS',
	'PLUGIN_DIR',
	'POINT',
	'POLYGON',
	'PORT',
	'PRECEDES',
	'PRECEDING',
	'PRECISION',
	'PRESERVE',
	'PREV',
	'PRIMARY',
	'PRIVILEGES',
	'PRIVILEGE_CHECKS_USER',
	'PROCEDURE',
	'PROCESS',
	'PROCESSLIST',
	'PROFILE',
	'PROFILES',
	'PROXY',
	'PURGE',
	'QUERY',
	'QUICK',
	'RANDOM',
	'RANGE',
	'READ',
	'READS',
	'READ_ONLY',
	'READ_WRITE',
	'REAL',
	'REBUILD',
	'RECOVER',
	'RECURSIVE',
	'REDOFILE',
	'REDO_BUFFER_SIZE',
	'REDUNDANT',
	'REFERENCE',
	'REFERENCES',
	'REGISTRATION',
	'RELAY',
	'RELAYLOG',
	'RELAY_LOG_FILE',
	'RELAY_LOG_POS',
	'RELAY_THREAD',
	'RELEASE',
	'RELOAD',
	'REMOTE',
	'REMOVE',
	'RENAME',
	'REORGANIZE',
	'REPAIR',
	'REPEATABLE',
	'REPLICA',
	'REPLICAS',
	'REPLICATE_DO_DB',
	'REPLICATE_DO_TABLE',
	'REPLICATE_IGNORE_DB',
	'REPLICATE_IGNORE_TABLE',
	'REPLICATE_REWRITE_DB',
	'REPLICATE_WILD_DO_TABLE',
	'REPLICATE_WILD_IGNORE_TABLE',
	'REPLICATION',
	'REQUIRE',
	'REQUIRE_ROW_FORMAT',
	'RESIGNAL',
	'RESOURCE',
	'RESPECT',
	'RESTORE',
	'RESTRICT',
	'RESUME',
	'RETAIN',
	'RETURN',
	'RETURNED_SQLSTATE',
	'RETURNING',
	'RETURNS',
	'REUSE',
	'ROLE',
	'ROLLUP',
	'ROTATE',
	'ROUTINE',
	'ROW',
	'ROWS',
	'ROW_FORMAT',
	'RTREE',
	'SCHEDULE',
	'SCHEMAS',
	'SCHEMA_NAME',
	'SECONDARY',
	'SECONDARY_ENGINE',
	'SECONDARY_ENGINE_ATTRIBUTE',
	'SECONDARY_LOAD',
	'SECONDARY_UNLOAD',
	'SECOND_MICROSECOND',
	'SECURITY',
	'SENSITIVE',
	'SEPARATOR',
	'SERIAL',
	'SERIALIZABLE',
	'SERVER',
	'SESSION',
	'SHARE',
	'SIGNAL',
	'SIGNED',
	'SIMPLE',
	'SKIP',
	'SLAVE',
	'SLOW',
	'SMALLINT',
	'SNAPSHOT',
	'SOCKET',
	'SOME',
	'SONAME',
	'SOUNDS',
	'SOURCE',
	'SOURCE_AUTO_POSITION',
	'SOURCE_BIND',
	'SOURCE_COMPRESSION_ALGORITHMS',
	'SOURCE_CONNECT_RETRY',
	'SOURCE_DELAY',
	'SOURCE_HEARTBEAT_PERIOD',
	'SOURCE_HOST',
	'SOURCE_LOG_FILE',
	'SOURCE_LOG_POS',
	'SOURCE_PASSWORD',
	'SOURCE_PORT',
	'SOURCE_PUBLIC_KEY_PATH',
	'SOURCE_RETRY_COUNT',
	'SOURCE_SSL',
	'SOURCE_SSL_CA',
	'SOURCE_SSL_CAPATH',
	'SOURCE_SSL_CERT',
	'SOURCE_SSL_CIPHER',
	'SOURCE_SSL_CRL',
	'SOURCE_SSL_CRLPATH',
	'SOURCE_SSL_KEY',
	'SOURCE_SSL_VERIFY_SERVER_CERT',
	'SOURCE_TLS_CIPHERSUITES',
	'SOURCE_TLS_VERSION',
	'SOURCE_USER',
	'SOURCE_ZSTD_COMPRESSION_LEVEL',
	'SPATIAL',
	'SPECIFIC',
	'SQL',
	'SQLEXCEPTION',
	'SQLSTATE',
	'SQLWARNING',
	'SQL_AFTER_GTIDS',
	'SQL_AFTER_MTS_GAPS',
	'SQL_BEFORE_GTIDS',
	'SQL_BIG_RESULT',
	'SQL_BUFFER_RESULT',
	'SQL_CACHE',
	'SQL_CALC_FOUND_ROWS',
	'SQL_NO_CACHE',
	'SQL_SMALL_RESULT',
	'SQL_THREAD',
	'SQL_TSI_DAY',
	'SQL_TSI_HOUR',
	'SQL_TSI_MINUTE',
	'SQL_TSI_MONTH',
	'SQL_TSI_QUARTER',
	'SQL_TSI_SECOND',
	'SQL_TSI_WEEK',
	'SQL_TSI_YEAR',
	'SRID',
	'SSL',
	'STACKED',
	'START',
	'STARTING',
	'STARTS',
	'STATS_AUTO_RECALC',
	'STATS_PERSISTENT',
	'STATS_SAMPLE_PAGES',
	'STATUS',
	'STOP',
	'STORAGE',
	'STORED',
	'STREAM',
	'STRING',
	'SUBCLASS_ORIGIN',
	'SUBJECT',
	'SUBPARTITION',
	'SUBPARTITIONS',
	'SUPER',
	'SUSPEND',
	'SWAPS',
	'SWITCHES',
	'SYSTEM',
	'TABLES',
	'TABLESPACE',
	'TABLE_CHECKSUM',
	'TABLE_NAME',
	'TEMPORARY',
	'TEMPTABLE',
	'TERMINATED',
	'TEXT',
	'THAN',
	'THREAD_PRIORITY',
	'TIES',
	'TINYBLOB',
	'TINYINT',
	'TINYTEXT',
	'TLS',
	'TO',
	'TRAILING',
	'TRANSACTION',
	'TRIGGER',
	'TRIGGERS',
	'TRUE',
	'TYPE',
	'TYPES',
	'UNBOUNDED',
	'UNCOMMITTED',
	'UNDEFINED',
	'UNDO',
	'UNDOFILE',
	'UNDO_BUFFER_SIZE',
	'UNICODE',
	'UNINSTALL',
	'UNIQUE',
	'UNKNOWN',
	'UNLOCK',
	'UNREGISTER',
	'UNSIGNED',
	'UNTIL',
	'UPGRADE',
	'USAGE',
	'USER_RESOURCES',
	'USE_FRM',
	'USING',
	'VALIDATION',
	'VALUE',
	'VARBINARY',
	'VARCHAR',
	'VARCHARACTER',
	'VARIABLES',
	'VARYING',
	'VCPU',
	'VIEW',
	'VIRTUAL',
	'VISIBLE',
	'WAIT',
	'WARNINGS',
	'WHILE',
	'WINDOW',
	'WITHOUT',
	'WORK',
	'WRAPPER',
	'WRITE',
	'X509',
	'XID',
	'XML',
	'YEAR_MONTH',
	'ZEROFILL',
	'ZONE',
];

/**
 * Priority 1 (first)
 * keywords that begin a new statement
 * will begin new indented block
 */
// https://dev.mysql.com/doc/refman/8.0/en/sql-statements.html
const reservedCommands = [
	'ALTER DATABASE',
	'ALTER EVENT',
	'ALTER FUNCTION',
	'ALTER INSTANCE',
	'ALTER LOGFILE GROUP',
	'ALTER PROCEDURE',
	'ALTER RESOURCE GROUP',
	'ALTER SERVER',
	'ALTER TABLE',
	'ALTER TABLESPACE',
	'ALTER USER',
	'ALTER VIEW',
	'ANALYZE TABLE',
	'BINLOG',
	'CACHE INDEX',
	'CALL',
	'CHANGE MASTER TO',
	'CHANGE REPLICATION FILTER',
	'CHANGE REPLICATION SOURCE TO',
	'CHECK TABLE',
	'CHECKSUM TABLE',
	'CLONE',
	'COMMIT',
	'CREATE DATABASE',
	'CREATE EVENT',
	'CREATE FUNCTION',
	'CREATE FUNCTION',
	'CREATE INDEX',
	'CREATE LOGFILE GROUP',
	'CREATE PROCEDURE',
	'CREATE RESOURCE GROUP',
	'CREATE ROLE',
	'CREATE SERVER',
	'CREATE SPATIAL REFERENCE SYSTEM',
	'CREATE TABLE',
	'CREATE TABLESPACE',
	'CREATE TRIGGER',
	'CREATE USER',
	'CREATE VIEW',
	'DEALLOCATE PREPARE',
	'DELETE',
	'DESCRIBE',
	'DO',
	'DROP DATABASE',
	'DROP EVENT',
	'DROP FUNCTION',
	'DROP FUNCTION',
	'DROP INDEX',
	'DROP LOGFILE GROUP',
	'DROP PROCEDURE',
	'DROP RESOURCE GROUP',
	'DROP ROLE',
	'DROP SERVER',
	'DROP SPATIAL REFERENCE SYSTEM',
	'DROP TABLE',
	'DROP TABLESPACE',
	'DROP TRIGGER',
	'DROP USER',
	'DROP VIEW',
	'EXECUTE',
	'EXPLAIN',
	'FLUSH',
	'GRANT',
	'HANDLER',
	'HELP',
	'IMPORT TABLE',
	'INSERT',
	'INSTALL COMPONENT',
	'INSTALL PLUGIN',
	'KILL',
	'LOAD DATA',
	'LOAD INDEX INTO CACHE',
	'LOAD XML',
	'LOCK INSTANCE FOR BACKUP',
	'LOCK TABLES',
	'MASTER_POS_WAIT',
	'OPTIMIZE TABLE',
	'PREPARE',
	'PURGE BINARY LOGS',
	'RELEASE SAVEPOINT',
	'RENAME TABLE',
	'RENAME USER',
	'REPAIR TABLE',
	'REPLACE',
	'RESET',
	'RESET MASTER',
	'RESET PERSIST',
	'RESET REPLICA',
	'RESET SLAVE',
	'RESTART',
	'REVOKE',
	'ROLLBACK',
	'ROLLBACK TO SAVEPOINT',
	'SAVEPOINT',
	'SELECT',
	'SET',
	'SET CHARACTER SET',
	'SET DEFAULT ROLE',
	'SET NAMES',
	'SET PASSWORD',
	'SET RESOURCE GROUP',
	'SET ROLE',
	'SET TRANSACTION',
	'SHOW',
	'SHOW BINARY LOGS',
	'SHOW BINLOG EVENTS',
	'SHOW CHARACTER SET',
	'SHOW COLLATION',
	'SHOW COLUMNS',
	'SHOW CREATE DATABASE',
	'SHOW CREATE EVENT',
	'SHOW CREATE FUNCTION',
	'SHOW CREATE PROCEDURE',
	'SHOW CREATE TABLE',
	'SHOW CREATE TRIGGER',
	'SHOW CREATE USER',
	'SHOW CREATE VIEW',
	'SHOW DATABASES',
	'SHOW ENGINE',
	'SHOW ENGINES',
	'SHOW ERRORS',
	'SHOW EVENTS',
	'SHOW FUNCTION CODE',
	'SHOW FUNCTION STATUS',
	'SHOW GRANTS',
	'SHOW INDEX',
	'SHOW MASTER STATUS',
	'SHOW OPEN TABLES',
	'SHOW PLUGINS',
	'SHOW PRIVILEGES',
	'SHOW PROCEDURE CODE',
	'SHOW PROCEDURE STATUS',
	'SHOW PROCESSLIST',
	'SHOW PROFILE',
	'SHOW PROFILES',
	'SHOW RELAYLOG EVENTS',
	'SHOW REPLICA STATUS',
	'SHOW REPLICAS',
	'SHOW SLAVE',
	'SHOW SLAVE HOSTS',
	'SHOW STATUS',
	'SHOW TABLE STATUS',
	'SHOW TABLES',
	'SHOW TRIGGERS',
	'SHOW VARIABLES',
	'SHOW WARNINGS',
	'SHUTDOWN',
	'SOURCE_POS_WAIT',
	'START GROUP_REPLICATION',
	'START REPLICA',
	'START SLAVE',
	'START TRANSACTION',
	'STOP GROUP_REPLICATION',
	'STOP REPLICA',
	'STOP SLAVE',
	'TABLE',
	'TRUNCATE TABLE',
	'UNINSTALL COMPONENT',
	'UNINSTALL PLUGIN',
	'UNLOCK INSTANCE',
	'UNLOCK TABLES',
	'UPDATE',
	'USE',
	'VALUES',
	'WITH',
	'XA',
	// flow control
	// 'IF',
	'ITERATE',
	'LEAVE',
	'LOOP',
	'REPEAT',
	'RETURN',
	'WHILE',
	// other
	'ADD',
	'ALTER COLUMN',
	'FROM',
	'GROUP BY',
	'HAVING',
	'INSERT INTO',
	'LIMIT',
	'OFFSET',
	'ORDER BY',
	'WHERE',
];

/**
 * Priority 2
 * commands that operate on two tables or subqueries
 * two main categories: joins and boolean set operators
 */
const reservedBinaryCommands = [
	// set booleans
	'INTERSECT',
	'INTERSECT ALL',
	'INTERSECT DISTINCT',
	'UNION',
	'UNION ALL',
	'UNION DISTINCT',
	'EXCEPT',
	'EXCEPT ALL',
	'EXCEPT DISTINCT',
	// joins
	'JOIN',
	'INNER JOIN',
	'LEFT JOIN',
	'LEFT OUTER JOIN',
	'RIGHT JOIN',
	'RIGHT OUTER JOIN',
	'CROSS JOIN',
	'NATURAL JOIN',
	// non-standard joins
	'STRAIGHT_JOIN',
	'NATURAL LEFT JOIN',
	'NATURAL LEFT OUTER JOIN',
	'NATURAL RIGHT JOIN',
	'NATURAL RIGHT OUTER JOIN',
];

/**
 * Priority 3
 * keywords that follow a previous Statement, must be attached to subsequent data
 * can be fully inline or on newline with optional indent
 */
const reservedDependentClauses = ['ON', 'WHEN', 'THEN', 'ELSE', 'ELSEIF', 'LATERAL'];

// https://dev.mysql.com/doc/refman/8.0/en/
export default class MySqlFormatter extends Formatter {
	static reservedCommands = reservedCommands;
	static reservedBinaryCommands = reservedBinaryCommands;
	static reservedDependentClauses = reservedDependentClauses;
	static reservedLogicalOperators = ['AND', 'OR', 'XOR'];
	static reservedKeywords = [...reservedKeywords, ...reservedFunctions];
	static stringTypes: StringPatternType[] = ['``', "''", '""'];
	static blockStart = ['(', 'CASE'];
	static blockEnd = [')', 'END'];
	static indexedPlaceholderTypes = ['?'];
	static namedPlaceholderTypes = [];
	static lineCommentTypes = ['--', '#'];
	static specialWordChars = { any: '@', prefix: ':' };
	static operators = [':=', '<<', '>>', '<=>', '&&', '||', '->', '->>'];

	tokenizer() {
		return new Tokenizer({
			reservedCommands: MySqlFormatter.reservedCommands,
			reservedBinaryCommands: MySqlFormatter.reservedBinaryCommands,
			reservedDependentClauses: MySqlFormatter.reservedDependentClauses,
			reservedLogicalOperators: MySqlFormatter.reservedLogicalOperators,
			reservedKeywords: MySqlFormatter.reservedKeywords,
			stringTypes: MySqlFormatter.stringTypes,
			blockStart: MySqlFormatter.blockStart,
			blockEnd: MySqlFormatter.blockEnd,
			indexedPlaceholderTypes: MySqlFormatter.indexedPlaceholderTypes,
			namedPlaceholderTypes: MySqlFormatter.namedPlaceholderTypes,
			lineCommentTypes: MySqlFormatter.lineCommentTypes,
			specialWordChars: MySqlFormatter.specialWordChars,
			operators: MySqlFormatter.operators,
		});
	}

	tokenOverride(token: Token) {
		if (isToken.LATERAL(token)) {
			if (this.tokenLookAhead()?.type === TokenType.BLOCK_START) {
				// This is a subquery, treat it like a join
				return { type: TokenType.RESERVED_LOGICAL_OPERATOR, value: token.value };
			}
		}

		return token;
	}
}

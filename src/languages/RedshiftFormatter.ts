import Formatter from '../core/Formatter';
import Tokenizer from '../core/Tokenizer';

const reservedWords = [
	'ACCEPTANYDATE',
	'ACCEPTINVCHARS',
	'ACCESS_KEY_ID',
	'AES128',
	'AES256',
	'ALL',
	'ALLOWOVERWRITE',
	'ANALYSE',
	'ARRAY',
	'AS',
	'ASC',
	'AUTHORIZATION',
	'AVRO',
	'BACKUP',
	'BINARY',
	'BLANKSASNULL',
	'BOTH',
	'BYTEDICT',
	'BZIP2',
	'CAST',
	'CATALOG_ROLE',
	'CHAR',
	'CHECK',
	'COLLATE',
	'COLUMN',
	'COLUMNS',
	'COMPRESSION',
	'COMPROWS',
	'COMPUPDATE',
	'CONSTRAINT',
	'COPY',
	'COUNT',
	'CREATE',
	'CREDENTIALS',
	'CURRENT_DATE',
	'CURRENT_TIME',
	'CURRENT_TIMESTAMP',
	'CURRENT_USER',
	'CURRENT_USER_ID',
	'DATA CATALOG',
	'DATEFORMAT',
	'DEFAULT',
	'DEFERRABLE',
	'DEFLATE',
	'DEFRAG',
	'DELIMITER',
	'DELTA',
	'DELTA32K',
	'DESC',
	'DISABLE',
	'DISTINCT',
	'DROP',
	'DO',
	'ELSE',
	'EMPTYASNULL',
	'ENABLE',
	'ENCODE',
	'ENCODING',
	'ENCRYPT',
	'ENCRYPTED',
	'ENCRYPTION',
	'END',
	'ESCAPE',
	'EVEN',
	'EXPLICIT',
	'EXPLICIT_IDS',
	'EXTERNAL',
	'FALSE',
	'FILLRECORD',
	'FIXEDWIDTH',
	'FOR',
	'FOREIGN',
	'FORMAT',
	'FREEZE',
	'FULL',
	'GLOBALDICT256',
	'GLOBALDICT64K',
	'GRANT',
	'GZIP',
	'HIVE METASTORE',
	'IAM_ROLE',
	'IDENTITY',
	'IGNORE',
	'IGNOREBLANKLINES',
	'IGNOREHEADER',
	'ILIKE',
	'INITIALLY',
	'INTO',
	'JSON',
	'LEADING',
	'LOCALTIME',
	'LOCALTIMESTAMP',
	'LUN',
	'LUNS',
	'LZO',
	'LZOP',
	'MANIFEST',
	'MASTER_SYMMETRIC_KEY',
	'MAXERROR',
	'MINUS',
	'MOSTLY13',
	'MOSTLY32',
	'MOSTLY8',
	'NATURAL',
	'NEW',
	'NOLOAD',
	'NOT',
	'NULL AS',
	'NULL',
	'NULLS',
	'OFF',
	'OFFLINE',
	'OFFSET',
	'OLD',
	'ONLY',
	'OPEN',
	'ORC',
	'ORDER',
	'OVERLAPS',
	'PARALLEL',
	'PARQUET',
	'PARTITION',
	'PERCENT',
	'PERMISSIONS',
	'PLACING',
	'PREDICATE',
	'PRIMARY',
	'RAW',
	'READRATIO',
	'RECOVER',
	'REFERENCES',
	'REGION',
	'REJECTLOG',
	'REMOVEQUOTES',
	'RESORT',
	'RESTORE',
	'ROUNDEC',
	'SECRET_ACCESS_KEY',
	'SESSION_TOKEN',
	'SESSION_USER',
	'SIMILAR',
	'SSH',
	'STATUPDATE',
	'SYSDATE',
	'SYSTEM',
	'TABLE',
	'TAG',
	'TDES',
	'TEXT255',
	'TEXT32K',
	'THEN',
	'TIMEFORMAT',
	'TIMESTAMP',
	'TO',
	'TOP',
	'TRAILING',
	'TRIMBLANKS',
	'TRUE',
	'TRUNCATECOLUMNS',
	'UNIQUE',
	'UNLOAD',
	'USER',
	'USING',
	'VACUUM',
	'VERBOSE',
	'WALLET',
	'WHEN',
	'WITH',
	'WITHOUT',
];

const reservedTopLevelWords = [
	'ADD',
	'AFTER',
	'ALTER COLUMN',
	'ALTER TABLE',
	'DELETE FROM',
	'EXCEPT',
	'FROM',
	'GROUP BY',
	'HAVING',
	'INSERT INTO',
	'INSERT',
	'INTERSECT',
	'TOP',
	'LIMIT',
	'MODIFY',
	'ORDER BY',
	'SELECT',
	'SET CURRENT SCHEMA',
	'SET SCHEMA',
	'SET',
	'UNION ALL',
	'UNION',
	'UPDATE',
	'VALUES',
	'WHERE',
	'VACUUM',
	'COPY',
	'UNLOAD',
	'ANALYZE',
	'ANALYSE',
	'DISTKEY',
	'SORTKEY',
	'COMPOUND',
	'INTERLEAVED',
	'FORMAT',
	'DELIMITER',
	'FIXEDWIDTH',
	'AVRO',
	'JSON',
	'ENCRYPTED',
	'BZIP2',
	'GZIP',
	'LZOP',
	'PARQUET',
	'ORC',
	'ACCEPTANYDATE',
	'ACCEPTINVCHARS',
	'BLANKSASNULL',
	'DATEFORMAT',
	'EMPTYASNULL',
	'ENCODING',
	'ESCAPE',
	'EXPLICIT_IDS',
	'FILLRECORD',
	'IGNOREBLANKLINES',
	'IGNOREHEADER',
	'NULL AS',
	'REMOVEQUOTES',
	'ROUNDEC',
	'TIMEFORMAT',
	'TRIMBLANKS',
	'TRUNCATECOLUMNS',
	'COMPROWS',
	'COMPUPDATE',
	'MAXERROR',
	'NOLOAD',
	'STATUPDATE',
	'MANIFEST',
	'REGION',
	'IAM_ROLE',
	'MASTER_SYMMETRIC_KEY',
	'SSH',
	'ACCEPTANYDATE',
	'ACCEPTINVCHARS',
	'ACCESS_KEY_ID',
	'SECRET_ACCESS_KEY',
	'AVRO',
	'BLANKSASNULL',
	'BZIP2',
	'COMPROWS',
	'COMPUPDATE',
	'CREDENTIALS',
	'DATEFORMAT',
	'DELIMITER',
	'EMPTYASNULL',
	'ENCODING',
	'ENCRYPTED',
	'ESCAPE',
	'EXPLICIT_IDS',
	'FILLRECORD',
	'FIXEDWIDTH',
	'FORMAT',
	'IAM_ROLE',
	'GZIP',
	'IGNOREBLANKLINES',
	'IGNOREHEADER',
	'JSON',
	'LZOP',
	'MANIFEST',
	'MASTER_SYMMETRIC_KEY',
	'MAXERROR',
	'NOLOAD',
	'NULL AS',
	'READRATIO',
	'REGION',
	'REMOVEQUOTES',
	'ROUNDEC',
	'SSH',
	'STATUPDATE',
	'TIMEFORMAT',
	'SESSION_TOKEN',
	'TRIMBLANKS',
	'TRUNCATECOLUMNS',
	'EXTERNAL',
	'DATA CATALOG',
	'HIVE METASTORE',
	'CATALOG_ROLE',
];

const reservedTopLevelWordsNoIndent: string[] = [];

const reservedNewlineWords = [
	'AND',
	'ELSE',
	'ON',
	'OR',
	'OUTER APPLY',
	'WHEN',
	'VACUUM',
	'COPY',
	'UNLOAD',
	'ANALYZE',
	'ANALYSE',
	'DISTKEY',
	'SORTKEY',
	'COMPOUND',
	'INTERLEAVED',
	// joins
	'JOIN',
	'INNER JOIN',
	'LEFT JOIN',
	'LEFT OUTER JOIN',
	'RIGHT JOIN',
	'RIGHT OUTER JOIN',
	'FULL JOIN',
	'FULL OUTER JOIN',
	'CROSS JOIN',
	'NATURAL JOIN',
];

export default class RedshiftFormatter extends Formatter {
	tokenizer() {
		return new Tokenizer({
			reservedWords,
			reservedTopLevelWords,
			reservedNewlineWords,
			reservedTopLevelWordsNoIndent,
			stringTypes: [`""`, "''", '``'],
			openParens: ['('],
			closeParens: [')'],
			indexedPlaceholderTypes: ['?'],
			namedPlaceholderTypes: ['@', '#', '$'],
			lineCommentTypes: ['--'],
			operators: ['|/', '||/', '<<', '>>', '!=', '||'],
		});
	}
}

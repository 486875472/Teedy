-- DBUPDATE-031-0.SQL

-- Insert a new setting for OCR recognition
insert into T_CONFIG (CFG_ID_C, CFG_VALUE_C) values ('OCR_ENABLED', 'true');
ALTER TABLE T_USER ADD COLUMN USE_APPROVED_B BOOLEAN DEFAULT FALSE;


-- Update the database version
update T_CONFIG set CFG_VALUE_C = '31' where CFG_ID_C = 'DB_VERSION';

-- Convert status column to ENUM type
ALTER TABLE transactions 
MODIFY COLUMN status ENUM('PENDING', 'COMPLETED', 'FAILED', 'FLAGGED') NOT NULL;

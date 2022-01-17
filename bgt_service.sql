USE bgt_service;

#MAKE UUID
SELECT UUID();
SELECT REPLACE(UUID(),'-','');
SELECT UNHEX(REPLACE(UUID(),'-',''));

#Make String
SELECT LPAD(COUNT(*)+1, 5, '0') FROM user_list;

#AUTO INCREASE RESET
ALTER TABLE user_list AUTO_INCREMENT=1;
SET @COUNT :=0;
UPDATE user_list SET idx = @COUNT:=@COUNT+1;


#IFNULL EXAMPLE
SELECT IFNULL(idx, 0) FROM user_list ORDER BY idx DESC LIMIT 1;

#ORDER BY
SELECT * FROM user_list ORDER BY idx ASC;
SELECT * FROM user_list ORDER BY idx DESC;


#DESC :: TABLE INFO
DESC user_list;             #00
SELECT * FROM user_list;    #00


#Procedure setWorker
SHOW procedure status WHERE Db LIKE 'bgt_service';
DROP procedure setUser;

DELIMITER $$
    CREATE PROCEDURE setUser (
        _uuid varchar(255),
        _email varchar(255),
        _password varchar(60)
    )
    BEGIN
        DECLARE uuid_binary binary(16);

        SET uuid_binary = UNHEX(REPLACE(_uuid,'-',''));
        INSERT INTO user_list(uuid, email, password)
            VALUES (uuid_binary, _email, _password);
    END;
DELIMITER ;;

INSERT INTO user_list(uuid,email, password) VALUES (UNHEX(REPLACE(UUID(),'-','')), 'admin@baekgomtalk.com','Baekgom00!');

call setUser('e97d2e3f-fa69-4b49-8c3b-9efe0f6ca67c','admin@baekgomtalk.com','$2b$10$18/1EKXWvw4Spx03MoLEI.7Zk6Dq/');

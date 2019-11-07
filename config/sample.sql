
CREATE USER 'user'@'localhost' IDENTIFIED BY 'abc123';

GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost';

CREATE DATABASE sample CHARACTER SET utf8;

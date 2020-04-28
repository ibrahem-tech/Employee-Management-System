DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department(
id INT AUTO_INCREMENT NOT NULL,
department_name VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE role(
id INT AUTO_INCREMENT NOT NULL,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2),
department_id INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
 id int,
    first_name varchar(30),
    last_name varchar(30),
    role_id int,
    manager_id int DEFAULT NULL, 
    PRIMARY KEY (id)
)

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
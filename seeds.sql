USE hr_DB;

INSERT INTO department(name) VALUES("Sales");
INSERT INTO department(name) VALUES("Engineering");
INSERT INTO department(name) VALUES("Market");

INSERT INTO role(title, salary) VALUES("Sales Lead", 50000.00);
INSERT INTO role(title, salary) VALUES("Engineer", 70000.00);
INSERT INTO role(title, salary) VALUES("Flyer Designer", 90000.00);

INSERT INTO employee(first_name, last_name, role_id) VALUES("John", "Smith", 2);
INSERT INTO employee(first_name, last_name, role_id) VALUES("Jane", "Doe", 1);
INSERT INTO employee(first_name, last_name, role_id) VALUES("Cloud", "Squall", 3);
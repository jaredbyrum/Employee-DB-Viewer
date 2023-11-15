INSERT INTO departments (name)
VALUES  ("sales"),
        ("marketing"),
        ("engineering"),
        ("finance"),
        ("legal");

INSERT INTO roles (title, salary, department_id)
VALUES  ("head engineer", 150000, 3),
        ("salesperson", 80000, 1),
        ("finance manager", 160000, 4),
        ("engineer", 100000, 3),
        ("accountant", 120000, 4),
        ("head of legal", 250000, 5),
        ("social media marketer", 100000, 2),
        ("lawyer", 190000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)    
VALUES  ("Jared", "Byrum", 1, NULL),
        ("Matt", "Brown", 4, 1), 
        ("John", "Smith", 4, NULL),
        ("Kelly", "White", 5, 3),
        ("Alice", "Green", 6, NULL),
        ("Bob", "Black", 7, NULL),
        ("Sarah", "Gray", 8, 5),
        ("Tom", "Hill", 3, 1);

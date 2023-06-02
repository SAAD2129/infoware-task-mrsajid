 CREATE TABLE Employee (
   id INT PRIMARY KEY AUTO_INCREMENT,
   FullName VARCHAR(100) NOT NULL,
   JobTitle VARCHAR(100) NOT NULL,
   Address VARCHAR(200) NOT NULL,
   City VARCHAR(100) NOT NULL,
   State VARCHAR(100) NOT NULL
 );

CREATE TABLE contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  primaryContactName VARCHAR(100) NOT NULL,
  secondaryContactName VARCHAR(100),
  primaryContactNo VARCHAR(20) NOT NULL,
  secondaryContactNo VARCHAR(20),
  primaryRelation VARCHAR(100) NOT NULL,
  secondaryRelation VARCHAR(100),
  empId INT,
  FOREIGN KEY (empId) REFERENCES Employee(id)
);

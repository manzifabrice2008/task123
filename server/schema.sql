-- SRMS Database Schema
-- Sales Record Management System for DAB Enterprise Ltd

CREATE DATABASE IF NOT EXISTS SRMS;
USE SRMS;

-- Users table
CREATE TABLE IF NOT EXISTS Users (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  UserName VARCHAR(100) NOT NULL UNIQUE,
  Password VARCHAR(255) NOT NULL,
  INDEX idx_username (UserName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Items table
CREATE TABLE IF NOT EXISTS Items (
  ItemID INT AUTO_INCREMENT PRIMARY KEY,
  ItemName VARCHAR(200) NOT NULL,
  Specification TEXT,
  UnitMeasure VARCHAR(50) NOT NULL,
  Quantity INT NOT NULL DEFAULT 0,
  UnitPrice DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  INDEX idx_itemname (ItemName),
  INDEX idx_specification (Specification(100)),
  CONSTRAINT chk_quantity CHECK (Quantity >= 0),
  CONSTRAINT chk_unitprice CHECK (UnitPrice > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sales table
CREATE TABLE IF NOT EXISTS Sales (
  SaleID INT AUTO_INCREMENT PRIMARY KEY,
  SaleDate DATE NOT NULL,
  CustomerName VARCHAR(200) NOT NULL,
  TotalPrice DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  INDEX idx_saledate (SaleDate),
  INDEX idx_customername (CustomerName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SalesDetail table
CREATE TABLE IF NOT EXISTS SalesDetail (
  SalesDetailID INT AUTO_INCREMENT PRIMARY KEY,
  SaleID INT NOT NULL,
  ItemID INT NOT NULL,
  QuantitySold INT NOT NULL,
  UnitPrice DECIMAL(12, 2) NOT NULL,
  SubTotalPrice DECIMAL(12, 2) NOT NULL,
  CONSTRAINT fk_saledetail_sale FOREIGN KEY (SaleID)
    REFERENCES Sales(SaleID) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_saledetail_item FOREIGN KEY (ItemID)
    REFERENCES Items(ItemID) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_qty_sold CHECK (QuantitySold > 0),
  INDEX idx_saleid (SaleID),
  INDEX idx_itemid (ItemID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

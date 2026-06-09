-- Seed Data for SRMS
USE SRMS;

-- Admin user will be inserted programmatically by the server
-- to ensure proper bcrypt hashing.

-- Insert 20 Items
INSERT INTO Items (ItemName, Specification, UnitMeasure, Quantity, UnitPrice) VALUES
('Hammer', 'Claw Hammer 16oz with Fiberglass Handle', 'Piece', 50, 12.50),
('Cement', 'Portland Cement 50kg Bag', 'Bag', 200, 8.75),
('Paint', 'Interior Latex Paint 5L White', 'Bucket', 80, 25.00),
('Nails', 'Galvanized Nails 2 inch 1kg', 'Kg', 100, 3.50),
('Bricks', 'Red Clay Bricks Standard Size', 'Piece', 5000, 0.85),
('PVC Pipe', 'PVC Pipe 1 inch x 3m', 'Piece', 120, 6.00),
('Steel Bar', 'Reinforcing Steel Bar 12mm x 6m', 'Piece', 300, 15.00),
('Wood Plank', 'Pine Wood Plank 2x4 inch x 3m', 'Piece', 150, 7.50),
('Tile', 'Ceramic Floor Tile 60x60cm', 'Box', 90, 22.00),
('Electrical Cable', 'Copper Wire 2.5mm x 100m', 'Roll', 40, 45.00),
('Door Lock', 'Mortise Lock Set with Handles', 'Set', 60, 18.50),
('Window Glass', 'Clear Float Glass 4mm x 1sqm', 'Piece', 70, 12.00),
('Paint Brush', 'Nylon Paint Brush 4 inch', 'Piece', 85, 4.50),
('Sand', 'River Sand Fine Grade per Tonne', 'Tonne', 30, 20.00),
('Gravel', 'Crushed Stone 3/4 inch per Tonne', 'Tonne', 25, 22.00),
('Roofing Sheet', 'Corrugated Iron Sheet 2.4m', 'Piece', 200, 11.00),
('Plaster', 'Plaster of Paris 25kg Bag', 'Bag', 60, 6.50),
('Water Tank', 'Plastic Water Tank 1000L', 'Piece', 15, 85.00),
('Wheelbarrow', 'Heavy Duty Wheelbarrow 100L', 'Piece', 25, 55.00),
('Shovel', 'Round Point Shovel with Handle', 'Piece', 40, 10.00);

-- Insert 15 Sales
INSERT INTO Sales (SaleDate, CustomerName, TotalPrice) VALUES
('2024-01-05', 'Jean Pierre Habimana', 156.25),
('2024-01-08', 'Alice Mukamana', 340.00),
('2024-01-12', 'Patrick Niyonzima', 525.00),
('2024-01-15', 'Grace Uwimana', 89.50),
('2024-01-20', 'David Nkurunziza', 1275.00),
('2024-02-01', 'Marie Claire Imanizabayo', 210.00),
('2024-02-05', 'Eric Bayisenge', 780.00),
('2024-02-10', 'Jeanne dArc Mugwaneza', 95.00),
('2024-02-15', 'Samuel Rwigamba', 460.00),
('2024-02-20', 'Esther Nyirarukundo', 1120.00),
('2024-03-01', 'Olivier Nsengimana', 185.50),
('2024-03-05', 'Diane Uwase', 640.00),
('2024-03-10', 'Fiston Habiyaremye', 310.00),
('2024-03-15', 'Brenda Ishimwe', 870.00),
('2024-03-20', 'Emmanuel Ndayisaba', 425.00);

-- Insert 40 Sales Details
INSERT INTO SalesDetail (SaleID, ItemID, QuantitySold, UnitPrice, SubTotalPrice) VALUES
-- Sale 1
(1, 1, 3, 12.50, 37.50),
(1, 4, 5, 3.50, 17.50),
(1, 13, 2, 4.50, 9.00),
(1, 2, 10, 8.75, 87.50),
(1, 8, 1, 7.50, 7.50),
-- Sale 2
(2, 3, 4, 25.00, 100.00),
(2, 13, 10, 4.50, 45.00),
(2, 9, 3, 22.00, 66.00),
(2, 11, 2, 18.50, 37.00),
(2, 17, 2, 6.50, 13.00),
-- Sale 3
(3, 2, 20, 8.75, 175.00),
(3, 6, 10, 6.00, 60.00),
(3, 16, 15, 11.00, 165.00),
(3, 7, 5, 15.00, 75.00),
(3, 14, 3, 20.00, 60.00),
-- Sale 4
(4, 1, 2, 12.50, 25.00),
(4, 4, 5, 3.50, 17.50),
(4, 13, 3, 4.50, 13.50),
(4, 20, 2, 10.00, 20.00),
(4, 8, 1, 7.50, 7.50),
-- Sale 5
(5, 7, 30, 15.00, 450.00),
(5, 2, 50, 8.75, 437.50),
(5, 5, 200, 0.85, 170.00),
(5, 14, 5, 20.00, 100.00),
(5, 15, 4, 22.00, 88.00),
-- Sale 6
(6, 3, 2, 25.00, 50.00),
(6, 6, 5, 6.00, 30.00),
(6, 9, 2, 22.00, 44.00),
(6, 16, 6, 11.00, 66.00),
(6, 18, 1, 85.00, 85.00),
-- Sale 7
(7, 2, 40, 8.75, 350.00),
(7, 5, 200, 0.85, 170.00),
(7, 7, 10, 15.00, 150.00),
(7, 16, 10, 11.00, 110.00),
-- Sale 8
(8, 1, 2, 12.50, 25.00),
(8, 4, 10, 3.50, 35.00),
(8, 13, 5, 4.50, 22.50),
(8, 17, 2, 6.50, 13.00),
-- Sale 9
(9, 6, 10, 6.00, 60.00),
(9, 9, 5, 22.00, 110.00),
(9, 11, 5, 18.50, 92.50),
(9, 3, 3, 25.00, 75.00),
(9, 20, 5, 10.00, 50.00),
-- Sale 10
(10, 7, 20, 15.00, 300.00),
(10, 2, 40, 8.75, 350.00),
(10, 5, 300, 0.85, 255.00),
(10, 14, 5, 20.00, 100.00),
(10, 15, 3, 22.00, 66.00),
-- Sale 11
(11, 1, 3, 12.50, 37.50),
(11, 4, 8, 3.50, 28.00),
(11, 8, 4, 7.50, 30.00),
(11, 13, 10, 4.50, 45.00),
(11, 20, 4, 10.00, 40.00),
-- Sale 12
(12, 3, 5, 25.00, 125.00),
(12, 6, 15, 6.00, 90.00),
(12, 9, 5, 22.00, 110.00),
(12, 16, 20, 11.00, 220.00),
(12, 11, 3, 18.50, 55.50),
-- Sale 13
(13, 2, 20, 8.75, 175.00),
(13, 7, 5, 15.00, 75.00),
(13, 5, 50, 0.85, 42.50),
(13, 17, 3, 6.50, 19.50),
-- Sale 14
(14, 1, 4, 12.50, 50.00),
(14, 3, 6, 25.00, 150.00),
(14, 9, 5, 22.00, 110.00),
(14, 6, 20, 6.00, 120.00),
(14, 16, 25, 11.00, 275.00),
(14, 18, 2, 85.00, 170.00),
-- Sale 15
(15, 2, 25, 8.75, 218.75),
(15, 7, 8, 15.00, 120.00),
(15, 5, 100, 0.85, 85.00),
(15, 12, 2, 12.00, 24.00);

-- Seed script for store database
-- Truncate tables and insert sample data
BEGIN;

-- Disable triggers to allow truncation with FK constraints
ALTER TABLE products_orders DISABLE TRIGGER ALL;
ALTER TABLE orders DISABLE TRIGGER ALL;
ALTER TABLE products DISABLE TRIGGER ALL;
ALTER TABLE users DISABLE TRIGGER ALL;

TRUNCATE TABLE products_orders RESTART IDENTITY CASCADE;
TRUNCATE TABLE orders RESTART IDENTITY CASCADE;
TRUNCATE TABLE products RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Re-enable triggers
ALTER TABLE products_orders ENABLE TRIGGER ALL;
ALTER TABLE orders ENABLE TRIGGER ALL;
ALTER TABLE products ENABLE TRIGGER ALL;
ALTER TABLE users ENABLE TRIGGER ALL;

-- Insert 20 users
INSERT INTO users (firstName, lastName, password) VALUES
('Alice','Anderson','pwd1'),
('Bob','Bennett','pwd2'),
('Carol','Clark','pwd3'),
('David','Dawson','pwd4'),
('Eve','Edwards','pwd5'),
('Frank','Foster','pwd6'),
('Grace','Green','pwd7'),
('Heidi','Hughes','pwd8'),
('Ivan','Iverson','pwd9'),
('Judy','Jones','pwd10'),
('Karl','King','pwd11'),
('Laura','Lewis','pwd12'),
('Mallory','Mason','pwd13'),
('Niaj','Nelson','pwd14'),
('Olivia','Owens','pwd15'),
('Peggy','Peters','pwd16'),
('Quinn','Quincy','pwd17'),
('Rupert','Reed','pwd18'),
('Sybil','Scott','pwd19'),
('Trent','Turner','pwd20');

-- Insert 20 products
INSERT INTO products (name, price, category) VALUES
('Widget A', 9.99, 'gadgets'),
('Widget B', 14.99, 'gadgets'),
('Gizmo A', 19.99, 'gadgets'),
('Gizmo B', 24.99, 'gadgets'),
('Thingamajig A', 4.99, 'tools'),
('Thingamajig B', 7.99, 'tools'),
('Doohickey A', 29.99, 'tools'),
('Doohickey B', 39.99, 'tools'),
('Contraption A', 49.99, 'home'),
('Contraption B', 59.99, 'home'),
('Gadget Pro', 199.99, 'electronics'),
('Gadget Mini', 89.99, 'electronics'),
('Device X', 129.99, 'electronics'),
('Device Y', 149.99, 'electronics'),
('Accessory 1', 5.99, 'accessories'),
('Accessory 2', 6.99, 'accessories'),
('Accessory 3', 3.99, 'accessories'),
('Accessory 4', 2.99, 'accessories'),
('Novelty 1', 1.99, 'novelty'),
('Novelty 2', 2.49, 'novelty');

-- Insert orders with varied distribution per user
-- User 1: 1 active + 5 completed (6 total)
-- User 2: 1 active + 4 completed (5 total)
-- User 3: 1 active + 3 completed (4 total)
-- User 4: 1 active + 2 completed (3 total)
-- User 5: 1 active + 1 completed (2 total)
-- User 6: 1 active + 0 completed (1 total)
-- User 7: 0 active + 5 completed (5 total)
-- User 8: 0 active + 4 completed (4 total)
-- User 9: 0 active + 3 completed (3 total)
-- User 10: 0 active + 2 completed (2 total)
-- User 11: 0 active + 1 completed (1 total)
-- Users 12-20: 0 orders
-- Total: 42 orders
INSERT INTO orders (status, user_id) VALUES
-- Users with active orders (1-6)
(true, 1),
(true, 2),
(true, 3),
(true, 4),
(true, 5),
(true, 6),
-- User 1: 5 completed
(false, 1), (false, 1), (false, 1), (false, 1), (false, 1),
-- User 2: 4 completed
(false, 2), (false, 2), (false, 2), (false, 2),
-- User 3: 3 completed
(false, 3), (false, 3), (false, 3),
-- User 4: 2 completed
(false, 4), (false, 4),
-- User 5: 1 completed
(false, 5),
-- User 6: 0 completed (only active order above)
-- Users with only completed orders (7-11)
-- User 7: 5 completed
(false, 7), (false, 7), (false, 7), (false, 7), (false, 7),
-- User 8: 4 completed
(false, 8), (false, 8), (false, 8), (false, 8),
-- User 9: 3 completed
(false, 9), (false, 9), (false, 9),
-- User 10: 2 completed
(false, 10), (false, 10),
-- User 11: 1 completed
(false, 11);

-- Insert products_orders: distribute across 36 orders with clear popularity
INSERT INTO products_orders (product_id, order_id, quantity) VALUES
-- Product 1 (Widget A) - most popular: appears in ~22 orders
(1,1,2),(1,2,1),(1,3,3),(1,4,1),(1,5,2),(1,6,1),(1,7,1),(1,8,2),(1,9,1),(1,10,1),
(1,11,2),(1,12,1),(1,13,1),(1,14,2),(1,15,1),(1,16,1),(1,17,2),(1,18,1),(1,19,1),(1,20,2),
(1,21,1),(1,22,2),
-- Product 2 (Widget B) - 2nd: appears in ~18 orders
(2,1,1),(2,2,2),(2,3,1),(2,4,2),(2,5,1),(2,6,2),(2,7,1),(2,8,1),(2,9,2),(2,10,1),
(2,11,1),(2,12,2),(2,13,1),(2,14,1),(2,15,2),(2,16,1),(2,23,2),(2,24,1),
-- Product 3 (Gizmo A) - 3rd: appears in ~14 orders
(3,1,1),(3,2,1),(3,5,2),(3,6,1),(3,11,1),(3,13,2),(3,15,1),(3,17,1),(3,22,1),(3,23,2),
(3,25,1),(3,26,1),(3,27,2),(3,28,1),
-- Product 4 (Gizmo B) - 4th: appears in ~11 orders
(4,3,2),(4,7,1),(4,12,1),(4,14,2),(4,16,1),(4,18,1),(4,24,2),(4,25,1),(4,29,1),(4,30,2),
(4,31,1),
-- Product 5 (Thingamajig A) - 5th: appears in ~9 orders
(5,4,1),(5,8,2),(5,13,1),(5,19,1),(5,20,2),(5,26,1),(5,32,2),(5,33,1),(5,34,1),
-- Products 6-10: moderate popularity (5-7 orders each)
(6,9,1),(6,14,2),(6,19,1),(6,27,1),(6,35,2),(6,21,1),(6,22,2),
(7,10,1),(7,15,1),(7,20,2),(7,28,1),(7,36,2),(7,23,1),
(8,11,1),(8,16,2),(8,29,1),(8,30,2),(8,24,1),
(9,12,1),(9,17,1),(9,31,2),(9,32,1),(9,25,2),
(10,13,2),(10,18,1),(10,33,1),(10,34,2),(10,26,1),
-- Products 11-20: less popular (1-3 orders each)
(11,1,1),(11,27,2),(11,35,1),
(12,2,1),(12,28,1),(12,36,2),
(13,3,2),(13,29,1),
(14,4,1),(14,30,2),
(15,5,1),(15,31,1),
(16,6,2),(16,32,1),
(17,7,1),(17,33,2),
(18,8,1),(18,34,1),
(19,9,2),(19,35,1),
(20,10,1),(20,36,2);

COMMIT;

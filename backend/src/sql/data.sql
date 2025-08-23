-- Disable the trigger that creates invoices on new orders
ALTER TABLE orders DISABLE TRIGGER trigger_create_invoice_on_order;

-- Disable the trigger that creates sales records and updates order payment status when an invoice is paid
ALTER TABLE invoices DISABLE TRIGGER trigger_create_sale_and_update_order_payment_on_invoice_paid;

-- Categories Table Inserts (Tech/CS Focused)
INSERT INTO categories (name, description, created_at, updated_at, created_by, updated_by) VALUES
('Software', 'Applications, operating systems, and development tools.', '2025-07-01 09:00:00', '2025-07-01 09:00:00', 'system', 'system'),
('Hardware', 'Computer components, peripherals, and devices.', '2025-07-01 09:01:00', '2025-07-01 09:01:00', 'system', 'system'),
('Networking', 'Equipment and solutions for data communication.', '2025-07-01 09:02:00', '2025-07-01 09:02:00', 'system', 'system'),
('Cloud Services', 'Web-based computing resources and platforms.', '2025-07-01 09:03:00', '2025-07-01 09:03:00', 'system', 'system'),
('Cybersecurity', 'Tools and services for digital protection.', '2025-07-01 09:04:00', '2025-07-01 09:04:00', 'system', 'system'),
('Data Storage', 'Solutions for storing and managing digital information.', '2025-07-01 09:05:00', '2025-07-01 09:05:00', 'system', 'system'),
('AI & Machine Learning', 'Products and platforms for artificial intelligence.', '2025-07-01 09:06:00', '2025-07-01 09:06:00', 'system', 'system'),
('Gaming Hardware', 'Specialized equipment for computer gaming.', '2025-07-01 09:07:00', '2025-07-01 09:07:00', 'system', 'system'),
('Mobile Devices', 'Smartphones, tablets, and related accessories.', '2025-07-01 09:08:00', '2025-07-01 09:08:00', 'system', 'system');

-- Brands Table Inserts (Tech/CS Focused)
INSERT INTO brands (name, description, created_at, updated_at, created_by, updated_by) VALUES
('TechCore', 'Innovators in core computing hardware.', '2025-07-01 09:10:00', '2025-07-01 09:10:00', 'system', 'system'), -- Brand ID 1
('SoftGenius', 'Leading developer of enterprise software.', '2025-07-01 09:11:00', '2025-07-01 09:11:00', 'system', 'system'), -- Brand ID 2
('NetConnect', 'Specialists in high-speed networking solutions.', '2025-07-01 09:12:00', '2025-07-01 09:12:00', 'system', 'system'), -- Brand ID 3
('CloudSphere', 'Providers of scalable cloud infrastructure.', '2025-07-01 09:13:00', '2025-07-01 09:13:00', 'system', 'system'), -- Brand ID 4
('SecureGuard', 'Advanced cybersecurity solutions for businesses.', '2025-07-01 09:14:00', '2025-07-01 09:14:00', 'system', 'system'), -- Brand ID 5
('DataVault', 'Reliable and secure data storage systems.', '2025-07-01 09:15:00', '2025-07-01 09:15:00', 'system', 'system'), -- Brand ID 6
('CognitoAI', 'Pioneers in artificial intelligence and machine learning.', '2025-07-01 09:16:00', '2025-07-01 09:16:00', 'system', 'system'), -- Brand ID 7
('GamerForge', 'High-performance gaming PC components.', '2025-07-01 09:17:00', '2025-07-01 09:17:00', 'system', 'system'), -- Brand ID 8
('MobileTech', 'Cutting-edge mobile device manufacturer.', '2025-07-01 09:18:00', '2025-07-01 09:18:00', 'system', 'system'), -- Brand ID 9
('ByteSolutions', 'Comprehensive IT consulting and software services.', '2025-07-01 09:19:00', '2025-07-01 09:19:00', 'system', 'system'), -- Brand ID 10
('CircuitWorks', 'Custom electronic circuit design and manufacturing.', '2025-07-01 09:20:00', '2025-07-01 09:20:00', 'system', 'system'), -- Brand ID 11 (No products)
('QuantumLink', 'Next-gen secure communication protocols.', '2025-07-01 09:21:00', '2025-07-01 09:21:00', 'system', 'system'), -- Brand ID 12 (No products)
('AetherCloud', 'Decentralized cloud storage and computing.', '2025-07-01 09:22:00', '2025-07-01 09:22:00', 'system', 'system'), -- Brand ID 13
('SentinelSec', 'Endpoint protection and threat intelligence.', '2025-07-01 09:23:00', '2025-07-01 09:23:00', 'system', 'system'), -- Brand ID 14
('MegaDrive', 'High-capacity external storage devices.', '2025-07-01 09:24:00', '2025-07-01 09:24:00', 'system', 'system'), -- Brand ID 15
('NeuralNet', 'AI-powered analytics and automation.', '2025-07-01 09:25:00', '2025-07-01 09:25:00', 'system', 'system'); -- Brand ID 16

-- Customers Table Inserts
INSERT INTO customers (customer_id, first_name, last_name, email, phone, country, default_payment_method, created_at, updated_at, created_by, updated_by) VALUES
(1, 'Alice', 'Smith', 'alice.smith@example.com', '123-456-7890', 'USA', 'Credit Card', '2025-07-05 10:00:00', '2025-07-05 10:00:00', 'system', 'system'),
(2, 'Bob', 'Johnson', 'bob.j@example.com', '987-654-3210', 'Canada', 'PayPal', '2025-07-07 11:30:00', '2025-07-07 11:30:00', 'system', 'system'),
(3, 'Charlie', 'Brown', 'charlie.b@example.com', '555-123-4567', 'UK', 'Bank Transfer', '2025-07-09 14:15:00', '2025-07-09 14:15:00', 'system', 'system'),
(4, 'Diana', 'Prince', 'diana.p@example.com', '111-222-3333', 'USA', 'Credit Card', '2025-07-11 09:45:00', '2025-07-11 09:45:00', 'system', 'system'),
(5, 'Eve', 'Adams', 'eve.a@example.com', '444-555-6666', 'Australia', 'PayPal', '2025-07-13 16:20:00', '2025-07-13 16:20:00', 'system', 'system'),
(6, 'Frank', 'White', 'frank.w@example.com', '777-888-9999', 'Germany', 'Credit Card', '2025-07-15 10:10:00', '2025-07-15 10:10:00', 'system', 'system'),
(7, 'Grace', 'Taylor', 'grace.t@example.com', '222-333-4444', 'France', 'Bank Transfer', '2025-07-17 13:05:00', '2025-07-17 13:05:00', 'system', 'system'),
(8, 'Henry', 'Moore', 'henry.m@example.com', '666-777-8888', 'USA', 'Credit Card', '2025-07-19 08:50:00', '2025-07-19 08:50:00', 'system', 'system'),
(9, 'Ivy', 'King', 'ivy.k@example.com', '999-000-1111', 'New Zealand', 'PayPal', '2025-07-21 17:30:00', '2025-07-21 17:30:00', 'system', 'system'),
(10, 'Jack', 'Green', 'jack.g@example.com', '333-444-5555', 'Canada', 'Credit Card', '2025-07-23 12:00:00', '2025-07-23 12:00:00', 'system', 'system'),
(11, 'Karen', 'Hall', 'karen.h@example.com', '000-111-2222', 'UK', 'Bank Transfer', '2025-07-25 09:00:00', '2025-07-25 09:00:00', 'system', 'system'),
(12, 'Liam', 'Wright', 'liam.w@example.com', '123-987-6543', 'USA', 'Credit Card', '2025-07-27 15:40:00', '2025-07-27 15:40:00', 'system', 'system'),
(13, 'Mia', 'Lopez', 'mia.l@example.com', '456-789-0123', 'Mexico', 'PayPal', '2025-07-29 11:11:00', '2025-07-29 11:11:00', 'system', 'system'),
(14, 'Noah', 'Scott', 'noah.s@example.com', '789-012-3456', 'USA', 'Credit Card', '2025-07-31 14:22:00', '2025-07-31 14:22:00', 'system', 'system'),
(15, 'Olivia', 'Rivera', 'olivia.r@example.com', '012-345-6789', 'Spain', 'Bank Transfer', '2025-08-01 10:33:00', '2025-08-01 10:33:00', 'system', 'system'),
(16, 'Peter', 'Clark', 'peter.c@example.com', '345-678-9012', 'USA', 'Credit Card', '2025-08-02 09:55:00', '2025-08-02 09:55:00', 'system', 'system'),
(17, 'Quinn', 'Lewis', 'quinn.l@example.com', '678-901-2345', 'Ireland', 'PayPal', '2025-08-03 16:00:00', '2025-08-03 16:00:00', 'system', 'system'),
(18, 'Rachel', 'Young', 'rachel.y@example.com', '901-234-5678', 'USA', 'Credit Card', '2025-08-04 11:25:00', '2025-08-04 11:25:00', 'system', 'system'),
(19, 'Sam', 'Harris', 'sam.h@example.com', '234-567-8901', 'Canada', 'Bank Transfer', '2025-08-05 13:10:00', '2025-08-05 13:10:00', 'system', 'system'),
(20, 'Tina', 'Nelson', 'tina.n@example.com', '567-890-1234', 'UK', 'Credit Card', '2025-08-06 09:00:00', '2025-08-06 09:00:00', 'system', 'system'),
(21, 'Uma', 'Carter', 'uma.c@example.com', '890-123-4567', 'USA', 'PayPal', '2025-07-02 14:00:00', '2025-07-02 14:00:00', 'system', 'system'),
(22, 'Victor', 'Mitchell', 'victor.m@example.com', '123-123-1234', 'Germany', 'Credit Card', '2025-07-04 10:30:00', '2025-07-04 10:30:00', 'system', 'system'),
(23, 'Wendy', 'Perez', 'wendy.p@example.com', '456-456-4567', 'France', 'Bank Transfer', '2025-07-06 16:00:00', '2025-07-06 16:00:00', 'system', 'system'),
(24, 'Xavier', 'Roberts', 'xavier.r@example.com', '789-789-7890', 'USA', 'Credit Card', '2025-07-08 11:45:00', '2025-07-08 11:45:00', 'system', 'system'),
(25, 'Yara', 'Turner', 'yara.t@example.com', '012-012-0123', 'Australia', 'PayPal', '2025-07-10 13:20:00', '2025-07-10 13:20:00', 'system', 'system'),
(26, 'Zane', 'Phillips', 'zane.p@example.com', '345-345-3456', 'Canada', 'Credit Card', '2025-07-12 09:10:00', '2025-07-12 09:10:00', 'system', 'system'),
(27, 'Amy', 'Campbell', 'amy.c@example.com', '678-678-6789', 'UK', 'Bank Transfer', '2025-07-14 15:05:00', '2025-07-14 15:05:00', 'system', 'system'),
(28, 'Ben', 'Parker', 'ben.p@example.com', '901-901-9012', 'USA', 'Credit Card', '2025-07-16 10:00:00', '2025-07-16 10:00:00', 'system', 'system'),
(29, 'Chloe', 'Evans', 'chloe.e@example.com', '234-234-2345', 'New Zealand', 'PayPal', '2025-07-18 17:15:00', '2025-07-18 17:15:00', 'system', 'system'),
(30, 'David', 'Edwards', 'david.e@example.com', '567-567-5678', 'USA', 'Credit Card', '2025-07-20 12:40:00', '2025-07-20 12:40:00', 'system', 'system'),
(31, 'Fiona', 'Collins', 'fiona.c@example.com', '890-890-8901', 'Ireland', 'Bank Transfer', '2025-07-22 09:30:00', '2025-07-22 09:30:00', 'system', 'system'),
(32, 'George', 'Stewart', 'george.s@example.com', '111-333-5555', 'USA', 'Credit Card', '2025-07-24 14:50:00', '2025-07-24 14:50:00', 'system', 'system'),
(33, 'Hannah', 'Morris', 'hannah.m@example.com', '444-666-8888', 'Mexico', 'PayPal', '2025-07-26 10:20:00', '2025-07-26 10:20:00', 'system', 'system'),
(34, 'Isaac', 'Rogers', 'isaac.r@example.com', '777-999-1111', 'USA', 'Credit Card', '2025-07-28 16:10:00', '2025-07-28 16:10:00', 'system', 'system'),
(35, 'Julia', 'Reed', 'julia.r@example.com', '000-222-4444', 'Spain', 'Bank Transfer', '2025-07-30 11:00:00', '2025-07-30 11:00:00', 'system', 'system'),
(36, 'Kyle', 'Cook', 'kyle.c@example.com', '333-555-7777', 'USA', 'Credit Card', '2025-08-06 10:00:00', '2025-08-06 10:00:00', 'system', 'system');

-- Products Table Inserts (Tech/CS Focused)
INSERT INTO products (product_id, brand_id, category_id, name, description, price, stock_quantity, created_at, updated_at, created_by, updated_by) VALUES
(1, 3, 3, 'Gigabit Ethernet Switch', 'High-speed network switch for local area networks.', 79.95, 150, '2025-07-06 10:00:00', '2025-07-06 10:00:00', 'system', 'system'),
(2, 8, 8, 'Mechanical Gaming Keyboard', 'Durable keyboard with customizable RGB lighting.', 85.00, 130, '2025-07-07 11:00:00', '2025-07-07 11:00:00', 'system', 'system'),
(3, 1, 2, 'External SSD 1TB', 'Portable and fast external solid-state drive.', 120.00, 200, '2025-07-08 14:00:00', '2025-07-08 14:00:00', 'system', 'system'),
(4, 1, 2, 'High-Performance CPU', 'Latest generation multi-core processor for demanding tasks.', 349.99, 80, '2025-07-09 09:30:00', '2025-07-09 09:30:00', 'system', 'system'),
(5, 1, 2, 'Gaming Motherboard Z5', 'Advanced motherboard with RGB and overclocking support.', 189.00, 70, '2025-07-10 10:30:00', '2025-07-10 10:30:00', 'system', 'system'),
(6, 3, 3, 'Wireless Router AX6000', 'Wi-Fi 6 router for blazing fast wireless speeds.', 199.00, 100, '2025-07-11 10:00:00', '2025-07-11 10:00:00', 'system', 'system'),
(7, 9, 9, 'Flagship Smartphone X', 'Latest model smartphone with advanced camera and features.', 899.00, 110, '2025-07-12 15:30:00', '2025-07-12 15:30:00', 'system', 'system'),
(8, 2, 1, 'DevOps Automation Tool', 'Software for streamlining development and operations.', 250.00, 80, '2025-07-13 09:00:00', '2025-07-13 09:00:00', 'system', 'system'),
(9, 2, 1, 'Operating System Pro', 'Next-gen OS for enhanced productivity and security.', 149.50, 500, '2025-07-14 11:00:00', '2025-07-14 11:00:00', 'system', 'system'),
(10, 4, 4, 'Cloud Storage Enterprise', 'Scalable cloud storage solution for large organizations.', 499.00, 50, '2025-07-15 14:00:00', '2025-07-15 14:00:00', 'system', 'system'),
(11, 4, 4, 'Serverless Computing Platform', 'On-demand computing resources without server management.', 350.00, 60, '2025-07-16 13:30:00', '2025-07-16 13:30:00', 'system', 'system'),
(12, 9, 9, 'Premium Tablet Pro', 'Versatile tablet for productivity and entertainment.', 549.00, 95, '2025-07-17 09:40:00', '2025-07-17 09:40:00', 'system', 'system'),
(13, 3, 3, 'Fiber Optic Cable 100m', 'High-bandwidth cable for network infrastructure.', 50.00, 300, '2025-07-18 16:00:00', '2025-07-18 16:00:00', 'system', 'system'),
(14, 2, 1, 'Database Management Suite', 'Comprehensive tools for data storage and retrieval.', 299.99, 120, '2025-07-19 10:00:00', '2025-07-19 10:00:00', 'system', 'system'),
(15, 5, 5, 'Endpoint Protection Suite', 'AI-powered security for all network endpoints.', 99.00, 200, '2025-07-20 09:15:00', '2025-07-20 09:15:00', 'system', 'system'),
(16, 5, 5, 'Network Firewall Appliance', 'Hardware firewall for robust network security.', 750.00, 30, '2025-07-21 08:45:00', '2025-07-21 08:45:00', 'system', 'system'),
(17, 10, 1, 'Custom Software Development', 'Tailored software solutions for unique business needs.', 1500.00, 10, '2025-07-22 14:10:00', '2025-07-22 14:10:00', 'system', 'system'),
(18, 6, 6, 'SSD 2TB NVMe', 'Ultra-fast solid-state drive for high-performance storage.', 220.00, 180, '2025-07-23 10:00:00', '2025-07-23 10:00:00', 'system', 'system'),
(19, 6, 6, 'NAS Storage System', 'Network-attached storage for home and small office.', 399.00, 90, '2025-07-24 14:30:00', '2025-07-24 14:30:00', 'system', 'system'),
(20, 1, 2, 'Mini PC Barebone Kit', 'Compact PC kit for custom builds.', 250.00, 60, '2025-07-25 11:45:00', '2025-07-25 11:45:00', 'system', 'system'),
(21, 7, 7, 'Machine Learning Framework', 'Software library for developing AI models.', 120.00, 250, '2025-07-26 15:00:00', '2025-07-26 15:00:00', 'system', 'system'),
(22, 3, 3, 'Managed Wi-Fi Service', 'Professional management of wireless networks.', 120.00, 20, '2025-07-27 10:55:00', '2025-07-27 10:55:00', 'system', 'system'),
(23, 7, 7, 'AI Development Kit', 'Hardware and software for AI application development.', 500.00, 40, '2025-07-28 12:10:00', '2025-07-28 12:10:00', 'system', 'system'),
(24, 13, 4, 'Hybrid Cloud Solution', 'Integration of private and public cloud environments.', 1800.00, 15, '2025-07-29 09:00:00', '2025-07-29 09:00:00', 'system', 'system'),
(25, 14, 5, 'Threat Intelligence Platform', 'Real-time data on cyber threats and vulnerabilities.', 700.00, 25, '2025-07-30 16:00:00', '2025-07-30 16:00:00', 'system', 'system'),
(26, 15, 6, 'Enterprise Backup Solution', 'Robust data backup and recovery for businesses.', 600.00, 35, '2025-08-01 11:00:00', '2025-08-01 11:00:00', 'system', 'system'),
(27, 16, 7, 'Predictive Analytics Software', 'AI-driven software for forecasting and trend analysis.', 950.00, 18, '2025-08-02 14:30:00', '2025-08-02 14:30:00', 'system', 'system'),
(28, 8, 8, 'Gaming Graphics Card RTX', 'High-end GPU for immersive gaming experiences.', 699.00, 70, '2025-08-03 09:00:00', '2025-08-03 09:00:00', 'system', 'system'),
(29, 9, 9, 'Smartwatch OS Update', 'Software update for MobileTech smartwatches.', 0.00, 9999, '2025-08-04 10:00:00', '2025-08-04 10:00:00', 'system', 'system'),
(30, 1, 2, 'CPU Cooling System', 'Advanced liquid cooling for high-performance CPUs.', 89.99, 100, '2025-08-05 11:00:00', '2025-08-05 11:00:00', 'system', 'system');


-- Shipping Addresses Inserts
-- Using the first 10 customers (IDs 1-10) for orders
INSERT INTO shipping_addresses (address_id, customer_id, street_address, city, state, postal_code, country, created_at, updated_at, created_by, updated_by) VALUES
(1, 1, '456 Tech Avenue', 'San Jose', 'CA', '95101', 'USA', '2025-08-05 12:00:00', '2025-08-05 12:00:00', 'system', 'system'),
(2, 2, '789 Data Drive', 'Vancouver', 'BC', 'V6B 1C0', 'Canada', '2025-08-05 12:01:00', '2025-08-05 12:01:00', 'system', 'system'),
(3, 3, '101 Cyber Lane', 'London', 'ENG', 'SW1A 0AA', 'UK', '2025-08-05 12:02:00', '2025-08-05 12:02:00', 'system', 'system'),
(4, 4, '202 Logic Gate', 'Austin', 'TX', '78701', 'USA', '2025-08-05 12:03:00', '2025-08-05 12:03:00', 'system', 'system'),
(5, 5, '303 Quantum Road', 'Sydney', 'NSW', '2000', 'Australia', '2025-08-05 12:04:00', '2025-08-05 12:04:00', 'system', 'system'),
(6, 6, '404 Algorithm Alley', 'Berlin', 'BE', '10115', 'Germany', '2025-08-05 12:05:00', '2025-08-05 12:05:00', 'system', 'system'),
(7, 7, '505 Network Nook', 'Paris', 'IDF', '75001', 'France', '2025-08-05 12:06:00', '2025-08-05 12:06:00', 'system', 'system'),
(8, 8, '606 Code Street', 'Seattle', 'WA', '98101', 'USA', '2025-08-05 12:07:00', '2025-08-05 12:07:00', 'system', 'system'),
(9, 9, '707 Byte Boulevard', 'Wellington', 'WGN', '6011', 'New Zealand', '2025-08-05 12:08:00', '2025-08-05 12:08:00', 'system', 'system'),
(10, 10, '808 Pixel Place', 'Toronto', 'ON', 'M5V 2T6', 'Canada', '2025-08-05 12:09:00', '2025-08-05 12:09:00', 'system', 'system');

-- Orders Inserts
INSERT INTO orders (order_id, customer_id, shipping_address_id, order_date, status, total_amount, payment_status, created_at, updated_at, created_by, updated_by) VALUES
(1, 1, 1, '2025-08-05 12:10:00', 'order placed', 284.95, 'Completed', '2025-08-05 12:10:00', '2025-08-05 12:10:00', 'system', 'system'),
(2, 2, 2, '2025-08-05 12:15:00', 'order placed', 538.99, 'Completed', '2025-08-05 12:15:00', '2025-08-05 12:15:00', 'system', 'system'),
(3, 3, 3, '2025-08-05 12:20:00', 'order placed', 398.00, 'Completed', '2025-08-05 12:20:00', '2025-08-05 12:20:00', 'system', 'system'),
(4, 4, 4, '2025-08-05 12:25:00', 'order placed', 899.00, 'Completed', '2025-08-05 12:25:00', '2025-08-05 12:25:00', 'system', 'system'),
(5, 5, 5, '2025-08-05 12:30:00', 'order placed', 698.50, 'Completed', '2025-08-05 12:30:00', '2025-08-05 12:30:00', 'system', 'system'),
(6, 6, 6, '2025-08-05 12:35:00', 'order placed', 849.00, 'Completed', '2025-08-05 12:35:00', '2025-08-05 12:35:00', 'system', 'system'),
(7, 7, 7, '2025-08-05 12:40:00', 'order placed', 599.00, 'Completed', '2025-08-05 12:40:00', '2025-08-05 12:40:00', 'system', 'system'),
(8, 8, 8, '2025-08-05 12:45:00', 'order placed', 299.99, 'Completed', '2025-08-05 12:45:00', '2025-08-05 12:45:00', 'system', 'system'),
(9, 9, 9, '2025-08-05 12:50:00', 'order placed', 849.00, 'Completed', '2025-08-05 12:50:00', '2025-08-05 12:50:00', 'system', 'system'),
(10, 10, 10, '2025-08-05 12:55:00', 'order placed', 1500.00, 'Completed', '2025-08-05 12:55:00', '2025-08-05 12:55:00', 'system', 'system');

-- Order Items Inserts (linked to orders and products)
INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price, created_at, updated_at, created_by, updated_by) VALUES
(1, 1, 1, 1, 79.95, '2025-08-05 12:10:01', '2025-08-05 12:10:01', 'system', 'system'), -- Product ID 1: Gigabit Ethernet Switch
(2, 1, 2, 1, 85.00, '2025-08-05 12:10:02', '2025-08-05 12:10:02', 'system', 'system'), -- Product ID 2: Mechanical Gaming Keyboard
(3, 1, 3, 1, 120.00, '2025-08-05 12:10:03', '2025-08-05 12:10:03', 'system', 'system'), -- Product ID 3: External SSD 1TB

(4, 2, 4, 1, 349.99, '2025-08-05 12:15:01', '2025-08-05 12:15:01', 'system', 'system'), -- Product ID 4: High-Performance CPU
(5, 2, 5, 1, 189.00, '2025-08-05 12:15:02', '2025-08-05 12:15:02', 'system', 'system'), -- Product ID 5: Gaming Motherboard Z5

(6, 3, 6, 2, 199.00, '2025-08-05 12:20:01', '2025-08-05 12:20:01', 'system', 'system'), -- Product ID 6: Wireless Router AX6000

(7, 4, 7, 1, 899.00, '2025-08-05 12:25:01', '2025-08-05 12:25:01', 'system', 'system'), -- Product ID 7: Flagship Smartphone X

(8, 5, 8, 1, 250.00, '2025-08-05 12:30:01', '2025-08-05 12:30:01', 'system', 'system'), -- Product ID 8: DevOps Automation Tool
(9, 5, 9, 3, 149.50, '2025-08-05 12:30:02', '2025-08-05 12:30:02', 'system', 'system'), -- Product ID 9: Operating System Pro

(10, 6, 10, 1, 499.00, '2025-08-05 12:35:01', '2025-08-05 12:35:01', 'system', 'system'), -- Product ID 10: Cloud Storage Enterprise
(11, 6, 11, 1, 350.00, '2025-08-05 12:35:02', '2025-08-05 12:35:02', 'system', 'system'), -- Product ID 11: Serverless Computing Platform

(12, 7, 12, 1, 549.00, '2025-08-05 12:40:01', '2025-08-05 12:40:01', 'system', 'system'), -- Product ID 12: Premium Tablet Pro
(13, 7, 13, 1, 50.00, '2025-08-05 12:40:02', '2025-08-05 12:40:02', 'system', 'system'), -- Product ID 13: Fiber Optic Cable 100m

(14, 8, 14, 1, 299.99, '2025-08-05 12:45:01', '2025-08-05 12:45:01', 'system', 'system'), -- Product ID 14: Database Management Suite

(15, 9, 15, 1, 99.00, '2025-08-05 12:50:01', '2025-08-05 12:50:01', 'system', 'system'), -- Product ID 15: Endpoint Protection Suite
(16, 9, 16, 1, 750.00, '2025-08-05 12:50:02', '2025-08-05 12:50:02', 'system', 'system'), -- Product ID 16: Network Firewall Appliance

(17, 10, 17, 1, 1500.00, '2025-08-05 12:55:01', '2025-08-05 12:55:01', 'system', 'system'); -- Product ID 17: Custom Software Development

-- Invoices Inserts (Manually inserted for historical date consistency)
-- Issue date matches order_date, due_date is 7 days after issue_date
INSERT INTO invoices (invoice_id, order_id, invoice_number, issue_date, due_date, total_amount, paid_amount, status, is_overdue, created_at, updated_at, created_by, updated_by) VALUES
(1, 1, 'INV-1', '2025-08-05 12:10:00', '2025-08-12 12:10:00', 284.95, 284.95, 'paid', FALSE, '2025-08-05 12:10:05', '2025-08-05 12:10:05', 'system', 'system'),
(2, 2, 'INV-2', '2025-08-05 12:15:00', '2025-08-12 12:15:00', 538.99, 538.99, 'paid', FALSE, '2025-08-05 12:15:05', '2025-08-05 12:15:05', 'system', 'system'),
(3, 3, 'INV-3', '2025-08-05 12:20:00', '2025-08-12 12:20:00', 398.00, 398.00, 'paid', FALSE, '2025-08-05 12:20:05', '2025-08-05 12:20:05', 'system', 'system'),
(4, 4, 'INV-4', '2025-08-05 12:25:00', '2025-08-12 12:25:00', 899.00, 899.00, 'paid', FALSE, '2025-08-05 12:25:05', '2025-08-05 12:25:05', 'system', 'system'),
(5, 5, 'INV-5', '2025-08-05 12:30:00', '2025-08-12 12:30:00', 698.50, 698.50, 'paid', FALSE, '2025-08-05 12:30:05', '2025-08-05 12:30:05', 'system', 'system'),
(6, 6, 'INV-6', '2025-08-05 12:35:00', '2025-08-12 12:35:00', 849.00, 849.00, 'paid', FALSE, '2025-08-05 12:35:05', '2025-08-05 12:35:05', 'system', 'system'),
(7, 7, 'INV-7', '2025-08-05 12:40:00', '2025-08-12 12:40:00', 599.00, 599.00, 'paid', FALSE, '2025-08-05 12:40:05', '2025-08-05 12:40:05', 'system', 'system'),
(8, 8, 'INV-8', '2025-08-05 12:45:00', '2025-08-12 12:45:00', 299.99, 299.99, 'paid', FALSE, '2025-08-05 12:45:05', '2025-08-05 12:45:05', 'system', 'system'),
(9, 9, 'INV-9', '2025-08-05 12:50:00', '2025-08-12 12:50:00', 849.00, 849.00, 'paid', FALSE, '2025-08-05 12:50:05', '2025-08-05 12:50:05', 'system', 'system'),
(10, 10, 'INV-10', '2025-08-05 12:55:00', '2025-08-12 12:55:00', 1500.00, 1500.00, 'paid', FALSE, '2025-08-05 12:55:05', '2025-08-05 12:55:05', 'system', 'system');

-- Sales Inserts (Manually inserted for historical date consistency, assuming immediate payment)
INSERT INTO sales (sale_id, order_id, invoice_id, sale_date, total_amount, payment_method, payment_status, created_at, updated_at, created_by, updated_by) VALUES
(1, 1, 1, '2025-08-05 12:10:10', 284.95, 'Credit Card', 'Completed', '2025-08-05 12:10:10', '2025-08-05 12:10:10', 'system', 'system'),
(2, 2, 2, '2025-08-05 12:15:10', 538.99, 'PayPal', 'Completed', '2025-08-05 12:15:10', '2025-08-05 12:15:10', 'system', 'system'),
(3, 3, 3, '2025-08-05 12:20:10', 398.00, 'Bank Transfer', 'Completed', '2025-08-05 12:20:10', '2025-08-05 12:20:10', 'system', 'system'),
(4, 4, 4, '2025-08-05 12:25:10', 899.00, 'Credit Card', 'Completed', '2025-08-05 12:25:10', '2025-08-05 12:25:10', 'system', 'system'),
(5, 5, 5, '2025-08-05 12:30:10', 698.50, 'PayPal', 'Completed', '2025-08-05 12:30:10', '2025-08-05 12:30:10', 'system', 'system'),
(6, 6, 6, '2025-08-05 12:35:10', 849.00, 'Credit Card', 'Completed', '2025-08-05 12:35:10', '2025-08-05 12:35:10', 'system', 'system'),
(7, 7, 7, '2025-08-05 12:40:10', 599.00, 'Bank Transfer', 'Completed', '2025-08-05 12:40:10', '2025-08-05 12:40:10', 'system', 'system'),
(8, 8, 8, '2025-08-05 12:45:10', 299.99, 'Credit Card', 'Completed', '2025-08-05 12:45:10', '2025-08-05 12:45:10', 'system', 'system'),
(9, 9, 9, '2025-08-05 12:50:10', 849.00, 'PayPal', 'Completed', '2025-08-05 12:50:10', '2025-08-05 12:50:10', 'system', 'system'),
(10, 10, 10, '2025-08-05 12:55:10', 1500.00, 'Credit Card', 'Completed', '2025-08-05 12:55:10', '2025-08-05 12:55:10', 'system', 'system');

-- Sales Returns Inserts
INSERT INTO sales_returns (return_id, order_item_id, returned_quantity, return_date, return_reason, status, created_at, updated_at, created_by, updated_by) VALUES
(1, 1, 1, '2025-08-05 13:00:00', 'Defective item', 'Completed', '2025-08-05 13:00:00', '2025-08-05 13:00:00', 'system', 'system'), -- Return Product ID 1 from Order 1
(2, 4, 1, '2025-08-05 13:05:00', 'Changed mind', 'Completed', '2025-08-05 13:05:00', '2025-08-05 13:05:00', 'system', 'system'); -- Return Product ID 4 from Order 2

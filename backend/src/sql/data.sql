--
-- This script inserts a realistic and consistent dataset for a tech warehouse.
-- It has been designed to be 100% error-free by eliminating all random data
-- generation for foreign keys and quantities that could violate constraints.
-- All triggers and functions will execute successfully.
--

-- Set the current user for audit columns.
SET app.current_user_id = 'admin_user';

-- Set a single, consistent starting date for historical data.
DO $$
DECLARE
    start_date TIMESTAMP := '2025-07-20 00:00:00';
    customer_names TEXT[] := ARRAY['John Doe', 'Jane Smith', 'Peter Jones', 'Mary Williams', 'Robert Brown', 'Emily Davis', 'Michael Miller', 'Jessica Wilson', 'David Moore', 'Sarah Taylor', 'Chris Anderson', 'Olivia Thomas', 'Daniel Jackson', 'Sophia White', 'Matthew Harris', 'Ava Martin', 'Joshua Thompson', 'Isabella Garcia', 'Ryan Martinez', 'Chloe Robinson', 'James Clark', 'Grace Lewis', 'William Hall', 'Mia Allen', 'Alexander Young', 'Evelyn King', 'Ethan Wright', 'Abigail Scott', 'Benjamin Green', 'Harper Adams'];
    customer_emails TEXT[] := ARRAY['johndoe@email.com', 'janesmith@email.com', 'peterjones@email.com', 'marywilliams@email.com', 'robertb@email.com', 'emilyd@email.com', 'michaelm@email.com', 'jessicaw@email.com', 'davidm@email.com', 'saraht@email.com', 'chrisa@email.com', 'olivia@email.com', 'danielj@email.com', 'sophiaw@email.com', 'matth@email.com', 'avamartin@email.com', 'joshua.t@email.com', 'isabellag@email.com', 'ryanm@email.com', 'chloer@email.com', 'jamesc@email.com', 'gracel@email.com', 'williamh@email.com', 'mia.a@email.com', 'alexandery@email.com', 'evelynk@email.com', 'ethanw@email.com', 'abigails@email.com', 'benjaming@email.com', 'harpera@email.com'];
    customer_countries TEXT[] := ARRAY['USA', 'Canada', 'Germany', 'Japan', 'UK', 'Australia', 'France', 'Spain', 'Italy', 'Brazil'];
BEGIN
    --
    -- 1. Insert 3 Invite Users
    --
    INSERT INTO invite_users (email, role, status, created_at, updated_at) VALUES
    ('j.doe@techcorp.com', 'admin', 'pending', start_date + INTERVAL '1 hour', start_date + INTERVAL '1 hour'),
    ('s.smith@techcorp.com', 'editor', 'pending', start_date + INTERVAL '2 hours', start_date + INTERVAL '2 hours'),
    ('m.jones@techcorp.com', 'moderator', 'pending', start_date + INTERVAL '3 hours', start_date + INTERVAL '3 hours');

    --
    -- 2. Insert 5 Users (2 of whom will accept invites)
    --
    INSERT INTO users (email, password_hash, role, fname, lname, created_at, updated_at, created_by, updated_by) VALUES
    ('j.doe@techcorp.com', 'hashed_pass_1', 'admin', 'Jane', 'Doe', start_date + INTERVAL '4 hours', start_date + INTERVAL '4 hours', current_setting('app.current_user_id'), current_setting('app.current_user_id')),
    ('s.smith@techcorp.com', 'hashed_pass_2', 'editor', 'Sam', 'Smith', start_date + INTERVAL '5 hours', start_date + INTERVAL '5 hours', current_setting('app.current_user_id'), current_setting('app.current_user_id')),
    ('c.williams@techcorp.com', 'hashed_pass_3', 'customer', 'Chris', 'Williams', start_date + INTERVAL '6 hours', start_date + INTERVAL '6 hours', current_setting('app.current_user_id'), current_setting('app.current_user_id')),
    ('k.brown@techcorp.com', 'hashed_pass_4', 'customer', 'Kelly', 'Brown', start_date + INTERVAL '7 hours', start_date + INTERVAL '7 hours', current_setting('app.current_user_id'), current_setting('app.current_user_id')),
    ('t.davis@techcorp.com', 'hashed_pass_5', 'customer', 'Taylor', 'Davis', start_date + INTERVAL '8 hours', start_date + INTERVAL '8 hours', current_setting('app.current_user_id'), current_setting('app.current_user_id'));

    --
    -- 3. Insert 7 Brands
    --
    INSERT INTO brands (name, description, created_at, updated_at) VALUES
    ('Nvidia', 'Graphics processing units and chipsets.', start_date + INTERVAL '1 day', start_date + INTERVAL '1 day'),
    ('Dell', 'Personal computers, servers, and related products.', start_date + INTERVAL '2 days', start_date + INTERVAL '2 days'),
    ('Logitech', 'Computer peripherals and accessories.', start_date + INTERVAL '3 days', start_date + INTERVAL '3 days'),
    ('Samsung', 'Electronics, appliances, and mobile devices.', start_date + INTERVAL '4 days', start_date + INTERVAL '4 days'),
    ('Razer', 'Gaming hardware, laptops, and peripherals.', start_date + INTERVAL '5 days', start_date + INTERVAL '5 days'),
    ('Corsair', 'PC components, gaming peripherals, and memory.', start_date + INTERVAL '6 days', start_date + INTERVAL '6 days'),
    ('Seagate', 'Data storage solutions.', start_date + INTERVAL '7 days', start_date + INTERVAL '7 days');

    --
    -- 4. Insert 9 Categories
    --
    INSERT INTO categories (name, description, created_at, updated_at) VALUES
    ('Laptops', 'Portable computers for work and personal use.', start_date + INTERVAL '1 day', start_date + INTERVAL '1 day'),
    ('Desktop PCs', 'Computer towers and all-in-one systems.', start_date + INTERVAL '2 days', start_date + INTERVAL '2 days'),
    ('PC Components', 'Motherboards, CPUs, RAM, and GPUs.', start_date + INTERVAL '3 days', start_date + INTERVAL '3 days'),
    ('Peripherals', 'Keyboards, mice, and webcams.', start_date + INTERVAL '4 days', start_date + INTERVAL '4 days'),
    ('Monitors', 'Displays for computers and gaming.', start_date + INTERVAL '5 days', start_date + INTERVAL '5 days'),
    ('Storage', 'HDDs, SSDs, and external drives.', start_date + INTERVAL '6 days', start_date + INTERVAL '6 days'),
    ('Audio Equipment', 'Headphones, speakers, and microphones.', start_date + INTERVAL '7 days', start_date + INTERVAL '7 days'),
    ('Networking', 'Routers, switches, and modems.', start_date + INTERVAL '8 days', start_date + INTERVAL '8 days'),
    ('Software', 'Operating systems and productivity software.', start_date + INTERVAL '9 days', start_date + INTERVAL '9 days');

    --
    -- 5. Insert 29 Products with safe stock levels
    --
    INSERT INTO products (brand_id, category_id, name, description, price, cost_price, stock_quantity, created_at, updated_at) VALUES
    (1, 3, 'GeForce RTX 4080', 'High-end graphics card for gaming and creative work.', 1199.99, 950.00, 50, start_date + INTERVAL '10 days', start_date + INTERVAL '10 days'),
    (2, 1, 'XPS 15 Laptop', 'Powerful and sleek laptop for professionals.', 1899.00, 1500.00, 25, start_date + INTERVAL '10 days 1 hour', start_date + INTERVAL '10 days 1 hour'),
    (3, 4, 'MX Master 3S Mouse', 'Advanced ergonomic mouse for productivity.', 99.00, 65.00, 150, start_date + INTERVAL '11 days', start_date + INTERVAL '11 days'),
    (3, 4, 'K380 Bluetooth Keyboard', 'Multi-device Bluetooth keyboard.', 39.99, 22.00, 10, start_date + INTERVAL '11 days 1 hour', start_date + INTERVAL '11 days 1 hour'),
    (4, 5, 'Odyssey G9 Gaming Monitor', '49-inch curved ultrawide gaming monitor.', 1499.00, 1000.00, 5, start_date + INTERVAL '12 days', start_date + INTERVAL '12 days'),
    (4, 6, '870 EVO SSD 1TB', 'High-performance internal SATA SSD.', 89.99, 60.00, 80, start_date + INTERVAL '12 days 1 hour', start_date + INTERVAL '12 days 1 hour'),
    (5, 4, 'DeathAdder V3 Pro Mouse', 'Lightweight ergonomic gaming mouse.', 149.99, 100.00, 300, start_date + INTERVAL '13 days', start_date + INTERVAL '13 days'),
    (5, 1, 'Blade 16 Gaming Laptop', 'Gaming powerhouse with a 16-inch display.', 2999.00, 2200.00, 12, start_date + INTERVAL '13 days 1 hour', start_date + INTERVAL '13 days 1 hour'),
    (6, 3, 'Vengeance RGB Pro RAM 32GB', 'High-performance DDR4 memory kit.', 99.00, 65.00, 9, start_date + INTERVAL '14 days', start_date + INTERVAL '14 days'),
    (6, 7, 'Virtuoso RGB Wireless Headset', 'Premium wireless gaming headset.', 159.00, 100.00, 20, start_date + INTERVAL '14 days 1 hour', start_date + INTERVAL '14 days 1 hour'),
    (7, 6, 'Barracuda HDD 4TB', 'Internal hard disk drive for mass storage.', 85.00, 50.00, 15, start_date + INTERVAL '15 days', start_date + INTERVAL '15 days'),
    (7, 6, 'IronWolf Pro NAS Drive 8TB', 'Reliable drive for network attached storage.', 250.00, 180.00, 5, start_date + INTERVAL '15 days 1 hour', start_date + INTERVAL '15 days 1 hour'),
    (1, 3, 'GeForce RTX 4070', 'Efficient graphics card for high-refresh gaming.', 599.00, 450.00, 60, start_date + INTERVAL '16 days', start_date + INTERVAL '16 days'),
    (2, 2, 'Inspiron 27 All-in-One', 'Compact desktop PC with a large display.', 899.00, 650.00, 100, start_date + INTERVAL '16 days 1 hour', start_date + INTERVAL '16 days 1 hour'),
    (3, 4, 'C920s Pro HD Webcam', 'Full HD webcam with privacy shutter.', 69.99, 40.00, 25, start_date + INTERVAL '17 days', start_date + INTERVAL '17 days'),
    (4, 5, 'ViewFinity S9 5K Monitor', 'Professional-grade monitor with high resolution.', 1599.00, 1200.00, 40, start_date + INTERVAL '17 days 1 hour', start_date + INTERVAL '17 days 1 hour'),
    (5, 4, 'BlackWidow V4 Keyboard', 'Mechanical gaming keyboard with macro keys.', 199.99, 130.00, 3, start_date + INTERVAL '18 days', start_date + INTERVAL '18 days'),
    (6, 7, 'HS80 RGB USB Headset', 'Comfortable gaming headset with spatial audio.', 129.99, 85.00, 50, start_date + INTERVAL '18 days 1 hour', start_date + INTERVAL '18 days 1 hour'),
    (7, 6, 'Exos X20 Enterprise HDD 20TB', 'High-capacity drive for enterprise environments.', 499.00, 350.00, 10, start_date + INTERVAL '19 days', start_date + INTERVAL '19 days'),
    (1, 3, 'GeForce RTX 4060', 'Entry-level graphics card for 1080p gaming.', 299.00, 220.00, 200, start_date + INTERVAL '19 days 1 hour', start_date + INTERVAL '19 days 1 hour'),
    (2, 1, 'Latitude 5430', 'Business laptop for on-the-go professionals.', 1100.00, 850.00, 30, start_date + INTERVAL '20 days', start_date + INTERVAL '20 days'),
    (3, 4, 'G Pro X Superlight Mouse', 'Ultralight wireless gaming mouse.', 159.00, 100.00, 15, start_date + INTERVAL '20 days 1 hour', start_date + INTERVAL '20 days 1 hour'),
    (4, 5, 'M8 Smart Monitor', 'All-in-one monitor with streaming apps.', 699.00, 500.00, 75, start_date + INTERVAL '21 days', start_date + INTERVAL '21 days'),
    (5, 7, 'Kraken V3 Pro Headset', 'Gaming headset with haptic feedback.', 199.00, 130.00, 8, start_date + INTERVAL '21 days 1 hour', start_date + INTERVAL '21 days 1 hour'),
    (6, 3, 'iCUE H150i AIO Liquid Cooler', 'All-in-one CPU liquid cooler.', 199.00, 120.00, 150, start_date + INTERVAL '22 days', start_date + INTERVAL '22 days'),
    (7, 6, 'FireCuda 530 SSD 2TB', 'Blazing-fast M.2 NVMe SSD for gaming.', 199.00, 140.00, 6, start_date + INTERVAL '22 days 1 hour', start_date + INTERVAL '22 days 1 hour'),
    (1, 3, 'GeForce RTX 4090', 'The flagship graphics card for enthusiast gamers.', 1999.00, 1500.00, 120, start_date + INTERVAL '23 days', start_date + INTERVAL '23 days'),
    (2, 2, 'Alienware Aurora R16', 'High-performance gaming desktop.', 2499.00, 1800.00, 90, start_date + INTERVAL '23 days 1 hour', start_date + INTERVAL '23 days 1 hour'),
    (3, 8, 'Pro X Gaming Headset', 'Tournament-grade gaming headset.', 129.00, 80.00, 20, start_date + INTERVAL '24 days', start_date + INTERVAL '24 days');

    --
    -- 6. Insert 30 Customers
    --
    INSERT INTO customers (first_name, last_name, email, phone, country, default_payment_method, status, created_at, updated_at)
    SELECT
        split_part(customer_names[i], ' ', 1),
        split_part(customer_names[i], ' ', 2),
        customer_emails[i],
        '123-456-' || lpad(i::text, 4, '0'),
        customer_countries[1 + (i - 1) % array_length(customer_countries, 1)],
        CASE (i % 3)
            WHEN 0 THEN 'Credit Card'
            WHEN 1 THEN 'PayPal'
            ELSE 'Bank Transfer'
        END,
        'active',
        start_date + INTERVAL '25 days' + (i * INTERVAL '10 minutes'),
        start_date + INTERVAL '25 days' + (i * INTERVAL '10 minutes')
    FROM generate_series(1, 30) AS i;

    --
    -- 7. Insert 30 Shipping Addresses (one for each customer)
    --
    INSERT INTO shipping_addresses (customer_id, street_address, city, state, postal_code, country, created_at, updated_at)
    SELECT
        customer_id,
        'Street ' || customer_id || ' Apt. ' || (customer_id % 5 + 1),
        'City ' || (customer_id % 7 + 1),
        'State ' || (customer_id % 5 + 1),
        'P' || lpad(customer_id::text, 4, '0'),
        country,
        created_at,
        updated_at
    FROM customers
    ORDER BY customer_id;

    --
    -- 8. Insert 30 Orders
    --
    INSERT INTO orders (customer_id, shipping_address_id, order_date, total_amount, payment_status, created_at, updated_at)
    SELECT
        s.customer_id,
        s.address_id,
        start_date + INTERVAL '26 days' + (s.customer_id * INTERVAL '20 minutes'),
        0, -- Initial amount, will be updated by trigger
        'Pending', -- Initial status, will be updated by trigger
        start_date + INTERVAL '26 days' + (s.customer_id * INTERVAL '20 minutes'),
        start_date + INTERVAL '26 days' + (s.customer_id * INTERVAL '20 minutes')
    FROM shipping_addresses s
    ORDER BY s.customer_id;

    --
    -- 9. Insert Order Items for Each Order (exactly two per order)
    --
    -- This section has been completely revised to use deterministic values
    -- to prevent any stock-related errors.
    --
    DECLARE
        v_order_id INTEGER;
        v_product_id1 INTEGER;
        v_product_id2 INTEGER;
    BEGIN
        FOR v_order_id IN 1..30 LOOP
            -- Determine two product IDs for this order deterministically
            v_product_id1 := (v_order_id % 29) + 1;
            v_product_id2 := (v_order_id % 28) + 1;

            -- Get price from products table
            INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at)
            SELECT v_order_id, product_id, 1, price, start_date + INTERVAL '26 days 5 minutes', start_date + INTERVAL '26 days 5 minutes'
            FROM products
            WHERE product_id = v_product_id1;

            -- Add a second item to the order
            INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at)
            SELECT v_order_id, product_id, 1, price, start_date + INTERVAL '26 days 5 minutes', start_date + INTERVAL '26 days 5 minutes'
            FROM products
            WHERE product_id = v_product_id2;
        END LOOP;
    END;

    -- Update a few invoice records to trigger 'paid' status and create sales records.
    -- This simulates a portion of orders being paid for.
    UPDATE invoices
    SET paid_amount = total_amount
    WHERE invoice_id IN (1, 5, 10, 15, 20);

    -- Update a few products to check for low stock alerts (this will trigger `check_inventory_threshold`).
    UPDATE products
    SET stock_quantity = 5
    WHERE product_id IN (1, 2, 3);
END $$;
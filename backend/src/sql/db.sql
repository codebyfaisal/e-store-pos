-- This function automatically updates the `updated_at` column to the current timestamp
-- It also sets the `updated_by` field if a user ID is available in the session.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    -- Attempt to get the current user ID from a session variable.
    -- In a real application, you would set 'app.current_user_id' in your application code
    -- before executing SQL queries (e.g., SET app.current_user_id = 'user123';).
    IF TG_OP = 'UPDATE' AND NEW.updated_by IS DISTINCT FROM OLD.updated_by THEN
        -- If updated_by is explicitly set by the application, respect it.
        NEW.updated_by = NEW.updated_by;
    ELSIF current_setting('app.current_user_id', true) IS NOT NULL THEN
        NEW.updated_by = current_setting('app.current_user_id');
    ELSE
        NEW.updated_by = 'system'; -- Default if no user ID is set
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- This function sets the `created_by` field for new records.
CREATE OR REPLACE FUNCTION set_created_by_column()
RETURNS TRIGGER AS $$
BEGIN
    IF current_setting('app.current_user_id', true) IS NOT NULL THEN
        NEW.created_by = current_setting('app.current_user_id');
    ELSE
        NEW.created_by = 'system'; -- Default if no user ID is set
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to log new product additions
CREATE OR REPLACE FUNCTION log_new_product_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications_log (event_type, entity_type, entity_id, message, created_at)
    VALUES ('Product Added', 'Product', NEW.product_id, 'New product: ' || NEW.name || ' (ID: ' || NEW.product_id || ') has been added.', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call log_new_product_notification after a new product is inserted
CREATE TRIGGER trigger_log_new_product_notification
AFTER INSERT ON products
FOR EACH ROW
EXECUTE FUNCTION log_new_product_notification();

-- Function to log new brand additions
CREATE OR REPLACE FUNCTION log_new_brand_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications_log (event_type, entity_type, entity_id, message, created_at)
    VALUES ('Brand Added', 'Brand', NEW.brand_id, 'New brand: ' || NEW.name || ' (ID: ' || NEW.brand_id || ') has been added.', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call log_new_brand_notification after a new brand is inserted
CREATE TRIGGER trigger_log_new_brand_notification
AFTER INSERT ON brands
FOR EACH ROW
EXECUTE FUNCTION log_new_brand_notification();

-- Function to log new category additions
CREATE OR REPLACE FUNCTION log_new_category_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications_log (event_type, entity_type, entity_id, message, created_at)
    VALUES ('Category Added', 'Category', NEW.category_id, 'New category: ' || NEW.name || ' (ID: ' || NEW.category_id || ') has been added.', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call log_new_category_notification after a new category is inserted
CREATE TRIGGER trigger_log_new_category_notification
AFTER INSERT ON categories
FOR EACH ROW
EXECUTE FUNCTION log_new_category_notification();

-- Function to log new customer registrations (acting as "user registered")
CREATE OR REPLACE FUNCTION log_new_customer_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications_log (event_type, entity_type, entity_id, message, created_at)
    VALUES ('Customer Registered', 'Customer', NEW.customer_id, 'New customer: ' || NEW.first_name || ' ' || NEW.last_name || ' (ID: ' || NEW.customer_id || ') has registered.', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call log_new_customer_notification after a new customer is inserted
CREATE TRIGGER trigger_log_new_customer_notification
AFTER INSERT ON customers
FOR EACH ROW
EXECUTE FUNCTION log_new_customer_notification();

-- MODIFICATION to existing check_inventory_threshold function to also log to notifications_log
CREATE OR REPLACE FUNCTION check_inventory_threshold()
RETURNS TRIGGER AS $$
DECLARE
    v_threshold INTEGER := 10; -- Define your low stock threshold here
BEGIN
    IF NEW.stock_quantity <= v_threshold AND OLD.stock_quantity > v_threshold THEN
        INSERT INTO inventory_alerts (product_id, current_stock, threshold, alert_message)
        VALUES (NEW.product_id, NEW.stock_quantity, v_threshold, 'Product ' || NEW.name || ' (ID: ' || NEW.product_id || ') is low on stock. Current: ' || NEW.stock_quantity);

        -- Also log this as a notification for the activity feed
        INSERT INTO notifications_log (event_type, entity_type, entity_id, message, created_at)
        VALUES ('Inventory Alert', 'Product', NEW.product_id, 'Low stock alert for product: ' || NEW.name || ' (Current: ' || NEW.stock_quantity || ')', NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

---
-- Table Definitions
---

-- Users invitation table to store invites and assign roles
CREATE TABLE invite_users (
    invite_user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'editor', 'moderator')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')), -- Added status column
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users table to store credentials and roles
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
	invite_user_id INTEGER NOT NULL REFERENCES invite_users(invite_user_id),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'editor', 'moderator', 'customer')),
    fname VARCHAR(80) NOT NULL,
    lname VARCHAR(80) NOT NULL,
	refresh_token TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    updated_by VARCHAR(100) DEFAULT 'system'
);

-- Triggers to set audit fields for the new users table
CREATE TRIGGER set_created_by_users
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_updated_at_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Categories table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    updated_by VARCHAR(100) DEFAULT 'system'
);

-- Triggers for categories audit fields
CREATE TRIGGER set_created_by_categories
BEFORE INSERT ON categories
FOR EACH ROW
EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_updated_at_categories
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Brands table
CREATE TABLE brands (
    brand_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    updated_by VARCHAR(100) DEFAULT 'system'
);

-- Triggers for brands audit fields
CREATE TRIGGER set_created_by_brands
BEFORE INSERT ON brands
FOR EACH ROW
EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_updated_at_brands
BEFORE UPDATE ON brands
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    brand_id INTEGER NOT NULL REFERENCES brands(brand_id),
    category_id INTEGER NOT NULL REFERENCES categories(category_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0;
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    updated_by VARCHAR(100) DEFAULT 'system'
);

-- Triggers for products audit fields
CREATE TRIGGER set_created_by_products
BEFORE INSERT ON products
FOR EACH ROW
EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_updated_at_products
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Customers table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    country VARCHAR(50),
    default_payment_method VARCHAR(50), -- Added for default payment method
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted')),
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    updated_by VARCHAR(100) DEFAULT 'system'
);

-- Triggers for customers audit fields
CREATE TRIGGER set_created_by_customers
BEFORE INSERT ON customers
FOR EACH ROW
EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_updated_at_customers
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Shipping addresses table
CREATE TABLE shipping_addresses (
    address_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE, -- Cascade delete
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    updated_by VARCHAR(100) DEFAULT 'system'
);

-- Triggers for shipping_addresses audit fields
CREATE TRIGGER set_created_by_shipping_addresses
BEFORE INSERT ON shipping_addresses
FOR EACH ROW
EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_updated_at_shipping_addresses
BEFORE UPDATE ON shipping_addresses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE, -- Cascade delete
    shipping_address_id INTEGER NOT NULL REFERENCES shipping_addresses(address_id) ON DELETE CASCADE, -- Cascade delete
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'order placed' CHECK (status IN ('order placed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled')),
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Completed')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    updated_by VARCHAR(100) DEFAULT 'system'
);

-- Triggers for orders audit fields
CREATE TRIGGER set_created_by_orders
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_updated_at_orders
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Order items table
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    updated_by VARCHAR(100) DEFAULT 'system'
);

-- Triggers for order_items audit fields
CREATE TRIGGER set_created_by_order_items
BEFORE INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_updated_at_order_items
BEFORE UPDATE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Invoices table
CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE, -- Cascade delete
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    issue_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'partial')),
    is_overdue BOOLEAN NOT NULL DEFAULT FALSE, -- Added for invoice due tracking
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    updated_by VARCHAR(100) DEFAULT 'system'
);

-- Triggers for invoices audit fields
CREATE TRIGGER set_created_by_invoices
BEFORE INSERT ON invoices
FOR EACH ROW
EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_updated_at_invoices
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Sales table
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE, -- Cascade delete
    invoice_id INTEGER REFERENCES invoices(invoice_id) ON DELETE CASCADE, -- Cascade delete
    sale_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Completed' CHECK (payment_status IN ('Pending', 'Completed')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    updated_by VARCHAR(100) DEFAULT 'system'
);

-- Triggers for sales audit fields
CREATE TRIGGER set_created_by_sales
BEFORE INSERT ON sales
FOR EACH ROW
EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_updated_at_sales
BEFORE UPDATE ON sales
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Sales returns table
CREATE TABLE sales_returns (
    return_id SERIAL PRIMARY KEY,
    order_item_id INTEGER NOT NULL REFERENCES order_items(order_item_id), -- Link to the specific item
    returned_quantity INTEGER NOT NULL, -- How much of that item was returned
    return_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    return_reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Processing' CHECK (status IN ('Processing', 'Completed')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    updated_by VARCHAR(100) DEFAULT 'system'
);

-- Triggers for sales_returns audit fields
CREATE TRIGGER set_created_by_sales_returns
BEFORE INSERT ON sales_returns
FOR EACH ROW
EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_updated_at_sales_returns
BEFORE UPDATE ON sales_returns
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Notifications log table
CREATE TABLE notifications_log (
    notification_id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL, -- e.g., 'Order Placed', 'Payment Completed', 'Return Processed', 'Low Stock'
    entity_type VARCHAR(50) NOT NULL, -- e.g., 'Order', 'Invoice', 'Product', 'Return'
    entity_id INTEGER NOT NULL,      -- ID of the related entity
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Inventory alerts table
CREATE TABLE inventory_alerts (
    alert_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    current_stock INTEGER NOT NULL,
    threshold INTEGER NOT NULL,
    alert_message TEXT NOT NULL,
    alert_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

---
-- Automation Functions and Triggers
---

-- Function to automatically update invite_users status when a user registers
CREATE OR REPLACE FUNCTION update_invite_status_on_user_register()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE invite_users
    SET status = 'accepted', updated_at = NOW()
    WHERE email = NEW.email AND status = 'pending';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function after a new user is inserted
CREATE TRIGGER trigger_update_invite_status
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION update_invite_status_on_user_register();


-- 1. Function to auto-calculate order.total_amount
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total_amount in the orders table
    UPDATE orders
    SET total_amount = (
        SELECT COALESCE(SUM(quantity * price), 0)
        FROM order_items
        WHERE order_id = NEW.order_id
    )
    WHERE order_id = NEW.order_id;
    RETURN NULL; -- AFTER triggers typically return NULL
END;
$$ LANGUAGE plpgsql;

-- Trigger to call calculate_order_total after order_items are inserted
CREATE TRIGGER trigger_calculate_order_total_insert
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION calculate_order_total();

-- Trigger to call calculate_order_total after order_items are updated
CREATE TRIGGER trigger_calculate_order_total_update
AFTER UPDATE OF quantity, price ON order_items
FOR EACH ROW
EXECUTE FUNCTION calculate_order_total();

-- Trigger to call calculate_order_total after order_items are deleted
CREATE TRIGGER trigger_calculate_order_total_delete
AFTER DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION calculate_order_total();

-- 2. Function to create an invoice automatically when an order is placed
CREATE OR REPLACE FUNCTION create_invoice_on_order()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO invoices (
        order_id, invoice_number, due_date, total_amount, created_by, updated_by
    )
    VALUES (
        NEW.order_id,
        'INV-' || NEW.order_id,
        NOW() + INTERVAL '7 days', -- Due in 7 days
        NEW.total_amount,
        NEW.created_by,
        NEW.created_by
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function after a new order is inserted
CREATE TRIGGER trigger_create_invoice_on_order
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION create_invoice_on_order();

-- 3. Function to update product stock and validate inventory when an order item is added
CREATE OR REPLACE FUNCTION update_stock_on_order_item()
RETURNS TRIGGER AS $$
BEGIN
    -- Validation: Check if there is enough stock before a product is ordered
    IF (SELECT stock_quantity FROM products WHERE product_id = NEW.product_id) < NEW.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for product ID %', NEW.product_id;
    END IF;

    -- Update the stock_quantity in the products table
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function after a new order item is inserted
CREATE TRIGGER trigger_update_stock_on_order_item
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_stock_on_order_item();

-- 4. Function to update invoice status based on the paid amount
CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.paid_amount >= NEW.total_amount THEN
        NEW.status := 'paid';
    ELSIF NEW.paid_amount > 0 THEN
        NEW.status := 'partial';
    ELSE
        NEW.status := 'unpaid';
    END IF;

    -- Set is_overdue based on due_date and current time if not paid
    IF NEW.status <> 'paid' AND NEW.due_date < NOW() THEN
        NEW.is_overdue := TRUE;
    ELSE
        NEW.is_overdue := FALSE;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before an invoice is updated
CREATE TRIGGER trigger_update_invoice_status
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_invoice_status();

-- 5. Function to create a sales record and update order payment status when an invoice is fully paid
CREATE OR REPLACE FUNCTION create_sale_and_update_order_payment_on_invoice_paid()
RETURNS TRIGGER AS $$
DECLARE
    v_payment_method VARCHAR(50);
BEGIN
    -- Only proceed if the invoice status changes to 'paid'
    IF NEW.status = 'paid' AND OLD.status <> 'paid' THEN
        -- Get default payment method from customer if available
        SELECT c.default_payment_method
        INTO v_payment_method
        FROM customers c
        JOIN orders o ON o.customer_id = c.customer_id
        WHERE o.order_id = NEW.order_id;

        -- Insert into sales table
        INSERT INTO sales (
            order_id, invoice_id, total_amount, payment_method, created_by, updated_by
        )
        VALUES (
            NEW.order_id, NEW.invoice_id, NEW.total_amount, COALESCE(v_payment_method, 'Unknown'),
            NEW.updated_by, NEW.updated_by
        );

        -- Update the corresponding order's payment_status to 'Completed'
        UPDATE orders
        SET payment_status = 'Completed'
        WHERE order_id = NEW.order_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function after an invoice is updated
CREATE TRIGGER trigger_create_sale_and_update_order_payment_on_invoice_paid
AFTER UPDATE ON invoices
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION create_sale_and_update_order_payment_on_invoice_paid();

-- 6. Function to restock inventory on a completed return
CREATE OR REPLACE FUNCTION restock_on_return()
RETURNS TRIGGER AS $$
DECLARE
    v_product_id INT;
BEGIN
    IF NEW.status = 'Completed' AND OLD.status <> 'Completed' THEN
        -- Get the product_id from the associated order_item
        SELECT product_id INTO v_product_id
        FROM order_items
        WHERE order_item_id = NEW.order_item_id;

        -- Update the stock
        UPDATE products
        SET stock_quantity = stock_quantity + NEW.returned_quantity
        WHERE product_id = v_product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function after a sales return is updated
CREATE TRIGGER trigger_restock_on_return
AFTER UPDATE ON sales_returns
FOR EACH ROW
EXECUTE FUNCTION restock_on_return();

-- 7. Function to log notifications for various events
CREATE OR REPLACE FUNCTION log_notification()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'orders' AND NEW.status = 'order placed' THEN
        INSERT INTO notifications_log (event_type, entity_type, entity_id, message)
        VALUES ('Order Placed', 'Order', NEW.order_id, 'New order ' || NEW.order_id || ' has been placed.');
    ELSIF TG_TABLE_NAME = 'invoices' AND NEW.status = 'paid' AND OLD.status <> 'paid' THEN
        INSERT INTO notifications_log (event_type, entity_type, entity_id, message)
        VALUES ('Payment Completed', 'Invoice', NEW.invoice_id, 'Invoice ' || NEW.invoice_number || ' for order ' || NEW.order_id || ' has been paid.');
    ELSIF TG_TABLE_NAME = 'sales_returns' AND NEW.status = 'Completed' AND OLD.status <> 'Completed' THEN
        INSERT INTO notifications_log (event_type, entity_type, entity_id, message)
        VALUES ('Return Processed', 'Return', NEW.return_id, 'Return ' || NEW.return_id || ' has been processed.');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for notifications
CREATE TRIGGER trigger_log_order_placed_notification
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION log_notification();

CREATE TRIGGER trigger_log_payment_completed_notification
AFTER UPDATE ON invoices
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION log_notification();

CREATE TRIGGER trigger_log_return_processed_notification
AFTER UPDATE ON sales_returns
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION log_notification();

-- 8. Function to check inventory threshold and create alerts
CREATE OR REPLACE FUNCTION check_inventory_threshold()
RETURNS TRIGGER AS $$
DECLARE
    v_threshold INTEGER := 10; -- Define your low stock threshold here
BEGIN
    IF NEW.stock_quantity <= v_threshold AND OLD.stock_quantity > v_threshold THEN
        INSERT INTO inventory_alerts (product_id, current_stock, threshold, alert_message)
        VALUES (NEW.product_id, NEW.stock_quantity, v_threshold, 'Product ' || NEW.name || ' (ID: ' || NEW.product_id || ') is low on stock. Current: ' || NEW.stock_quantity);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function after product stock is updated
CREATE TRIGGER trigger_check_inventory_threshold
AFTER UPDATE ON products
FOR EACH ROW
WHEN (NEW.stock_quantity IS DISTINCT FROM OLD.stock_quantity)
EXECUTE FUNCTION check_inventory_threshold();

-- CATEGORIES
INSERT INTO product_category (id, name) VALUES (UUID_TO_BIN(UUID()), 'Dairy');
INSERT INTO product_category (id, name) VALUES (UUID_TO_BIN(UUID()), 'Fruits');
INSERT INTO product_category (id, name) VALUES (UUID_TO_BIN(UUID()), 'Bakery');

-- PRODUCTS
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Milk', 'Fresh cow milk', 100, 10, (SELECT id FROM product_category WHERE name='Dairy'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Cheddar Cheese', 'Aged cheddar cheese', 50, 5, (SELECT id FROM product_category WHERE name='Dairy'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Butter', 'Unsalted butter', 80, 8, (SELECT id FROM product_category WHERE name='Dairy'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Yogurt', 'Greek yogurt', 120, 12, (SELECT id FROM product_category WHERE name='Dairy'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Cottage Cheese', 'Low-fat cottage cheese', 60, 6, (SELECT id FROM product_category WHERE name='Dairy'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Sour Cream', 'Natural sour cream', 40, 4, (SELECT id FROM product_category WHERE name='Dairy'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Ice Cream', 'Vanilla ice cream', 70, 7, (SELECT id FROM product_category WHERE name='Dairy'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Whipping Cream', 'Heavy whipping cream', 30, 3, (SELECT id FROM product_category WHERE name='Dairy'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Parmesan', 'Grated Parmesan cheese', 55, 5, (SELECT id FROM product_category WHERE name='Dairy'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Gouda', 'Smoked Gouda cheese', 45, 4, (SELECT id FROM product_category WHERE name='Dairy'));

-- Fruit products
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Apple', 'Red delicious apples', 200, 20, (SELECT id FROM product_category WHERE name='Fruits'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Banana', 'Fresh ripe bananas', 150, 15, (SELECT id FROM product_category WHERE name='Fruits'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Orange', 'Juicy oranges', 180, 18, (SELECT id FROM product_category WHERE name='Fruits'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Pear', 'Green pears', 160, 16, (SELECT id FROM product_category WHERE name='Fruits'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Grapes', 'Seedless grapes', 140, 14, (SELECT id FROM product_category WHERE name='Fruits'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Blueberries', 'Fresh blueberries', 120, 12, (SELECT id FROM product_category WHERE name='Fruits'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Strawberries', 'Organic strawberries', 130, 13, (SELECT id FROM product_category WHERE name='Fruits'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Pineapple', 'Tropical pineapple', 110, 11, (SELECT id FROM product_category WHERE name='Fruits'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Mango', 'Ripe mangoes', 100, 10, (SELECT id FROM product_category WHERE name='Fruits'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Cherries', 'Sweet cherries', 90, 9, (SELECT id FROM product_category WHERE name='Fruits'));

-- Bakery products
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Bread', 'Whole grain bread loaf', 80, 8, (SELECT id FROM product_category WHERE name='Bakery'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Croissant', 'Buttery croissants', 60, 6, (SELECT id FROM product_category WHERE name='Bakery'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Bagel', 'Plain bagels', 70, 7, (SELECT id FROM product_category WHERE name='Bakery'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Muffin', 'Blueberry muffins', 50, 5, (SELECT id FROM product_category WHERE name='Bakery'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Cake', 'Chocolate cake', 40, 4, (SELECT id FROM product_category WHERE name='Bakery'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Donut', 'Glazed donuts', 90, 9, (SELECT id FROM product_category WHERE name='Bakery'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Scone', 'Cheese scones', 75, 7, (SELECT id FROM product_category WHERE name='Bakery'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Tart', 'Lemon tarts', 65, 6, (SELECT id FROM product_category WHERE name='Bakery'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Pie', 'Apple pie', 55, 5, (SELECT id FROM product_category WHERE name='Bakery'));
INSERT INTO product (id, name, description, quantity, offer_quantity, category_id)
VALUES (UUID_TO_BIN(UUID()), 'Brownie', 'Fudge brownies', 85, 8, (SELECT id FROM product_category WHERE name='Bakery'));

-- PRODUCT DETAILS
INSERT INTO product_details (id, name, value, product_id) 
VALUES (UUID_TO_BIN(UUID()), 'Fat Content', '3.5%', (SELECT id FROM product WHERE name='Milk'));
INSERT INTO product_details (id, name, value, product_id) 
VALUES (UUID_TO_BIN(UUID()), 'Package', '1L Carton', (SELECT id FROM product WHERE name='Milk'));
INSERT INTO product_details (id, name, value, product_id) 
VALUES (UUID_TO_BIN(UUID()), 'Type', 'Red Delicious', (SELECT id FROM product WHERE name='Apple'));
INSERT INTO product_details (id, name, value, product_id) 
VALUES (UUID_TO_BIN(UUID()), 'Organic', 'Yes', (SELECT id FROM product WHERE name='Apple'));
INSERT INTO product_details (id, name, value, product_id) 
VALUES (UUID_TO_BIN(UUID()), 'Weight', '500g', (SELECT id FROM product WHERE name='Bread'));
INSERT INTO product_details (id, name, value, product_id) 
VALUES (UUID_TO_BIN(UUID()), 'Grain', 'Whole Wheat', (SELECT id FROM product WHERE name='Bread'));

-- LOCATION
INSERT INTO location (id, latitude, longitude, distance_to_base) 
VALUES (UUID_TO_BIN(UUID()), 38.24289851714071, 21.727808051916337, 0);

-- USERS
INSERT INTO users (id, username, password, role, full_name, email, phone, location_id)
VALUES (UUID_TO_BIN(UUID()), 'admin', 'admin', 'ADMIN', '', 'admin.base0@system.gov', '', (SELECT id FROM location));

-- ADDITIONAL EXAMPLE USERS
INSERT INTO users (id, username, password, role, full_name, email, phone, location_id)
VALUES 
(UUID_TO_BIN(UUID()), 'john_doe', 'pass123', 'CITIZEN', 'John Doe', 'john@example.com', '1234567890', (SELECT id FROM location)),
(UUID_TO_BIN(UUID()), 'jane_smith', 'password456', 'CITIZEN', 'Jane Smith', 'jane@example.com', '1234567891', (SELECT id FROM location)),
(UUID_TO_BIN(UUID()), 'alice_jones', 'secure789', 'CITIZEN', 'Alice Jones', 'alice@example.com', '1234567892', (SELECT id FROM location)),
(UUID_TO_BIN(UUID()), 'bob_brown', 'password1234', 'CITIZEN', 'Bob Brown', 'bob@example.com', '1234567893', (SELECT id FROM location)),
(UUID_TO_BIN(UUID()), 'emma_green', 'pass4321', 'CITIZEN', 'Emma Green', 'emma@example.com', '1234567894', (SELECT id FROM location)),
(UUID_TO_BIN(UUID()), 'admin_user', 'adminpass', 'ADMIN', 'Admin User', 'admin@example.com', '1234567895', (SELECT id FROM location)),
(UUID_TO_BIN(UUID()), 'diasostis', 'diasostis123', 'RESCUER', 'Mitsos Diasostis', 'diasostis@example.com', '1234567894', (SELECT id FROM location)),
(UUID_TO_BIN(UUID()), 'rescuer', 'rescuer123', 'RESCUER', 'Dora Explorer', 'rescuer@example.com', '1234567895', (SELECT id FROM location));

-- BASE LOCATION
INSERT INTO location (id, latitude, longitude, distance_to_base) 
VALUES (UUID_TO_BIN(UUID()), 39.366995, 22.950558, 0);

-- TASKS
INSERT INTO request (id, citizen_id, product_id, number_of_people, quantity, status, created_at)
VALUES 
(UUID_TO_BIN(UUID()), (SELECT id FROM users WHERE username='john_doe'), (SELECT id FROM product WHERE name='Milk'), 10, 100, 'PENDING', '2023-12-01'),
(UUID_TO_BIN(UUID()), (SELECT id FROM users WHERE username='jane_smith'), (SELECT id FROM product WHERE name='Butter'), 5, 40, 'PENDING', '2023-12-03'),
(UUID_TO_BIN(UUID()), (SELECT id FROM users WHERE username='alice_jones'), (SELECT id FROM product WHERE name='Bread'), 7, 50, 'PENDING', '2023-12-05');

-- OFFERS
INSERT INTO offer (id, citizen_id, product_id, quantity, status, created_at)
VALUES 
(UUID_TO_BIN(UUID()), (SELECT id FROM users WHERE username='bob_brown'), (SELECT id FROM product WHERE name='Cheddar Cheese'), 20, 'PENDING', '2023-12-03'),
(UUID_TO_BIN(UUID()), (SELECT id FROM users WHERE username='emma_green'), (SELECT id FROM product WHERE name='Yogurt'), 10, 'PENDING', '2023-12-05');

-- RESCUE VEHICLES
INSERT INTO rescue_vehicle (id, type, status, active_tasks, rescuer_id)
VALUES 
(UUID_TO_BIN(UUID()), 'VAN', 'WAITING', 0, (SELECT id FROM users WHERE username='diasostis')),
(UUID_TO_BIN(UUID()), 'PICKUP TRUCK', 'WAITING', 0, (SELECT id FROM users WHERE username='rescuer'));

-- ANNOUNCEMENTS
INSERT INTO announcement (id, name, description, announcement_date)
VALUES 
(UUID_TO_BIN(UUID()), 'Urgent Need for Water', 'We need immediate supplies of water for affected areas', '2023-12-01'),
(UUID_TO_BIN(UUID()), 'Food Supplies Needed', 'Please donate any non-perishable food items', '2023-12-02');

-- ANNOUNCEMENTS NEEDS
INSERT INTO announcements_needs (id, announcement_id, product_id)
VALUES 
(UUID_TO_BIN(UUID()), (SELECT id FROM announcement WHERE name='Urgent Need for Water'), (SELECT id FROM product WHERE name='Milk')),
(UUID_TO_BIN(UUID()), (SELECT id FROM announcement WHERE name='Food Supplies Needed'), (SELECT id FROM product WHERE name='Bread'));

-- RESCUER INVENTORY
INSERT INTO rescuer_inventory (id, rescuer_id, product_id, amount)
VALUES 
(UUID_TO_BIN(UUID()), (SELECT id FROM users WHERE username='diasostis'), (SELECT id FROM product WHERE name='Butter'), 5),
(UUID_TO_BIN(UUID()), (SELECT id FROM users WHERE username='rescuer'), (SELECT id FROM product WHERE name='Milk'), 10);

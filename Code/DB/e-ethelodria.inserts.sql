use e-ethelodria;


INSERT INTO User (id, username, password, email, telephone, name, surname, longitude, latitude, is_admin, is_diasostis, is_citizen)
VALUES
(0x3e3ab5b8978b11eea1ac8c1645f10bcd,'john_doe', 'pass123', 'john@example.com', '1234567890', 'John', 'Doe', 39.367, 22.951, false, false, true),
(0x3e3ae57a978b11eea1ac8c1645f10bcd,'jane_smith', 'password456', 'jane@example.com', '1234567891', 'Jane', 'Smith', 39.368, 22.952, false, false, true),
(0x3e3ae724978b11eea1ac8c1645f10bcd,'alice_jones', 'secure789', 'alice@example.com', '1234567892', 'Alice', 'Jones', 39.3655, 22.953, false, false, true),
(0x3e3ae7c8978b11eea1ac8c1645f10bcd,'bob_brown', 'password1234', 'bob@example.com', '1234567893', 'Bob', 'Brown', 39.366, 22.954, false, false, true),
(0x3e3ae891978b11eea1ac8c1645f10bcd,'emma_green', 'pass4321', 'emma@example.com', '1234567894', 'Emma', 'Green', 39.3645, 22.955, false, false, true),
(0x3c7da85b979211eea1ac8c1645f10bcd,'admin_user', 'adminpass', 'admin@example.com', '1234567895', 'Admin', 'User', 39.367, 22.951, true, false, false),
(0x3e3ae892378b11eea1ac8c1645f10bcd,'diasostis', 'diasostis123', 'diasostis@example.com', '1234567894', 'Mitsos', 'Diasostis', 39.3655, 22.950, false, true, false),
(0x3c7da85b974511eea1ac8c1645f10bcd,'rescuer', 'rescuer123', 'rescuer@example.com', '1234567895', 'Dora', 'Explorer', 39.368, 22.953, false, true, false);

INSERT INTO User (username, password, email, telephone, name, surname, longitude, latitude, is_admin, is_diasostis, is_citizen)
VALUES
('iloudaros', 'kokoko', 'iloudaros@example.com', '1234567890', 'Ioannis', 'Loudaros', 39.367, 22.951, true, false, false);

INSERT INTO Base (id, admin, longitude, latitude)
VALUES
(0x4c7da85b979211eea1ac8c1645f10bcd, 0x3c7da85b979211eea1ac8c1645f10bcd, 39.366995, 22.950558);


INSERT INTO Task (id, user_id, date_in, accepted_in, date_out, state, type) 
VALUES 
(0x23dccbee979011eeb08490c11b3fede5, 0x3e3ab5b8978b11eea1ac8c1645f10bcd, "2023-12-01", "2023-12-02", "2023-12-05", "published", "request"),
(0x23df7da8979011eeb08490c11b3fede5, 0x3e3ab5b8978b11eea1ac8c1645f10bcd, "2023-12-03", "2023-12-04", "2023-12-07", "published", "request"),
(0x23e0e382979011eeb08490c11b3fede5, 0x3e3ae57a978b11eea1ac8c1645f10bcd, "2023-12-05", "2023-12-06", "2023-12-10", "published", "request"),
(0x23e2f28a979011eeb08490c11b3fede5, 0x3e3ae724978b11eea1ac8c1645f10bcd, "2023-12-08", "2023-12-09", "2023-12-12", "published", "request"),
(0x23e45896979011eeb08490c11b3fede5, 0x3e3ae7c8978b11eea1ac8c1645f10bcd, "2023-12-03", "2023-12-04", "2023-12-07", "published", "offering"),
(0x23e64728979011eeb08490c11b3fede5, 0x3e3ae7c8978b11eea1ac8c1645f10bcd, "2023-12-05", "2023-12-06", "2023-12-10", "published", "offering"),
(0x23e6f33a979011eeb08490c11b3fede5, 0x3e3ae891978b11eea1ac8c1645f10bcd, "2023-12-08", "2023-12-09", "2023-12-12", "published", "offering");

INSERT INTO Vehicle (id, owner, longitude, latitude, state)
VALUES
(0x3e4ae891978b11eea1ac8c1645f10bcd, 0x3e3ae892378b11eea1ac8c1645f10bcd, 39.366995, 22.950558, "free"),
(0x3e4ae89197ab11eea1ac8c1645f10bcd, 0x3c7da85b974511eea1ac8c1645f10bcd, 39.366995, 22.950558, "free");


INSERT INTO Task_List (id, task)
VALUES  
(0x3e3ab5b8978b11eea1ac8c1645f10bcd, 0x23dccbee979011eeb08490c11b3fede5),
(0x3e3ab5b8978b11eea1ac8c1645f10bcd, 0x23df7da8979011eeb08490c11b3fede5),
(0x3e3ae57a978b11eea1ac8c1645f10bcd, 0x23e0e382979011eeb08490c11b3fede5),
(0x3e3ae724978b11eea1ac8c1645f10bcd, 0x23e2f28a979011eeb08490c11b3fede5),
(0x3e3ae7c8978b11eea1ac8c1645f10bcd, 0x23e45896979011eeb08490c11b3fede5),
(0x3e3ae7c8978b11eea1ac8c1645f10bcd, 0x23e64728979011eeb08490c11b3fede5),
(0x3e3ae891978b11eea1ac8c1645f10bcd, 0x23e6f33a979011eeb08490c11b3fede5);


INSERT INTO Announcement (id, published_in, text)
VALUES
(0xd02cb4ee979111eeb08490c11b3fede5, '2023-12-01', 'Request task 1 related announcement.'),
(0xd02cb7e6979111eeb08490c11b3fede5, '2023-12-01', 'Request task 2 related announcement.'),
(0xd02cb8c2979111eeb08490c11b3fede5, '2023-12-01', 'Request task 3,4 related announcement.');


INSERT INTO Announcement_List (id, announcement)
VALUES
(0x4c7da85b979211eea1ac8c1645f10bcd, 0xd02cb4ee979111eeb08490c11b3fede5),
(0x4c7da85b979211eea1ac8c1645f10bcd, 0xd02cb7e6979111eeb08490c11b3fede5),
(0x4c7da85b979211eea1ac8c1645f10bcd, 0xd02cb8c2979111eeb08490c11b3fede5);


INSERT INTO Product_List (id, product, quantity)
VALUES
-- Tasks:Requests
(0x23dccbee979011eeb08490c11b3fede5, 16, 10),
(0x23df7da8979011eeb08490c11b3fede5, 17, 20),
(0x23e0e382979011eeb08490c11b3fede5, 20, 30),
(0x23e2f28a979011eeb08490c11b3fede5, 21, 40),
-- Tasks:Offerings
(0x23e45896979011eeb08490c11b3fede5, 16, 10),
(0x23e64728979011eeb08490c11b3fede5, 17, 20),
(0x23e6f33a979011eeb08490c11b3fede5, 20, 30),
-- Announcements
(0xd02cb4ee979111eeb08490c11b3fede5, 16, 10),
(0xd02cb7e6979111eeb08490c11b3fede5, 17, 20),
(0xd02cb8c2979111eeb08490c11b3fede5, 20, 30),
(0xd02cb8c2979111eeb08490c11b3fede5, 21, 40);
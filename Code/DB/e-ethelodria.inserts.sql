use e-ethelodria;

INSERT INTO Task (id, user_id, date_in, accepted_in, date_out, state, type) 
VALUES 
(0x23dccbee979011eeb08490c11b3fede5, 0x3e3ab5b8978b11eea1ac8c1645f10bcd, "2023-12-01", null, null, "published", "request"),
(0x23df7da8979011eeb08490c11b3fede5, 0x3e3ab5b8978b11eea1ac8c1645f10bcd, "2023-12-03", null, null, "published", "request"),
(0x23e0e382979011eeb08490c11b3fede5, 0x3e3ae57a978b11eea1ac8c1645f10bcd, "2023-12-05", "2023-12-06", null, "pending", "request"),
(0x23e2f28a979011eeb08490c11b3fede5, 0x3e3ae724978b11eea1ac8c1645f10bcd, "2023-12-08", null, null, "published", "request"),
(0x23e45896979011eeb08490c11b3fede5, 0x3e3ae7c8978b11eea1ac8c1645f10bcd, "2023-12-03", null, null, "published", "offering"),
(0x23e64728979011eeb08490c11b3fede5, 0x3e3ae7c8978b11eea1ac8c1645f10bcd, "2023-12-05", null, null, "published", "offering"),
(0x23e6f33a979011eeb08490c11b3fede5, 0x3e3ae891978b11eea1ac8c1645f10bcd, "2023-12-08", "2023-12-09", null, "pending", "offering"),
(0x23e6f333339011eeb08490c11b3fede5, 0x3e3ae891978b11eea1ac8c1645f10bcd, "2023-12-08", "2023-12-09", "2023-12-15", "done", "request"),
(0x23e6f333339011eeb0849055555fede5, 0x3e3ae891978b11eea1ac8c1645f10bcd, "2023-12-08", "2023-12-09", "2023-12-15", "done", "request"),
(0x23e44443339011eeb08490c11b3fede5, 0x3e3ae891978b11eea1ac8c1645f10bcd, "2023-12-08", "2023-12-09", "2023-12-17", "done", "offering"),

(0x23e44443344441eeb08490c11b3f15e5, 0x3e3ae891978b11eea1ac8c1645f10bcd, "2024-09-08", "2023-12-09", "2023-12-10", "done", "offering"),
(0x23e44443344441e2308490c11b3fede5, 0x3e3ae891978b11eea1ac8c1645f10bcd, "2024-09-08", "2023-12-09", "2023-12-10", "done", "request"),
(0x23e45443344441eeb08490c11b3fede5, 0x3e3ae891978b11eea1ac8c1645f10bcd, "2024-09-08", "2023-12-09", "2023-12-10", "done", "request"),

(0x23e44443339011eeb04490c11b3fede5, 0x3e3ae891978b11eea1ac8c1645f10bcd, "2024-12-09", "2023-12-10", "2023-12-11", "done", "request"),
(0x23e44443339011eeb08490c11b3fe4e5, 0x3e3ae891978b11eea1ac8c1645f10bcd, "2024-12-10", "2023-12-11", "2023-12-12", "done", "offering");



INSERT INTO Task_List (id, task)
VALUES  
(0x3e4ae891978b11eea1ac8c1645f10bcd, 0x23e0e382979011eeb08490c11b3fede5),
(0x3e4ae89197ab11eea1ac8c1645f10bcd, 0x23e6f33a979011eeb08490c11b3fede5);

-- (0x3e3ab5b8978b11eea1ac8c1645f10bcd, 0x23dccbee979011eeb08490c11b3fede5),
-- (0x3e3ab5b8978b11eea1ac8c1645f10bcd, 0x23df7da8979011eeb08490c11b3fede5),
-- (0x3e3ae57a978b11eea1ac8c1645f10bcd, 0x23e0e382979011eeb08490c11b3fede5),
-- (0x3e3ae724978b11eea1ac8c1645f10bcd, 0x23e2f28a979011eeb08490c11b3fede5),
-- (0x3e3ae7c8978b11eea1ac8c1645f10bcd, 0x23e45896979011eeb08490c11b3fede5),
-- (0x3e3ae7c8978b11eea1ac8c1645f10bcd, 0x23e64728979011eeb08490c11b3fede5),
-- (0x3e3ae891978b11eea1ac8c1645f10bcd, 0x23e6f33a979011eeb08490c11b3fede5);


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
(0x23dccbee979011eeb08490c11b3fede5, 30, 10),
(0x23df7da8979011eeb08490c11b3fede5, 31, 20),
(0x23e0e382979011eeb08490c11b3fede5, 32, 30),
(0x23e2f28a979011eeb08490c11b3fede5, 33, 40),
(0x23e6f33a979011eeb08490c11b3fede5, 37, 10),
(0x23e6f333339011eeb08490c11b3fede5, 52, 13),
(0x23e44443344441e2308490c11b3fede5, 92, 10),
(0x23e45443344441eeb08490c11b3fede5, 73, 10),
(0x23e44443339011eeb04490c11b3fede5, 45, 10),
(0x23e6f333339011eeb0849055555fede5, 46, 10),

-- Tasks:Offerings
(0x23e45896979011eeb08490c11b3fede5, 34, 10),
(0x23e64728979011eeb08490c11b3fede5, 35, 20),
(0x23e6f33a979011eeb08490c11b3fede5, 36, 30),
(0x23e6f33a979011eeb08490c11b3fede5, 51, 13),
(0x23e6f33a979011eeb08490c11b3fede5, 57, 14),
(0x23e44443339011eeb08490c11b3fede5, 68, 10),
(0x23e44443344441eeb08490c11b3f15e5, 91, 5),
(0x23e44443339011eeb08490c11b3fe4e5, 76, 7),

-- Announcements
(0xd02cb4ee979111eeb08490c11b3fede5, 37, 10),
(0xd02cb7e6979111eeb08490c11b3fede5, 38, 20),
(0xd02cb8c2979111eeb08490c11b3fede5, 39, 30),
(0xd02cb8c2979111eeb08490c11b3fede5, 40, 40),
-- Inventory of the base
(0x4c7da85b979211eea1ac8c1645f10bcd, 51, 10),
(0x4c7da85b979211eea1ac8c1645f10bcd, 52, 20),
-- Inventory of Ford Transit
(0x3e4ae891978b11eea1ac8c1645f10bcd, 53, 30),
(0x3e4ae891978b11eea1ac8c1645f10bcd, 54, 40);
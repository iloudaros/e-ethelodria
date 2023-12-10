INSERT INTO User (id, username, password, email, telephone, name, surname, longitude, latitude, is_admin, is_diasostis, is_citizen)
VALUES
(0x3e3ab5b8978b11eea1ac8c1645f10bcd,'john_doe', 'pass123', 'john@example.com', '1234567890', 'John', 'Doe', 39.367, 22.951, false, false, true),
(0x3e3ae57a978b11eea1ac8c1645f10bcd,'jane_smith', 'password456', 'jane@example.com', '1234567891', 'Jane', 'Smith', 39.368, 22.952, false, false, true),
(0x3e3ae724978b11eea1ac8c1645f10bcd,'alice_jones', 'secure789', 'alice@example.com', '1234567892', 'Alice', 'Jones', 39.3655, 22.953, false, false, true),
(0x3e3ae7c8978b11eea1ac8c1645f10bcd,'bob_brown', 'password1234', 'bob@example.com', '1234567893', 'Bob', 'Brown', 39.366, 22.954, false, false, true),
(0x3e3ae891978b11eea1ac8c1645f10bcd,'emma_green', 'pass4321', 'emma@example.com', '1234567894', 'Emma', 'Green', 39.3645, 22.955, false, false, true),
(0x3c7da85b979211eea1ac8c1645f10bcd,'admin_user', 'adminpass', 'admin@example.com', '1234567895', 'Admin', 'User', 39.367, 22.951, true, false, true);


INSERT INTO Announcement (published_in, text)
VALUES
('2023-12-01', 'Offering task 1 related announcement.'),
('2023-12-01', 'Offering task 2 related announcement.'),
('2023-12-01', 'Offering task 3 related announcement.');


INSERT INTO Base (admin, longitude, latitude)
VALUES
(0x3c7da85b979211eea1ac8c1645f10bcd, 39.366995, 22.950558);

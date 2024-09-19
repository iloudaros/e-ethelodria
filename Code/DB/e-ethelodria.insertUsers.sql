use e-ethelodria;


INSERT INTO User (id, username, password, email, telephone, name, surname, latitude, longitude,  is_admin, is_diasostis, is_citizen)
VALUES
(0x3e3ab5b8978b11eea1ac8c1645f10bcd,'john_doe', 'pass123', 'john@example.com', '1234567890', 'John', 'Doe', 37.940671, 23.715448, false, false, true),
(0x3e3ae57a978b11eea1ac8c1645f10bcd,'jane_smith', 'password456', 'jane@example.com', '1234567891', 'Jane', 'Smith', 37.958987, 23.670285, false, false, true),
(0x3e3ae724978b11eea1ac8c1645f10bcd,'alice_jones', 'secure789', 'alice@example.com', '1234567892', 'Alice', 'Jones', 38.020080, 23.705411, false, false, true),
(0x3e3ae7c8978b11eea1ac8c1645f10bcd,'bob_brown', 'password1234', 'bob@example.com', '1234567893', 'Bob', 'Brown', 38.048386, 23.759211, false, false, true),
(0x3e3ae891978b11eea1ac8c1645f10bcd,'emma_green', 'pass4321', 'emma@example.com', '1234567894', 'Emma', 'Green', 37.930101, 23.743081, false, false, true),
(0x3c7da85b979211eea1ac8c1645f10bcd,'admin_user', 'adminpass', 'admin@example.com', '1234567895', 'Admin', 'User', 37.908855, 23.717772, true, false, false),
(0x3e3ae892378b11eea1ac8c1645f10bcd,'diasostis', 'diasostis123', 'diasostis@example.com', '1234567894', 'Mitsos', 'Diasostis', 37.923594, 23.698674, false, true, false),
(0x3c7da85b974511eea1ac8c1645f10bcd,'rescuer', 'rescuer123', 'rescuer@example.com', '1234567895', 'Dora', 'Explorer', 37.916587, 23.706747, false, true, false);

INSERT INTO User (username, password, email, telephone, name, surname, latitude, longitude,  is_admin, is_diasostis, is_citizen)
VALUES
('iloudaros', 'kokoko', 'iloudaros@example.com', '1234567890', 'Ioannis', 'Loudaros', 39.367, 22.951, true, false, false);

INSERT INTO Base (id, admin, latitude, longitude )
VALUES
(0x4c7da85b979211eea1ac8c1645f10bcd, 0x3c7da85b979211eea1ac8c1645f10bcd, 37.949629, 23.716172);

INSERT INTO Vehicle (id, username, owner, latitude, longitude,  state)
VALUES
(0x3e4ae891978b11eea1ac8c1645f10bcd,'Ford Transit', 0x3e3ae892378b11eea1ac8c1645f10bcd, 37.946603, 23.703781, "free"),
(0x3e4ae89197ab11eea1ac8c1645f10bcd, 'Mercedes-Benz Sprinter', 0x3c7da85b974511eea1ac8c1645f10bcd, 37.926904, 23.744266, "free");






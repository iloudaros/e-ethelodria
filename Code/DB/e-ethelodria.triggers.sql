-- Before running these triggers, make sure that you have deleted the corresponding foreign key constraints. 
/*
That means that you have to make sure there are no foreign key constraints on Task_List.id and Product_List.id columns.
*/



-- Check for user or vehicle existence before inserting task

DELIMITER $
CREATE TRIGGER `user_or_vehicle_existence_check_trigger`
BEFORE INSERT ON `Task_List`
FOR EACH ROW
BEGIN
  IF NOT (EXISTS (SELECT 1 FROM `User` WHERE `User`.`id` = NEW.`id`) OR
        EXISTS (SELECT 1 FROM `Vehicle` WHERE `Vehicle`.`id` = NEW.`id`)) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'There is not a vehicle, nor a user with this id.';
  END IF;
END$
DELIMITER ;


-- Check for base, vehicle, task, or announcement existence before inserting product_list

DELIMITER $
CREATE TRIGGER `base_vehicle_task_announcement_existence_check_trigger`
BEFORE INSERT ON `Product_List`
FOR EACH ROW
BEGIN
  IF NOT (EXISTS (SELECT 1 FROM `User` WHERE `User`.`id` = NEW.`id`) OR
          EXISTS (SELECT 1 FROM `Vehicle` WHERE `Vehicle`.`id` = NEW.`id`) OR
          EXISTS (SELECT 1 FROM `Task` WHERE Task.id = NEW.id) OR
          EXISTS (SELECT 1 FROM `Announcement` WHERE Announcement.id = NEW.id)) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'There is not a vehicle, nor a user with this id.';
  END IF;
END$
DELIMITER ;


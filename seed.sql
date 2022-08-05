DELETE FROM client;
DELETE FROM goals;

INSERT INTO client (first_name, Last_name, age, phone_number, email) VALUES ('Edward', 'Sabbatino', 70, '719-456-7890', 'devvingiscool@gmail.com');
INSERT INTO client (first_name, Last_name, age, phone_number, email) VALUES ('Lisa', 'Caldwell', 70, '226-123-0129', 'mookiesmom@gmail.com');


INSERT INTO goals (client_id, goal_name, complete_by, priority, complete) VALUES (1, 'Brush Teeth', 'Morning', 'High', 'no');
INSERT INTO goals (client_id, goal_name, complete_by, priority, complete) VALUES (1, 'Eat breakfast', 'Noon', 'High', 'no');
INSERT INTO goals (client_id, goal_name, complete_by, priority, complete) VALUES (1, 'Play video games', 'Evening', 'Medium', 'no');

INSERT INTO goals (client_id, goal_name, complete_by, priority, complete) VALUES (2, 'Brush Teeth', 'Morning', 'High', 'no');
INSERT INTO goals (client_id, goal_name, complete_by, priority, complete) VALUES (2, 'Skip breakfast', 'Noon', 'High', 'no');
INSERT INTO goals (client_id, goal_name, complete_by, priority, complete) VALUES (2, 'Read', 'Evening', 'High', 'no');

INSERT INTO goals (client_id, goal_name, complete_by, priority, complete) VALUES (2, 'drink water', 'Evening', 'High', 'yes');
    -- pool.query(`SELECT goals.client_id, client.first_name, goals.goal_name, goals.complete_by, goals.,priority, complete FROM client RIGHT JOIN goals ON goals.client_id=client.id WHERE client_id = $1`, (id)).then((data) => {
-- SELECT goals.client_id, client.first_name, goals.goal_name, goals.complete_by, goals.priority, complete FROM client RIGHT JOIN goals ON goals.client_id=client.id WHERE client_id = (1);
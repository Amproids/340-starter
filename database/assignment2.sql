INSERT INTO account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
)
VALUES (
    'Tony',
    'Stark',
    'tony@starknet.com',
    'Iam1ronM@n'
);

UPDATE account 
SET account_type = 'Admin'
WHERE account_email = 'tony@starknet.com';

DELETE FROM account
WHERE account_email = 'tony@starknet.com';

UPDATE inventory
SET description = REPLACE(description, 'the small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
    inv_thumbnail = REPLACE(inv_image, '/images', '/images/vehicles');
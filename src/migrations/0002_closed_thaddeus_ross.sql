ALTER TABLE `categories` DROP FOREIGN KEY `categories_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `categories` ADD `id_users` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `categories` ADD CONSTRAINT `categories_id_users_users_id_fk` FOREIGN KEY (`id_users`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
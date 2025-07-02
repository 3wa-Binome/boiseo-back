ALTER TABLE `products` DROP FOREIGN KEY `products_id_categories_categories_id_fk`;
--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `id_categories` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_id_categories_categories_id_fk` FOREIGN KEY (`id_categories`) REFERENCES `categories`(`id`) ON DELETE restrict ON UPDATE no action;
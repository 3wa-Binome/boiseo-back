CREATE TABLE `suppliers` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP
,
	`id_users` varchar(36) NOT NULL,
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `materials` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP
,
	`id_suppliers` varchar(36) NOT NULL,
	`id_users` varchar(36) NOT NULL,
	CONSTRAINT `materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP
,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pictures` (
	`id` varchar(36) NOT NULL,
	`src` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP
,
	`id_users` varchar(36) NOT NULL,
	`id_products` varchar(36),
	CONSTRAINT `pictures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`quantity` int NOT NULL DEFAULT 0,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP
,
	`id_users` varchar(36) NOT NULL,
	`id_categories` varchar(36),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products_materials` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`material_id` varchar(36) NOT NULL,
	`quantity` int NOT NULL,
	CONSTRAINT `products_materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `suppliers` ADD CONSTRAINT `suppliers_id_users_users_id_fk` FOREIGN KEY (`id_users`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materials` ADD CONSTRAINT `materials_id_suppliers_suppliers_id_fk` FOREIGN KEY (`id_suppliers`) REFERENCES `suppliers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materials` ADD CONSTRAINT `materials_id_users_users_id_fk` FOREIGN KEY (`id_users`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categories` ADD CONSTRAINT `categories_id_users_id_fk` FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pictures` ADD CONSTRAINT `pictures_id_users_users_id_fk` FOREIGN KEY (`id_users`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pictures` ADD CONSTRAINT `pictures_id_products_products_id_fk` FOREIGN KEY (`id_products`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_id_users_users_id_fk` FOREIGN KEY (`id_users`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_id_categories_categories_id_fk` FOREIGN KEY (`id_categories`) REFERENCES `categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products_materials` ADD CONSTRAINT `products_materials_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products_materials` ADD CONSTRAINT `products_materials_material_id_materials_id_fk` FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON DELETE cascade ON UPDATE no action;
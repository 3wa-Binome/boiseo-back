import { relations } from "drizzle-orm";
import {
    categories,
    equipments,
    messages,
    options,
    passwordResetTokens,
    pictures,
    pricePeriods,
    roles,
    users,
    vehicles,
    vehiclesToEquipments,
} from "./";

export const userRelations = relations(users, ({ many, one }) => ({
    vehicles: many(vehicles), // un user peut avoir plusieurs vehicules
    pictures: many(pictures), // un user peut avoir plusieurs pictures
    passwordResetTokens: many(passwordResetTokens),
    role: one(roles, { // Le nom de la table est ref ici, un user lié à 1 seul role
        // 1erement, on recup la colonne qui fait ref à users dans la table comment
        fields: [users.roleId],
        // 2emement on recup la colonne/table qui fait ref à la colonne authorId de la table comments
        references: [roles.id],
    }),
    sentMessages: many(messages, {
        relationName: "sentMessages",
    }),
    receivedMessages: many(messages, {
        relationName: "receivedMessages",
    }),
}));

export const vehicleRelations = relations(vehicles, ({ many, one }) => ({
    pictures: many(pictures),
    pricePeriods: many(pricePeriods),
    options: many(options),
    vehiclesToEquipments: many(vehiclesToEquipments),
    user: one(users, {
        fields: [vehicles.userId],
        references: [users.id],
    }),
    category: one(categories, {
        fields: [vehicles.categoryId],
        references: [categories.id],
    }),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
    vehicles: many(vehicles),
}));

export const roleRelations = relations(roles, ({ many }) => ({
    users: many(users),
}));

export const passwordResetTokenRelations = relations(
    passwordResetTokens,
    ({ one }) => ({
        user: one(users, {
            fields: [passwordResetTokens.userId],
            references: [users.id],
        }),
    }),
);

export const pictureRelations = relations(pictures, ({ one }) => ({
    user: one(users, {
        fields: [pictures.userId],
        references: [users.id],
    }),
    vehicle: one(vehicles, {
        fields: [pictures.vehicleId],
        references: [vehicles.id],
    }),
}));

export const messageRelations = relations(messages, ({ one }) => ({
    sender: one(users, {
        fields: [messages.senderId],
        references: [users.id],
    }),
    receiver: one(users, {
        fields: [messages.receiverId],
        references: [users.id],
    }),
}));

export const pricePeriodRelations = relations(pricePeriods, ({ one }) => ({
    vehicle: one(vehicles, {
        fields: [pricePeriods.vehicleId],
        references: [vehicles.id],
    }),
}));

export const optionRelations = relations(options, ({ one }) => ({
    vehicle: one(vehicles, {
        fields: [options.vehicleId],
        references: [vehicles.id],
    }),
}));

export const equipmentsRelations = relations(equipments, ({ many }) => ({
    vehiclesToEquipments: many(vehiclesToEquipments)
}));

export const vehiclesToEquipmentsRelations = relations(vehiclesToEquipments, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehiclesToEquipments.vehicleId],
    references: [vehicles.id],
  }),
  equipment: one(equipments, {
    fields: [vehiclesToEquipments.equipmentId],
    references: [equipments.id],
  }),
}));


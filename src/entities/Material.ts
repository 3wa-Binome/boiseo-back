import { InferSelectModel, InferInsertModel} from "drizzle-orm";
import { materials } from "../schemas";

export type Material = InferSelectModel<typeof materials>;

export type NewMaterial = InferInsertModel<typeof materials>;
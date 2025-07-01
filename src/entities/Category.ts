import { InferSelectModel, InferInsertModel} from "drizzle-orm";
import { categories } from "../schemas";

export type Category = InferSelectModel<typeof categories>;

export type NewCategory = InferInsertModel<typeof categories>;
import { InferSelectModel, InferInsertModel} from "drizzle-orm";
import { products } from "../schemas";

export type Product = InferSelectModel<typeof products>;

export type NewProduct = InferInsertModel<typeof products>;
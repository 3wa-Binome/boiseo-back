import { InferSelectModel, InferInsertModel} from "drizzle-orm";
import { suppliers } from "../schemas";

export type Supplier = InferSelectModel<typeof suppliers>;

export type NewSupplier = InferInsertModel<typeof suppliers>;
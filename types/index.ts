import type { Property as TProperty } from "./property";
import type { Schema as TSchema } from "./schema";

export type {
  INKDataset,
  INKCatalog,
  IThingsStats,
  IDatasetPublisher,
} from "./dataset";

export type { Entity, TEntity, IEntityDatum, IEntityComponent } from "./entity";

export type { TProperty, TSchema };

export type { IEntityUrlParams } from "../src/urls";

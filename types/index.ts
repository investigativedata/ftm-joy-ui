import type { Property as TProperty } from "../model/property";
import type { Schema as TSchema } from "../model/schema";

export type {
  INKDataset,
  INKCatalog,
  ICoverage,
  IDatasetPublisher,
} from "./dataset";

export type { Entity, TEntity, IEntityDatum, IEntityComponent } from "./entity";

export type { TProperty, TSchema };

export type { IEntityUrlParams } from "../src/urls";

export type { Values } from "../model";

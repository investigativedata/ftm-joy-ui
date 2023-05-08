import type { TEntity, Entity } from "../types/entity";
import type { Schema } from "../types/schema";
import defaultModel from "./defaultModel.json";
import { Model } from "../types/model";

const model = new Model(defaultModel);

export function getProxy(raw: TEntity): Entity {
  return model.getEntity(raw);
}

export function getCaption(raw: TEntity): string {
  const proxy = getProxy(raw);
  return proxy.getCaption();
}

export function getSchema(
  schemaName: string | null | undefined | Schema
): Schema {
  return model.getSchema(schemaName);
}

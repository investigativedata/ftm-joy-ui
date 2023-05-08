import { ParsedUrlQuery } from "querystring";
import slugify from "slugify";

import type { TEntity } from "../types";
import { getProxy } from "./util";

export { slugify };

export interface IEntityUrlParams extends ParsedUrlQuery {
  readonly schema: string;
  readonly slug: string[];
}

export function getEntityUrlParams(entity: TEntity): IEntityUrlParams {
  const proxy = getProxy(entity);
  return {
    schema: slugify(proxy.schema.name).toLowerCase(),
    slug: [proxy.id, slugify(proxy.getCaption()).slice(0, 100)],
  };
}

export function getEntityUrl(entity: TEntity, prefix?: string): string {
  const { schema, slug } = getEntityUrlParams(entity);
  return `${prefix || "/"}${schema.toLowerCase()}/${slug.join("/")}`;
}

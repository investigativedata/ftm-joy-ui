import { ParsedUrlQuery } from "querystring";
import slugify from "slugify";
import { getProxy } from "./util";
import type { TEntity } from "./types";

export { slugify };

export interface IEntityUrlParams extends ParsedUrlQuery {
  readonly schema: string;
  readonly slug: string[];
}

export function getEntityUrlParams(entity: TEntity): IEntityUrlParams {
  entity = getProxy(entity);
  return {
    schema: slugify(entity.schema.name).toLowerCase(),
    slug: [entity.id, slugify(entity.getCaption()).slice(0, 100)],
  };
}

export function getEntityUrl(entity: TEntity): string {
  const { schema, slug } = getEntityUrlParams(entity);
  return `/${schema.toLowerCase()}/${slug.join("/")}`;
}

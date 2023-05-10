import type { IEntityDatum } from "../types";

export interface IUrlQuery {
  // visible api params in the browser
  readonly page?: number;
  limit?: number;
  readonly order_by?: string;
}

export interface IApiQuery extends IUrlQuery {
  api_key?: string;
  readonly nested?: boolean;
  readonly dehydrate?: boolean;
  readonly dehydrate_nested?: boolean;
  readonly reverse?: string;
  readonly [key: string]: any;
}

export interface IEntitiesResult {
  readonly total: number;
  readonly items: number;
  readonly query: IApiQuery;
  readonly url: string;
  readonly next_url: string | null;
  readonly prev_url: string | null;
  readonly schemata: { [key: string]: number };
  readonly entities: IEntityDatum[];
}

type Aggregation = {
  readonly min?: string | number;
  readonly max?: string | number;
  readonly sum?: string | number;
  readonly avg?: string | number;
};

type Aggregations = {
  readonly [key: string]: Aggregation;
};

export interface IAggregationResult {
  readonly total: number;
  readonly query: IApiQuery;
  readonly url: string;
  readonly aggregations: Aggregations;
}

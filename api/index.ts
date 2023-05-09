import queryString from "query-string";

import type { IEntityDatum, INKCatalog, INKDataset } from "../types";
import type { IAggregationResult, IApiQuery, IEntitiesResult } from "./types";

export default class Api {
  private endpoint: string;
  private api_key?: string;

  constructor(endpoint: string, api_key?: string) {
    this.endpoint = endpoint;
    this.api_key = api_key;
  }

  async getCatalog(): Promise<INKCatalog> {
    return await this.api("catalog");
  }

  async getDataset(dataset: string): Promise<INKDataset> {
    return await this.api(dataset);
  }

  async getEntity(dataset: string, id: string): Promise<IEntityDatum> {
    return await this.api(`${dataset}/entities/${id}`, { nested: true });
  }

  async getEntities(
    dataset: string,
    query: IApiQuery = {}
  ): Promise<IEntitiesResult> {
    return await this.api(`${dataset}/entities`, query);
  }

  async searchEntities(
    dataset: string,
    query: IApiQuery = {}
  ): Promise<IEntitiesResult> {
    return await this.api(`${dataset}/search`, query);
  }

  async getAggregations(
    dataset: string,
    query: IApiQuery = {}
  ): Promise<IAggregationResult> {
    return await this.api(`${dataset}/aggregate`, query);
  }

  async api(path: string, query: IApiQuery = {}): Promise<any> {
    query.api_key = this.api_key; // this var is only accessible on server
    const url = `${this.endpoint}/${path}?${queryString.stringify(query, {
      skipNull: true,
      skipEmptyString: true,
    })}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    if (res.status >= 400 && res.status < 600) {
      const error = await res.json();
      console.log(res.status, error);
      throw { code: res.status, error };
    }
  }
}

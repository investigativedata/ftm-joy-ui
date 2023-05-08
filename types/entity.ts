import { Schema } from "./schema";
import { Model } from "./model";
import { Property } from "./property";
import { PropertyType } from "./propertyType";

export type Value = string | Entity;
export type Values = Array<Value>;
export type EntityProperties = { [prop: string]: Array<Value | IEntityDatum> };

type Context = { [key: string]: any };

export interface IEntityDatum {
  caption: string;
  referents: Array<string>;
  datasets: Array<string>;
  schema: Schema | string;
  properties?: EntityProperties;
  context: Context;
  id: string;
}

/**
 * An entity proxy which provides simplified access to the
 * properties and schema associated with an entity.
 */
export class Entity {
  public id: string;
  public properties: Map<Property, Values> = new Map();
  public context: Context = {};
  public readonly schema: Schema;
  public caption: string;
  public referents: Array<string>;
  public datasets: Array<string>;
  // public target: boolean;

  constructor(model: Model, data: IEntityDatum) {
    this.schema = model.getSchema(data.schema);
    this.id = data.id;
    this.caption = data.caption;
    this.referents = data.referents;
    this.datasets = data.datasets;
    // this.target = data.target;

    if (data.properties) {
      Object.entries(data.properties).forEach(([prop, values]) => {
        values.forEach((value) => {
          this.setProperty(prop, value);
        });
      });
    }

    this.context = data.context || {};
  }

  setProperty(
    prop: string | Property,
    value: Value | IEntityDatum | undefined | null
  ): Values {
    const property = this.schema.getProperty(prop);
    if (property === undefined) {
      return [];
    }
    const values = this.properties.get(property) || [];
    if (value === undefined || value === null) {
      return values as Values;
    }
    if (
      property.type.name === PropertyType.ENTITY ||
      typeof value !== "string"
    ) {
      if (typeof value === "string") {
        // don't allow setting stringy entity properties.
        // this may backfire later.
        return values as Values;
      }
      const entity = value as unknown as IEntityDatum;
      value = new Entity(this.schema.model, entity);
    }
    values.push(value);
    this.properties.set(property, values);
    return values as Values;
  }

  hasProperty(prop: string | Property): boolean {
    const property = this.schema.getProperty(prop);
    if (property === undefined) {
      return false;
    }
    return this.properties.has(property);
  }

  getProperty(prop: string | Property): Values {
    const property = this.schema.getProperty(prop);
    if (property === undefined || !this.properties.has(property)) {
      return [];
    }
    return this.properties.get(property) as Values;
  }

  getStringProperty(prop: string | Property): string[] {
    return this.getProperty(prop) as string[];
  }

  /**
   * The first value of a property only.
   *
   * @param prop A property name or object
   */
  getFirst(prop: string | Property): Value | null {
    for (const value of this.getProperty(prop)) {
      return value;
    }
    return null;
  }

  /**
   * List all properties for which this entity has values set. This
   * does not include unset properties.
   */
  getProperties(): Array<Property> {
    return Array.from(this.properties.keys());
  }

  getDisplayProperties(): Array<Property> {
    const properties = this.schema.getFeaturedProperties();
    const existingProps = this.getProperties().sort((a, b) =>
      a.label.localeCompare(b.label)
    );
    for (let prop of existingProps) {
      if (properties.indexOf(prop) == -1) {
        properties.push(prop);
      }
    }
    return properties.filter((p) => !p.hidden);
  }

  /**
   * Get the designated label for the given entity.
   */
  getCaption(): string {
    for (const property of this.schema.caption) {
      for (const value of this.getProperty(property)) {
        return value as string;
      }
    }
    return this.schema.label;
  }

  /**
   * Get the designated label for the given entity.
   */
  getEdgeCaption(): string {
    const captions = this.schema.edge ? this.schema.edge.caption : [];
    for (const property of captions) {
      for (const value of this.getProperty(property)) {
        return value as string;
      }
    }
    return this.schema.label;
  }

  /**
   * Get all the values of a particular type, irrespective of
   * which property it is associated with.
   */
  getTypeValues(type: string | PropertyType, matchableOnly = false): Values {
    const propType = this.schema.model.getType(type);
    const values = new Array<Value>();
    for (const property of this.getProperties()) {
      if (!matchableOnly || property.matchable) {
        if (property.type.toString() === propType.toString()) {
          for (const value of this.getProperty(property)) {
            if (values.indexOf(value) === -1) {
              values.push(value);
            }
          }
        }
      }
    }
    return values;
  }

  /**
   * Serialise the entity to a plain JSON object, suitable for feeding to the
   * JSON.stringify() call.
   */
  toJSON(): IEntityDatum {
    const properties: EntityProperties = {};
    this.properties.forEach((values, prop) => {
      properties[prop.name] = values.map((value) =>
        Entity.isEntity(value) ? (value as Entity).toJSON() : value
      );
    });
    return {
      id: this.id,
      caption: this.caption,
      schema: this.schema.name,
      properties: properties,
      datasets: this.datasets,
      referents: this.referents,
      context: this.context,
    };
  }

  /**
   * Shortcut helper function.
   *
   * @param model active FollowTheMoney model
   * @param data the raw blob, which must match IEntityDatum
   */
  static fromJSON(model: Model, data: any): Entity {
    return model.getEntity(data);
  }

  /**
   * Make a copy of the entity with no shared object identity.
   */
  clone(): Entity {
    return Entity.fromJSON(this.schema.model, this.toJSON());
  }

  static isEntity(value: Value): boolean {
    return typeof value !== "string";
  }

  static fromData(model: Model, data: IEntityDatum): Entity {
    return new Entity(model, data);
  }
}

export type TEntity = Entity | IEntityDatum;

export interface IEntityComponent {
  entity: TEntity;
}
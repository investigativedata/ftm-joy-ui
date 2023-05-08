import type { ISchemaDatum } from "./schema";
import type {
  PropertyType as TProperty,
  IPropertyTypeDatum,
} from "./propertyType";
import type { IEntityDatum } from "./entity";

import { Schema } from "./schema";
import { Entity } from "./entity";
import { PropertyType } from "./propertyType";

interface IModelDatum {
  schemata: { [name: string]: ISchemaDatum };
  types: { [name: string]: IPropertyTypeDatum };
}

export class Model {
  public readonly schemata: { [x: string]: Schema | undefined } = {};
  public readonly types: { [x: string]: PropertyType } = {};

  constructor(config: IModelDatum) {
    this.types = {};
    Object.entries(config.types).forEach(([typeName, typeData]) => {
      this.types[typeName] = new PropertyType(typeName, typeData);
    });

    this.schemata = {};
    Object.entries(config.schemata).forEach(([schemaName, schema]) => {
      this.schemata[schemaName] = new Schema(this, schemaName, schema);
    });
  }

  getSchema(schemaName: string | null | undefined | Schema): Schema {
    if (schemaName === null || schemaName === undefined) {
      throw new Error("Invalid schema.");
    }
    if (schemaName instanceof Schema) {
      return schemaName;
    }
    const schema = this.schemata[schemaName];
    if (schema === undefined) {
      throw new Error("No such schema: " + schemaName);
    }
    return schema;
  }

  /**
   * Get a list of all schemata.
   */
  getSchemata(): Schema[] {
    return Object.keys(this.schemata)
      .map((name) => this.schemata[name])
      .filter(Schema.isSchema);
  }

  /**
   * Get a list of all unique properties.
   */
  getProperties(): TProperty[] {
    const qnames = new Map<string, TProperty>();
    this.getSchemata().forEach((schema) => {
      schema.getProperties().forEach((prop) => {
        qnames.set(prop.qname, prop);
      });
    });
    return Array.from(qnames.values());
  }

  /**
   * Get a particular property type.
   *
   * @param type name of the type
   */
  getType(type: string | PropertyType): PropertyType {
    if (type instanceof PropertyType) {
      return type;
    }
    return this.types[type];
  }

  /**
   * Convert a raw JSON object to an entity proxy.
   *
   * @param raw entity source data
   */
  getEntity(raw: IEntityDatum | Entity): Entity {
    if (raw instanceof Entity) {
      return raw;
    } else {
      return new Entity(this, raw);
    }
  }
}

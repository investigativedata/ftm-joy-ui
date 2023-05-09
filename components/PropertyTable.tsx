import Table from "@mui/joy/Table";

import { getProxy } from "../src/util";
import type { Entity, IEntityComponent, TProperty } from "../types";
import { ExpandableEntityProperty } from "./Property";

export interface IPropertyTable extends IEntityComponent {
  props?: string[] | TProperty[];
  icon?: boolean
}

export const getProps = (
  entity: Entity,
  props?: string[] | TProperty[]
): TProperty[] => {
  if (props === undefined) return entity.schema.getFeaturedProperties();
  const entityProps: TProperty[] = [];
  for (const prop of props) {
    const entityProp = entity.schema.getProperty(prop);
    if (entityProp !== undefined) {
      if (entity.hasProperty(entityProp)) {
        entityProps.push(entityProp);
      }
    }
  }
  return entityProps;
};

export default function PropertyTable({ entity, props, icon = true }: IPropertyTable) {
  entity = getProxy(entity);
  const entityProps = getProps(entity, props);
  return (
    <Table>
      <tbody>
        {entityProps.map((prop) => (
          <tr key={prop.name}>
            <th>{prop.label}</th>
            <td>
              <ExpandableEntityProperty entity={entity} prop={prop} icon={icon} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

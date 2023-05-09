import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

import { getProxy } from "../src/util";
import { ExpandableEntityProperty } from "./Property";
import type { IPropertyTable } from "./PropertyTable";
import { getProps } from "./PropertyTable";

export default function PropertyStack({
  entity,
  props,
  icon = true,
}: IPropertyTable) {
  entity = getProxy(entity);
  const entityProps = getProps(entity, props);
  return (
    <Stack>
      {entityProps.map((prop) => (
        <>
          <Typography level="h5">{prop.label}</Typography>
          <ExpandableEntityProperty entity={entity} prop={prop} icon={icon} />
        </>
      ))}
    </Stack>
  );
}

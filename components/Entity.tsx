import { useContext } from "react";

import Link from "next/link";

import { styled } from "@mui/joy/styles";

import Context from "../context";
import { getEntityUrl } from "../src/urls";
import { getProxy } from "../src/util";
import type { IEntityComponent } from "../types";
import Icons from "../types/icons";

interface CaptionProps extends IEntityComponent {
  readonly icon?: boolean;
  readonly iconSize?: number;
  readonly iconOnly?: boolean;
}

const Icon = styled("span")(({ theme }) => ({
  svg: {
    path: {
      stroke: theme.palette.primary.plainColor,
    },
  },
}));

export function SchemaIcon({ entity, iconSize = 16 }: CaptionProps) {
  const proxy = getProxy(entity);
  const iconPaths = Icons.getSchemaIcon(proxy.schema);
  return (
    <Icon>
      <svg viewBox={"0 0 25 25"} height={iconSize} width={iconSize}>
        {iconPaths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </Icon>
  );
}

export function Schema({ entity, iconSize = 16, icon = true }: CaptionProps) {
  entity = getProxy(entity);
  return icon ? (
    <span>
      <SchemaIcon entity={entity} iconSize={iconSize} /> {entity.schema.label}
    </span>
  ) : (
    <span>{entity.schema.label}</span>
  );
}

export function EntityCaption({
  entity,
  icon = false,
  iconOnly = false,
}: CaptionProps) {
  entity = getProxy(entity);
  return (
    <>
      {icon ? <SchemaIcon entity={entity} /> : null}
      {!iconOnly ? entity.caption : null}
    </>
  );
}

export function EntityLink({
  entity,
  icon = false,
  iconOnly = false,
}: CaptionProps) {
  const { urlPrefix } = useContext(Context);
  return (
    <Link href={getEntityUrl(entity, urlPrefix)}>
      <EntityCaption entity={entity} icon={icon} iconOnly={iconOnly} />
    </Link>
  );
}

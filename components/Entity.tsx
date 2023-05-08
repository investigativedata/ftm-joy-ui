import { useContext } from "react";

import Link from "next/link";

import { styled } from "@mui/joy/styles";

import Context from "../context";
import { getEntityUrl } from "../src/urls";
import { getProxy } from "../src/util";
import type { IEntityComponent } from "../types";
import Icons from "../types/icons";

interface IconProps extends IEntityComponent {
  size?: number;
}

const Icon = styled("span")(({ theme }) => ({
  svg: {
    path: {
      stroke: theme.palette.primary.plainColor,
    },
  },
}));

export function SchemaIcon({ entity, size = 16 }: IconProps) {
  const proxy = getProxy(entity);
  const iconPaths = Icons.getSchemaIcon(proxy.schema);
  return (
    <Icon>
      <svg viewBox={"0 0 25 25"} height={size} width={size}>
        {iconPaths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </Icon>
  );
}

interface CaptionProps extends IEntityComponent {
  icon?: boolean;
  iconOnly?: boolean;
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

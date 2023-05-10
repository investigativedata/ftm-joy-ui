import { useContext } from "react";

import { styled } from "@mui/joy/styles";

import Context from "../context";
import { getEntityUrl } from "../src/urls";
import { getProxy } from "../src/util";
import type { IEntityComponent } from "../types";
import Icons from "../types/icons";
import Link from "./common/Link";

interface CaptionProps extends IEntityComponent {
  readonly icon?: boolean;
  readonly iconColor?: string;
  readonly iconSize?: number;
  readonly iconOnly?: boolean;
}

const Icon = styled("span")(({ theme, color }) => ({
  svg: {
    path: {
      stroke: color || theme.palette.primary.plainColor,
    },
  },
}));

export function SchemaIcon({
  entity,
  iconSize = 16,
  iconColor = undefined,
}: CaptionProps) {
  const proxy = getProxy(entity);
  const iconPaths = Icons.getSchemaIcon(proxy.schema);
  return (
    <Icon color={iconColor}>
      <svg viewBox={"0 0 25 25"} height={iconSize} width={iconSize}>
        {iconPaths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </Icon>
  );
}

export function Schema({
  entity,
  iconSize = 16,
  icon = true,
  iconColor = undefined,
}: CaptionProps) {
  entity = getProxy(entity);
  return icon ? (
    <span>
      <SchemaIcon entity={entity} iconSize={iconSize} iconColor={iconColor} />{" "}
      {entity.schema.label}
    </span>
  ) : (
    <span>{entity.schema.label}</span>
  );
}

export function EntityCaption({
  entity,
  icon = false,
  iconOnly = false,
  iconColor = undefined,
}: CaptionProps) {
  entity = getProxy(entity);
  return (
    <>
      {icon ? (
        <>
          <SchemaIcon entity={entity} iconColor={iconColor} />{" "}
        </>
      ) : null}
      {!iconOnly ? entity.caption : null}
    </>
  );
}

export function EntityLink({
  entity,
  icon = false,
  iconOnly = false,
  iconColor = undefined,
}: CaptionProps) {
  const { urlPrefix, entityId } = useContext(Context);
  const isCurrent = entityId === entity.id;
  const caption = (
    <EntityCaption
      entity={entity}
      icon={icon}
      iconOnly={iconOnly}
      iconColor={isCurrent ? "gray" : undefined}
    />
  );
  if (isCurrent) return caption;
  return <Link href={getEntityUrl(entity, urlPrefix)}>{caption}</Link>;
}

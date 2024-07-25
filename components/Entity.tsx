import { useContext } from "react";

import { styled } from "@mui/joy/styles";

import Context from "../context";
import Icons from "../model/icons";
import { getEntityUrl } from "../src/urls";
import { getProxy } from "../src/util";
import type { IEntityComponent } from "../types";
import Link from "./common/Link";

const ICON_SIZE = 16;

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

function EntitySchemaIcon({
  entity,
  iconSize = ICON_SIZE,
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

export function EntitySchema({
  entity,
  iconSize = ICON_SIZE,
  icon = true,
  iconColor = undefined,
}: CaptionProps) {
  entity = getProxy(entity);
  return icon ? (
    <span>
      <EntitySchemaIcon
        entity={entity}
        iconSize={iconSize}
        iconColor={iconColor}
      />{" "}
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
          <EntitySchemaIcon entity={entity} iconColor={iconColor} />{" "}
        </>
      ) : null}
      {!iconOnly ? entity.caption : null}
    </>
  );
}

interface EntityLinkProps extends CaptionProps {
  readonly urlPrefix?: string;
}

export function EntityLink({
  entity,
  icon = false,
  iconOnly = false,
  urlPrefix,
}: EntityLinkProps) {
  const ctx = useContext(Context);
  const isCurrent = ctx.entityId === entity.id;
  if (!urlPrefix) {
    urlPrefix = ctx.urlPrefix;
  }
  const caption = (
    <EntityCaption
      entity={entity}
      icon={icon}
      iconOnly={iconOnly}
      iconColor={isCurrent ? "gray" : undefined}
    />
  );
  const getUrl = ctx.getEntityUrl || getEntityUrl;
  const url = getUrl(entity, urlPrefix);
  if (isCurrent || !url) return caption;
  return <Link href={url}>{caption}</Link>;
}

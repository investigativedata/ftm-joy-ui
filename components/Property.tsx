import numeral from "numeral";

import { useState } from "react";

import Link from "next/link";

import Typography from "@mui/joy/Typography";

import model from "../data/defaultModel.json";
import { getProxy } from "../src/util";
import type { IEntityComponent, TProperty } from "../types";
import { EntityLink } from "./Entity";
import CountryFlag from "./common/CountryFlag";

export const SPACER = " · ";

const countryNames: { [key: string]: string } =
  model["types"]["country"]["values"];

const ellipse = ({
  value,
  length = 100,
}: {
  value: string;
  length: number;
}): string => {
  return value.length > length ? `${value.substring(0, length)}…` : value;
};

const amountFormat = new Intl.NumberFormat(["us", "de"], {
  style: "currency",
  currency: "EUR",
});

type AmountProps = {
  readonly value?: string | number;
  readonly abbrev?: boolean;
  readonly currency?: string;
};

export const renderAmount = ({
  value,
  abbrev,
  currency = "€",
}: AmountProps): string | null => {
  if (typeof value !== "number" && !value) return null;
  const parsedAmount = parseFloat(value.toString());
  return abbrev
    ? `${currency} ${numeral(parsedAmount).format("0.00a")}`
    : amountFormat.format(parsedAmount);
};

type DateProps = {
  readonly value: string;
  readonly yearOnly?: Boolean;
  readonly format?: string;
};

const renderDate = ({ value, yearOnly, format }: DateProps): string => {
  if (value.toString().length == 4) return value.toString();
  return format === "long"
    ? new Date(value).toDateString()
    : new Date(value).toISOString().slice(0, yearOnly ? 4 : 10);
};

type Value = {
  readonly value: string;
};

const renderNumeric = ({ value }: Value): string => {
  const parsedValue = numeral(value);
  return parsedValue.format("0,0.00");
};

const renderUrl = ({ value }: Value) => <Link href={value}>{value}</Link>;

const renderCountry = ({
  value,
  ellipsis,
}: {
  value: string;
  ellipsis: number;
}) => {
  const label = countryNames[value] || value;
  return ellipsis > 0 ? (
    <CountryFlag iso={value.toLowerCase()} />
  ) : (
    <span>
      <CountryFlag iso={value.toLowerCase()} /> {label}
    </span>
  );
};

const renderIdentifier = ({ value, name }: { value: string; name: string }) => {
  if (name === "leiCode")
    return (
      <Link href={`https://search.gleif.org/#/record/${value}`}>{value}</Link>
    );
  // FIXME add more
  return value;
};

const renderProp = (prop: TProperty, value: string, ellipsis: number) => {
  if (prop.type.name === "number") {
    if (prop.name === "amountEur")
      return renderAmount({ value, currency: "EUR" });
    if (prop.name === "amountUsd")
      return renderAmount({ value, currency: "USD" });
    if (prop.name === "amount") return renderAmount({ value });
    return renderNumeric({ value });
  }
  if (prop.type.name === "url") return renderUrl({ value });
  if (prop.type.name === "date") return renderDate({ value });
  if (prop.type.name === "identifier")
    return renderIdentifier({ value, name: prop.name });
  if (prop.type.name === "country") return renderCountry({ value, ellipsis });
  if (ellipsis > 0) return ellipse({ value, length: ellipsis });
  return value.toString();
};

interface IPropComponent extends IEntityComponent {
  readonly prop: TProperty | string;
  readonly icon?: boolean;
  readonly iconOnly?: boolean;
  readonly ellipsis?: number;
}

export default function EntityProperty({
  entity,
  prop,
  icon = false,
  iconOnly = false,
  ellipsis = 0,
}: IPropComponent) {
  entity = getProxy(entity);
  if (!entity.schema.hasProperty(prop)) return null;
  const schemaProp = entity.schema.getProperty(prop);
  if (!schemaProp) return null;
  const values = entity.getProperty(schemaProp);
  if (!values.length) return null;
  return (
    <span>
      {values.map((v, i) => (
        <span key={i}>
          {typeof v !== "string" ? (
            <EntityLink entity={v} icon={icon} iconOnly={iconOnly} />
          ) : (
            renderProp(schemaProp, v, ellipsis)
          )}
          {i < values.length - 1 && !iconOnly ? SPACER : null}
        </span>
      ))}
    </span>
  );
}

export function ExpandableEntityProperty({
  entity,
  prop,
  icon = false,
  iconOnly = false,
  ellipsis = 0,
}: IPropComponent) {
  entity = getProxy(entity);
  const [expanded, setExpanded] = useState<boolean>(false);
  if (!entity.schema.hasProperty(prop)) return null;
  const schemaProp = entity.schema.getProperty(prop);
  if (!schemaProp) return null;
  const values = entity.getProperty(schemaProp);
  if (!values.length) return null;

  const shortElems = values.slice(0, 3);
  const moreCount = values.length - 3;
  const moreText = (
    <Typography
      component="span"
      color="neutral"
      sx={{ display: "inline " }}
    >{`and ${moreCount} more…`}</Typography>
  );
  const lessText = (
    <Typography component="span" color="neutral" sx={{ display: "inline " }}>
      less
    </Typography>
  );

  if (values.length <= 3) {
    return (
      <span>
        {values.map((v, i) => (
          <span key={i}>
            {typeof v !== "string" ? (
              <EntityLink entity={v} icon={icon} iconOnly={iconOnly} />
            ) : (
              renderProp(schemaProp, v, ellipsis)
            )}
            {i < values.length - 1 && !iconOnly ? SPACER : null}
          </span>
        ))}{" "}
      </span>
    );
  }
  if (!expanded) {
    return (
      <span>
        {shortElems.map((v, i) => (
          <span key={i}>
            {typeof v !== "string" ? (
              <EntityLink entity={v} icon={icon} iconOnly={iconOnly} />
            ) : (
              renderProp(schemaProp, v, ellipsis)
            )}
            {i < shortElems.length && !iconOnly ? SPACER : null}
          </span>
        ))}{" "}
        <a
          onClick={(e) => {
            e.preventDefault();
            setExpanded(true);
          }}
          href="#"
        >
          {moreText}
        </a>
      </span>
    );
  }
  return (
    <span>
      {values.map((v, i) => (
        <span key={i}>
          {typeof v !== "string" ? (
            <EntityLink entity={v} icon={icon} iconOnly={iconOnly} />
          ) : (
            renderProp(schemaProp, v, ellipsis)
          )}
          {i < values.length && !iconOnly ? SPACER : null}
        </span>
      ))}{" "}
      <a
        onClick={(e) => {
          e.preventDefault();
          setExpanded(false);
        }}
        href="#"
      >
        {lessText}
      </a>
    </span>
  );
}

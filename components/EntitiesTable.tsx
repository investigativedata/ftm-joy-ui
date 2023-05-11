import * as React from "react";

import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import {
  THEME_ID as MATERIAL_THEME_ID,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  experimental_extendTheme as muiExtendTheme,
} from "@mui/material/styles";
import type {} from "@mui/material/themeCssVarsAugmentation";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid, GridColumnHeaders, GridRow } from "@mui/x-data-grid";
import { unstable_joySlots } from "@mui/x-data-grid/joy";

import { Property } from "../model/property";
import { getPrimitiveValue } from "../model/value";
import { getProxy, getSchema } from "../src/util";
import type { Entity, TEntity, TProperty, TSchema } from "../types";
import { EntityLink } from "./Entity";
import EntityProperty from "./Property";

type EntityRow = {
  readonly id: string;
  readonly entity: Entity;
};

type TColumn = GridColDef | TProperty | string;

interface ITableProps {
  readonly schema?: string | TSchema;
  readonly columns?: TColumn[];
  readonly entities: TEntity[];
  [key: string]: any; // pass through component props
}

type TRow = { row: EntityRow };

const getPropColumnDef = (prop: TProperty, headerName?: string): GridColDef => {
  if (prop.name === "name")
    return {
      field: prop.name,
      flex: 2,
      headerName: headerName || prop.label,
      renderCell: ({ row }: TRow) => <EntityLink entity={row.entity} icon />,
      sortable: true,
      valueGetter: ({ row }: TRow) => getPrimitiveValue(prop, row.entity),
    };
  return {
    field: prop.name,
    flex: 1,
    headerName: headerName || prop.label,
    renderCell: ({ row }: TRow) => (
      <EntityProperty entity={row.entity} prop={prop} icon />
    ),
    sortable: true,
    valueGetter: ({ row }: TRow) =>
      getPrimitiveValue(prop, row.entity.getFirst(prop)),
  };
};

const getColumnDef = (
  colDef: TColumn,
  schema: TSchema
): GridColDef | undefined => {
  if (typeof colDef == "string") {
    const prop = schema.getProperty(colDef);
    if (prop) {
      return getPropColumnDef(prop);
    }
  } else {
    if (colDef instanceof Property) {
      return getPropColumnDef(colDef);
    }
    if (colDef.field) {
      const prop = schema.getProperty(colDef.field);
      if (prop) {
        const baseColDef = getPropColumnDef(prop, colDef.field);
        return { ...baseColDef, ...colDef };
      }
    }
  }
};

const getColumnDefs = (
  schema?: string | TSchema,
  columns?: TColumn[]
): GridColDef[] => {
  let columnDefs: GridColDef[] = [];
  schema = getSchema(schema || "LegalEntity");
  if (!columns?.length) {
    const props = schema.getFeaturedProperties();
    columnDefs = props.map((p) => getPropColumnDef(p));
  } else {
    for (const colDef of columns) {
      const column = getColumnDef(colDef, schema);
      if (!!column) {
        columnDefs.push(column);
      }
    }
  }
  return columnDefs;
};

const muiTheme = muiExtendTheme();

export default function EntitiesTable({
  entities,
  schema,
  columns,
  ...props
}: ITableProps) {
  const rows: EntityRow[] = entities.map((e) => ({
    id: e.id,
    entity: getProxy(e),
  }));

  const columnDefs = React.useMemo(
    () => getColumnDefs(schema, columns),
    [schema, columns]
  );

  const MemoizedRow = React.memo(GridRow);
  const MemoizedColumnHeaders = React.memo(GridColumnHeaders);

  const initialState = {
    pagination: { paginationModel: { pageSize: 10 } },
  };

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: muiTheme }}>
      <JoyCssVarsProvider>
        <DataGrid
          slots={{
            ...unstable_joySlots,
            row: MemoizedRow,
            columnHeaders: MemoizedColumnHeaders,
          }}
          rows={rows}
          columns={columnDefs}
          density="compact"
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          disableDensitySelector
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={initialState}
          hideFooter={
            entities.length <
            initialState.pagination.paginationModel.pageSize + 1
          }
          {...props}
        />
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}

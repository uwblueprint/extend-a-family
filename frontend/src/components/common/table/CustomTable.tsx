// takes in data and displays them in the component
import React from "react";
import {
  Table,
  TableContainer,
  TableBody,
  TableFooter,
  TableHead,
  Paper,
} from "@mui/material";

interface ICustomTable<T> {
  data: T[];
  renderRow: (row: T) => React.ReactNode;
  renderHead: () => React.ReactNode;
  renderFooter: () => React.ReactNode;
  getKey: (row: T) => string | number;
}

export default function CustomTable<T>(props: ICustomTable<T>) {
  const { data, renderRow, renderHead, renderFooter, getKey } = props;
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>{renderHead()}</TableHead>
        <TableBody>
          {data.map((row: T) => (
            <React.Fragment key={getKey(row)}>{renderRow(row)}</React.Fragment>
          ))}
        </TableBody>
        <TableFooter>{renderFooter()}</TableFooter>
      </Table>
    </TableContainer>
  );
}

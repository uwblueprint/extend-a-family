/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
  Table,
} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import Navbar from "../common/Navbar";
import { useFacilitator } from "../../hooks/useUser";
import HelpRequestAPIClient from "../../APIClients/HelpRequestAPIClient";
import { HelpRequest } from "../../types/HelpRequestType";

const ViewHelpRequestPage = (): React.ReactElement => {
  const facilitator = useFacilitator();
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [page, setPage] = useState(1);
  const [helpRequestsPerPage, setHelpRequestsPerPage] = useState(10);

  useEffect(() => {
    const fetchHelpRequests = async () => {
      const data = await HelpRequestAPIClient.getHelpRequests(facilitator.id);
      console.log(data)
      setHelpRequests(data);
      setPage(0);
    };
    fetchHelpRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * helpRequestsPerPage - helpRequests.length)
      : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setHelpRequestsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ textAlign: "center", width: "100%", margin: "0px auto" }}>
      <Navbar />
      <TableContainer component={Paper}>
        <Table aria-label="User grouped by role table">
          <TableHead>
            <TableRow>
              <TableCell align="right">id</TableCell>
              <TableCell align="right">name</TableCell>
              <TableCell align="right">Message</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(helpRequestsPerPage > 0
              ? helpRequests.slice(
                  page * helpRequestsPerPage,
                  page * helpRequestsPerPage + helpRequestsPerPage,
                )
              : helpRequests
            ).map((helpRequest) => (
              <TableRow key={helpRequest._id} style={{ height: 53 }}>
                <TableCell style={{ width: 160 }} align="left">
                  {helpRequest._id}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {helpRequest.learner.firstName} {helpRequest.learner.lastName}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {helpRequest.message}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {new Date(helpRequest.createdAt).toString()}
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={helpRequests.length}
                rowsPerPage={helpRequestsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "users per page",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ViewHelpRequestPage;

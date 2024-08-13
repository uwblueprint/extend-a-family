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
  Breadcrumbs,
  Link,
  Checkbox,
} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import Navbar from "../common/Navbar";
import { useFacilitator } from "../../hooks/useUser";
import HelpRequestAPIClient from "../../APIClients/HelpRequestAPIClient";
import { HelpRequest } from "../../types/HelpRequestType";
import { formatDate } from "../../utils/DateUtils";

const ViewHelpRequestsPage = (): React.ReactElement => {
  const facilitator = useFacilitator();
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [page, setPage] = useState(1);
  const [helpRequestsPerPage, setHelpRequestsPerPage] = useState(10);

  useEffect(() => {
    const fetchHelpRequests = async () => {
      const data = await HelpRequestAPIClient.getHelpRequests(facilitator.id);
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

  const markHelpRequestCompleted = async (helpRequest: HelpRequest) => {
    const data = await HelpRequestAPIClient.markHelpRequestCompleted(
      helpRequest.id,
      !helpRequest.completed,
    );
    if (data) {
      setHelpRequests((prev) => {
        return prev.map((request) => {
          return data.id === request.id ? data : request;
        });
      });
    }
  };

  return (
    <div style={{ textAlign: "center", width: "100%", margin: "0px auto" }}>
      <Navbar />
      <TableContainer component={Paper}>
        <Table aria-label="User grouped by role table">
          <TableHead>
            <TableRow>
              <TableCell>Completed</TableCell>
              <TableCell>Request Id</TableCell>
              <TableCell>Learner</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Location (Unit / Module / Page)</TableCell>
              <TableCell>Date</TableCell>
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
              <TableRow key={helpRequest.id} style={{ height: 53 }}>
                <TableCell style={{ width: 60 }}>
                  <Checkbox
                    aria-label="completed help request"
                    checked={helpRequest.completed}
                    onClick={() => markHelpRequestCompleted(helpRequest)}
                  />
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  <Link
                    underline="hover"
                    color="inherit"
                    href={`/help-requests/${helpRequest.id}`}
                  >
                    {helpRequest.id}
                  </Link>
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {helpRequest.learner.firstName} {helpRequest.learner.lastName}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {helpRequest.message}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  <Breadcrumbs aria-label="location-breadcrumb">
                    <Link
                      underline="hover"
                      color="inherit"
                      href={`/unit/${helpRequest.unit.id}`}
                    >
                      {helpRequest.unit.title}
                    </Link>
                    <Link
                      underline="hover"
                      color="inherit"
                      href={`/module/${helpRequest.module.id}`}
                    >
                      {helpRequest.module.title}
                    </Link>
                    <Link
                      underline="hover"
                      color="inherit"
                      href={`/page/${helpRequest.page.id}`}
                    >
                      {helpRequest.page.title}
                    </Link>
                  </Breadcrumbs>
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {formatDate(helpRequest.createdAt)}
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
                      "aria-label": "help requests per page",
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

export default ViewHelpRequestsPage;

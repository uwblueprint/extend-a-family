/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useState } from "react";
import {
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  Breadcrumbs,
  Link,
  Checkbox,
} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import Navbar from "../common/navbar/Navbar";
import { useFacilitator } from "../../hooks/useUser";
import HelpRequestAPIClient from "../../APIClients/HelpRequestAPIClient";
import { HelpRequest } from "../../types/HelpRequestType";
import { formatDate } from "../../utils/DateUtils";
import CustomTable from "../common/table/CustomTable";
import useTable from "../../hooks/useTable";

const ViewHelpRequestsPage = (): React.ReactElement => {
  const facilitator = useFacilitator();
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);

  const {
    paginatedData,
    handleChangePage,
    handleChangeRowsPerPage,
    pageSize,
    page,
  } = useTable({
    data: helpRequests,
  });

  const changePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      handleChangePage(newPage);
    },
    [handleChangePage],
  );

  const changeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleChangeRowsPerPage(parseInt(event.target.value, 10));
      handleChangePage(0);
    },
    [handleChangePage, handleChangeRowsPerPage],
  );

  useEffect(() => {
    const fetchHelpRequests = async () => {
      const data = await HelpRequestAPIClient.getHelpRequests(facilitator.id);
      setHelpRequests(data);
    };
    fetchHelpRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const renderHead = useCallback(() => {
    return (
      <TableRow>
        <TableCell>Completed</TableCell>
        <TableCell>Request Id</TableCell>
        <TableCell>Learner</TableCell>
        <TableCell>Message</TableCell>
        <TableCell>Location (Unit / Module / Page)</TableCell>
        <TableCell>Date</TableCell>
      </TableRow>
    );
  }, []);

  const renderRow = useCallback((helpRequest: HelpRequest) => {
    return (
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
        <TableCell style={{ width: 160 }}>{helpRequest.message}</TableCell>
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
    );
  }, []);

  const renderFooter = useCallback(() => {
    return (
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            colSpan={3}
            count={helpRequests.length}
            rowsPerPage={pageSize}
            page={page}
            slotProps={{
              select: {
                inputProps: {
                  "aria-label": "help requests per page",
                },
                native: true,
              },
            }}
            onPageChange={changePage}
            onRowsPerPageChange={changeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </TableRow>
      </TableFooter>
    );
  }, [changePage, changeRowsPerPage, helpRequests.length, page, pageSize]);

  const getKey = useCallback((helpRequest: HelpRequest) => {
    return helpRequest.id;
  }, []);

  return (
    <div style={{ textAlign: "center", width: "100%", margin: "0px auto" }}>
      <Navbar />
      <CustomTable
        data={paginatedData}
        renderRow={renderRow}
        renderHead={renderHead}
        renderFooter={renderFooter}
        getKey={getKey}
      />
    </div>
  );
};

export default ViewHelpRequestsPage;

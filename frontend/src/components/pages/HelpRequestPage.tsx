import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import HelpRequestAPIClient from "../../APIClients/HelpRequestAPIClient";
import { HelpRequest } from "../../types/HelpRequestType";

interface RouteParams {
  id: string;
}

const HelpRequestPage = () => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();

  const [helpRequest, setHelpRequest] = useState<HelpRequest | null>();

  useEffect(() => {
    const fetchHelpRequest = async () => {
      const data = await HelpRequestAPIClient.getHelpRequest(id);
      setHelpRequest(data);
    };
    fetchHelpRequest();
  }, [id]);

  if (!helpRequest) {
    return <div>Help request with ID: {id} does not exist</div>;
  }

  return (
    <div>
      <Button onClick={() => history.push(`/help-requests`)}>
        Back to all help requests
      </Button>
      <div>
        Help request ID: {id} {helpRequest?.message}
      </div>
    </div>
  );
};

export default HelpRequestPage;

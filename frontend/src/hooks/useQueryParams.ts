import React from "react";
import { useHistory, useLocation } from "react-router-dom";

const useQueryParams = () => {
  const { search } = useLocation();
  const history = useHistory();

  const queryParams = React.useMemo(
    () => new URLSearchParams(search),
    [search],
  );

  const setQueryParams = (queryObj: Record<string, string>) => {
    history.push({
      search: new URLSearchParams(queryObj).toString(),
    });
  };

  return { queryParams, setQueryParams };
};

export default useQueryParams;

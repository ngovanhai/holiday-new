import React, { useCallback, useState } from "react";
import { Card, Tabs } from "@shopify/polaris";
import Search from "component/search";
import CreateEvent from "component/createEvent";
import TableList from "component/tableList";

function TableHome(props) {
  const { filter, changeHome } = props;
  const [queryString, setQueryString] = useState("");
  const [queryStatus, setQueryStatus] = useState("");
  const [queryTag, setQueryTag] = useState("");
  const [sort, setSort] = useState("");

  return (
    <div>
      <Search
        setQueryString={setQueryString}
        setQueryStatus={setQueryStatus}
        setQueryTag={setQueryTag}
        setSort={setSort}
        filter={filter}
      />
      <TableList
        changeHome={changeHome ? changeHome : null}
        queryString={queryString}
        queryStatus={queryStatus}
        queryTag={queryTag}
        filter={filter}
        sort={sort}
      />
    </div>
  );
}

export default TableHome;

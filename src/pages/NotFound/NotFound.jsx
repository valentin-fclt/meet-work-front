import React from "react";
import Page from "@atlaskit/page";

import { Error } from "../../components";

function NotFound() {
  return (
    <Page>
      <Error
        title={"Well, that's embarassing..."}
        subtitle={"Sorry ! This page doesn't exist (Error 404)"}
      />
    </Page>
  );
}

export default NotFound;

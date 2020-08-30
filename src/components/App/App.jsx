import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Analytics from "react-router-ga";
import { isMobile } from "react-device-detect";
import Page from "@atlaskit/page";

import { Error } from "..";
import { APP_NAME } from "../../config";
import { Dashboard, Meeting, NotFound, ThankYouMeeting } from "../../pages";

function App() {
  // User is using a mobile device
  if (isMobile) {
    return (
      <Page>
        <Error
          title={`Sorry! ${APP_NAME} doesn't support mobile devices yet.`}
          subtitle={
            <div>Please use a computer to create and access meetings.</div>
          }
        />
      </Page>
    );
  }

  return (
    <Router>
      <Analytics id="UA-168739852-2" debug>
        <Switch>
          <Route path="/thank-you" component={ThankYouMeeting} />
          <Route exact path="/" component={Dashboard} />
          <Route path="/:id" component={Meeting} />

          <Route component={NotFound} />
        </Switch>
      </Analytics>
    </Router>
  );
}

export default App;

import React, { useState } from "react";
import Button from "@atlaskit/button";

import "./ThankYouMeeting.css";
import { APP_NAME, LANDING_ADDRESS } from "../../config";

function ThankYouMeeting() {
  const [redirectToHome, setRedirectToHome] = useState(false);

  if (redirectToHome) {
    window.location.href = LANDING_ADDRESS;
  }

  return (
    <div className="container-centered-elements ">
      <div className="thank-you-container">
        <h1 className="thank-you-title">Thank you for using {APP_NAME}!</h1>
        <h2 className="thank-you-subtitle">
          If you were a registered participant, an e-mail containing a debrief
          of the meeting will be sent over to you.
        </h2>
        <div className="thank-you-button">
          <Button onClick={() => setRedirectToHome(true)} appearance="primary">
            Go to the home page
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ThankYouMeeting;

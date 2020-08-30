import React from "react";

import {
  COPYRIGHT_NAME,
  COPYRIGHT_LINK,
  COPYRIGHT_YEAR,
  TERMS_OF_SERVICE_LINK,
  PRIVACY_POLICY_LINK,
} from "../../config";
import "./MeetingSidebarFooter.css";

function MeetingSidebarFooter() {
  return (
    <div className="meeting-sidebar-footer-container">
      <div>
        Copyrights {COPYRIGHT_YEAR} ©{" "}
        <a href={COPYRIGHT_LINK} rel="noopener noreferrer" target="_blank">
          {COPYRIGHT_NAME}
        </a>
      </div>
      <div className="meeting-sidebar-footer-links">
        <a href={PRIVACY_POLICY_LINK} rel="noopener noreferrer" target="_blank">
          Privacy Policy
        </a>{" "}
        |{" "}
        <a
          href={TERMS_OF_SERVICE_LINK}
          rel="noopener noreferrer"
          target="_blank"
        >
          Terms and Conditions
        </a>
      </div>
    </div>
  );
}

export default MeetingSidebarFooter;

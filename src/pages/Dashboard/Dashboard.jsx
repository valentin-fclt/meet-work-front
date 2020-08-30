import React from "react";

import { NewMeetingModal } from "../../components";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="container-centered-elements">
      <NewMeetingModal />
    </div>
  );
}

export default Dashboard;

import React from "react";
import PropTypes from "prop-types";

import { Countdown } from "..";
import "./MeetingSidebarCountdown.css";

import { MEETING_OVERTIME_ALLOWANCE } from "../../config";

function MeetingSidebarCountdown(props) {
  const { meetingStartDate, meetingDuration, currentTime } = props;

  if (currentTime < meetingStartDate + meetingDuration + 60000) {
    return (
      <Countdown
        countdownClassName={(countdownProps) =>
          !countdownProps.completed
            ? "meeting-sidebar-countdown-countdown "
            : "meeting-sidebar-countdown-countdown done"
        }
        deadline={meetingStartDate + meetingDuration + 1}
      />
    );
  }

  return (
    <div className="meeting-sidebar-countdown-ended-warning">
      Meeting has ended. This window will automatically close in:{" "}
      <Countdown
        deadline={
          meetingStartDate + meetingDuration + MEETING_OVERTIME_ALLOWANCE + 1
        }
      />
    </div>
  );
}

export default MeetingSidebarCountdown;

MeetingSidebarCountdown.propTypes = {
  meetingStartDate: PropTypes.number.isRequired,
  meetingDuration: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
};

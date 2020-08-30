import React from "react";
import PropTypes from "prop-types";
import Spinner from "@atlaskit/spinner";

import "./MeetingVideoConference.css";

function MeetingVideoConference(props) {
  const { videoConferenceLoaded } = props;

  return (
    <div className="meeting-video-conference">
      {!videoConferenceLoaded && (
        <div className="meeting-video-conference-loading-spinner">
          <Spinner size="large" />
          <h3>Joining the videoconference...</h3>
        </div>
      )}
      <div id="jitsiWindow" />
    </div>
  );
}

export default MeetingVideoConference;

MeetingVideoConference.propTypes = {
  videoConferenceLoaded: PropTypes.bool.isRequired,
};

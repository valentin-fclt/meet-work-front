import React from "react";
import firebase from "firebase";
import PropTypes from "prop-types";

import {
  MeetingSidebarOutput,
  MeetingSidebarAttachments,
  MeetingSidebarCountdown,
  MeetingSidebarName,
  MeetingSidebarAgenda,
  MeetingSidebarFooter,
} from "..";
import "./MeetingSidebar.css";

function MeetingSidebar(props) {
  const {
    meetingLink,
    meetingPreparation,
    meetingName,
    meetingStartDate,
    meetingOutput,
    meetingDuration,
    meetingAgenda,
    currentTime,
    meetingId,
    firebaseDb,
  } = props;

  return (
    <div className="meeting-sidebar meeting-sidebar-font-white">
      <div className="meeting-sidebar-header">
        <MeetingSidebarName
          meetingName={meetingName}
          meetingLink={meetingLink}
          meetingId={meetingId}
          firebaseDb={firebaseDb}
        />
        <MeetingSidebarCountdown
          meetingStartDate={meetingStartDate}
          meetingDuration={meetingDuration}
          currentTime={currentTime}
        />
      </div>
      <hr />
      <div className="meeting-sidebar-content">
        <MeetingSidebarAgenda
          meetingAgenda={meetingAgenda}
          meetingId={meetingId}
          firebaseDb={firebaseDb}
        />
        <MeetingSidebarAttachments
          meetingId={meetingId}
          firebaseDb={firebaseDb}
          meetingAttachments={meetingPreparation}
        />
        <MeetingSidebarOutput
          meetingOutput={meetingOutput}
          meetingId={meetingId}
          firebaseDb={firebaseDb}
        />
      </div>
      <hr />
      <div className="meeting-sidebar-footer">
        <MeetingSidebarFooter />
      </div>
    </div>
  );
}

export default MeetingSidebar;

MeetingSidebar.propTypes = {
  meetingLink: PropTypes.string.isRequired,
  meetingName: PropTypes.string.isRequired,
  meetingStartDate: PropTypes.number.isRequired,
  meetingDuration: PropTypes.number.isRequired,
  meetingAgenda: PropTypes.instanceOf(Map).isRequired,
  meetingPreparation: PropTypes.instanceOf(Map).isRequired,
  meetingOutput: PropTypes.instanceOf(Map).isRequired,
  currentTime: PropTypes.number.isRequired,
  meetingId: PropTypes.string.isRequired,
  firebaseDb: PropTypes.instanceOf(firebase.firestore).isRequired,
};

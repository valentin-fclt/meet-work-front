import React from "react";
import PropTypes from "prop-types";
import firebase from "firebase";
import InlineEdit from "@atlaskit/inline-edit";
import Textfield from "@atlaskit/textfield";
import { GridColumn } from "@atlaskit/page";

import { CopyMeetingLinkButton } from "..";
import "./MeetingSidebarName.css";

function updateMeetingName(newName, meetingId, firebaseDb) {
  firebaseDb.collection("meetings").doc(meetingId).update({
    name: newName,
  });
}

function MeetingSidebarName(props) {
  const { meetingName, meetingId, meetingLink, firebaseDb } = props;

  return (
    <GridColumn medium={100}>
      <div>
        <InlineEdit
          hideActionButtons
          defaultValue={meetingName}
          editView={(fieldProps) => (
            <Textfield
              className="meeting-sidebar-name-edit-edit-text "
              {...fieldProps}
              autoFocus
            />
          )}
          readView={() => (
            <h1 className="meeting-sidebar-name-edit-render-text">
              {meetingName || <i>Meeting Name</i>}
            </h1>
          )}
          onConfirm={(value) => updateMeetingName(value, meetingId, firebaseDb)}
        />
      </div>

      <div className="meeting-sidebar-name-share-button">
        <CopyMeetingLinkButton meetingLink={meetingLink} />
      </div>
    </GridColumn>
  );
}

export default MeetingSidebarName;

MeetingSidebarName.propTypes = {
  meetingLink: PropTypes.string.isRequired,
  meetingName: PropTypes.string.isRequired,
  meetingId: PropTypes.string.isRequired,
  firebaseDb: PropTypes.instanceOf(firebase.firestore).isRequired,
};

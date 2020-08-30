import React, { useState } from "react";
import PropTypes from "prop-types";
import firebase from "firebase";
import { Grid, GridColumn } from "@atlaskit/page";
import Button from "@atlaskit/button";
import AddIcon from "@atlaskit/icon/glyph/add";
import FeedbackIcon from "@atlaskit/icon/glyph/feedback";

import { MeetingSidebarOutputItem, NewItemEdit } from "..";
import { MAX_MEETING_OUTPUT_ITEM_LENGTH } from "../../config";

function addOutputItem(itemName, meetingId, firebaseDb) {
  firebaseDb.collection(`meetings/${meetingId}/output`).add({
    content: itemName,
    position: 0,
  });
}

function deleteOutputItem(itemId, meetingId, firebaseDb) {
  firebaseDb.collection(`meetings/${meetingId}/output`).doc(itemId).delete();
}

function MeetingSidebarOutput(props) {
  const { meetingOutput, meetingId, firebaseDb } = props;
  const [newOutputEditOpen, setNewOutputEditOpen] = useState(false);
  const [newOutputEditText, setNewOutputEditText] = useState("");

  return (
    <div className="meeting-sidebar-subcontent">
      <GridColumn medium={100}>
        <Grid layout="fluid" spacing="cosy">
          <GridColumn medium={15}>
            <FeedbackIcon label="Meeting Output" size="medium" />
          </GridColumn>
          <GridColumn medium={70}>
            <h2>Meeting Output</h2>
          </GridColumn>
          <GridColumn medium={15}>
            <Button
              className="add-item-button"
              appearance="default"
              onClick={() => setNewOutputEditOpen(!newOutputEditOpen)}
            >
              <AddIcon label="Add item" size="small" />{" "}
            </Button>
          </GridColumn>
        </Grid>
      </GridColumn>

      {Array.from(meetingOutput.keys()).map((id) => {
        const item = meetingOutput.get(id);

        return (
          <MeetingSidebarOutputItem
            content={item.content}
            deleteFunc={() => deleteOutputItem(id, meetingId, firebaseDb)}
          />
        );
      })}

      <NewItemEdit
        show={newOutputEditOpen}
        value={newOutputEditText}
        setValue={(value) => setNewOutputEditText(value)}
        onSubmit={(value) => {
          addOutputItem(value, meetingId, firebaseDb);
        }}
        charLimit={MAX_MEETING_OUTPUT_ITEM_LENGTH}
        setShow={(bool) => setNewOutputEditOpen(bool)}
      />

      {/* <MeetingSidebarOutputRecipients /> */}
    </div>
  );
}

export default MeetingSidebarOutput;

MeetingSidebarOutput.propTypes = {
  meetingOutput: PropTypes.instanceOf(Map).isRequired,
  meetingId: PropTypes.string.isRequired,
  firebaseDb: PropTypes.instanceOf(firebase.firestore).isRequired,
};

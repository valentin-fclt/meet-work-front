import React, { useState } from "react";
import PropTypes from "prop-types";
import firebase from "firebase";
import Button from "@atlaskit/button";
import { Grid, GridColumn } from "@atlaskit/page";
import AddIcon from "@atlaskit/icon/glyph/add";
import QuestionsIcon from "@atlaskit/icon/glyph/questions";
import { MAX_MEETING_AGENDA_ITEM_LENGTH } from "../../config";

import { AgendaItem, NewItemEdit } from "..";

function addAgendaItem(itemName, meetingId, firebaseDb) {
  firebaseDb.collection(`meetings/${meetingId}/agenda`).add({
    name: itemName,
    checked: false,
    description: "",
    duration: 0,
    position: 1,
  });
}

function checkAgendaItem(itemId, checked, meetingId, firebaseDb) {
  firebaseDb.collection(`meetings/${meetingId}/agenda`).doc(itemId).update({
    checked,
  });
}

function deleteAgendaItem(itemId, meetingId, firebaseDb) {
  firebaseDb.collection(`meetings/${meetingId}/agenda`).doc(itemId).delete();
}

function MeetingSidebarAgenda(props) {
  const { meetingAgenda, meetingId, firebaseDb } = props;
  const [newAgendaEditOpen, setNewAgendaEditOpen] = useState(false);
  const [newAgendaEditText, setNewAgendaEditText] = useState("");

  return (
    <div className="meeting-sidebar-subcontent">
      <GridColumn medium={100}>
        <Grid layout="fluid" spacing="cosy">
          <GridColumn medium={15}>
            <QuestionsIcon label="Meeting Agenda" size="medium" />
          </GridColumn>
          <GridColumn medium={70}>
            <h2>Meeting Agenda</h2>
          </GridColumn>
          <GridColumn medium={15}>
            <Button
              className="add-item-button"
              onClick={() => setNewAgendaEditOpen(true)}
              appearance="default"
            >
              <AddIcon label="Add Item" size="small" />
            </Button>
          </GridColumn>
        </Grid>
      </GridColumn>

      {Array.from(meetingAgenda.keys()).map((id) => {
        const item = meetingAgenda.get(id);

        return (
          <AgendaItem
            checkBoxBlueColor
            id={id}
            key={id}
            checked={item.checked}
            duration={item.duration}
            name={item.name}
            checkFunc={(checked) =>
              checkAgendaItem(id, checked, meetingId, firebaseDb)
            }
            deleteFunc={() => {
              deleteAgendaItem(id, meetingId, firebaseDb);
            }}
          />
        );
      })}

      <NewItemEdit
        show={newAgendaEditOpen}
        value={newAgendaEditText}
        setValue={(value) => setNewAgendaEditText(value)}
        onSubmit={(value) => addAgendaItem(value, meetingId, firebaseDb)}
        charLimit={MAX_MEETING_AGENDA_ITEM_LENGTH}
        setShow={(bool) => setNewAgendaEditOpen(bool)}
      />
    </div>
  );
}

export default MeetingSidebarAgenda;

MeetingSidebarAgenda.propTypes = {
  meetingAgenda: PropTypes.instanceOf(Map).isRequired,
  meetingId: PropTypes.string.isRequired,
  firebaseDb: PropTypes.instanceOf(firebase.firestore).isRequired,
};

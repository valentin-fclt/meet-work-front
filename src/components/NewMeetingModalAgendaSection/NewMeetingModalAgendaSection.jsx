import React, { useState } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { Grid, GridColumn } from "@atlaskit/page";
import QuestionsIcon from "@atlaskit/icon/glyph/questions";
import AddCircleIcon from "@atlaskit/icon/glyph/add-circle";
import Button from "@atlaskit/button";

import "./NewMeetingModalAgendaSection.css";
import { NewItemEdit, AgendaItem } from "..";
import { MAX_MEETING_AGENDA_ITEM_LENGTH } from "../../config";

function NewMeetingModalAgendaSection(props) {
  const { meetingAgenda, onChangeMeetingAgenda } = props;

  const [newAgendaEditOpen, setNewAgendaEditOpen] = useState(false);
  const [newAgendaEditText, setNewAgendaEditText] = useState("");

  return (
    <div className="new-meeting-modal-meeting-subsection">
      <GridColumn medium={100}>
        <Grid layout="fluid" spacing="cosy">
          <GridColumn medium={10} />

          <GridColumn medium={15}>
            <QuestionsIcon label="Meeting Agenda" size="medium" />
          </GridColumn>
          <GridColumn medium={50}>
            <h2>Meeting Agenda</h2>
          </GridColumn>
          <GridColumn medium={15}>
            <Button
              className="add-item-button"
              onClick={() => setNewAgendaEditOpen(true)}
              appearance="default"
            >
              <AddCircleIcon label="Add Item" size="small" />
            </Button>
          </GridColumn>

          <GridColumn medium={10} />
        </Grid>
      </GridColumn>

      {meetingAgenda.size <= 0 && (
        <div className="new-meeting-modal-agenda-section-hint">
          What do you want to achieve in this meeting?
        </div>
      )}

      {Array.from(meetingAgenda.keys()).map((id) => {
        const item = meetingAgenda.get(id);

        return (
          <AgendaItem
            alignNameCenter
            id={id}
            key={id}
            checked={item.checked}
            duration={item.duration}
            name={item.name}
            checkFunc={() => {}}
            deleteFunc={() => {
              const newMeetingAgenda = meetingAgenda;
              newMeetingAgenda.delete(id);

              onChangeMeetingAgenda(newMeetingAgenda);
            }}
          />
        );
      })}
      <NewItemEdit
        show={newAgendaEditOpen}
        value={newAgendaEditText}
        setValue={(value) => setNewAgendaEditText(value)}
        onSubmit={(value) => {
          const newMeetingAgenda = meetingAgenda;
          newMeetingAgenda.set(uuidv4(), {
            name: value,
            checked: false,
            description: "",
            duration: 0,
            position: 1,
          });

          onChangeMeetingAgenda(newMeetingAgenda);
        }}
        charLimit={MAX_MEETING_AGENDA_ITEM_LENGTH}
        setShow={(bool) => setNewAgendaEditOpen(bool)}
      />
    </div>
  );
}

export default NewMeetingModalAgendaSection;

NewMeetingModalAgendaSection.propTypes = {
  meetingAgenda: PropTypes.instanceOf(Map).isRequired,
  onChangeMeetingAgenda: PropTypes.func.isRequired,
};

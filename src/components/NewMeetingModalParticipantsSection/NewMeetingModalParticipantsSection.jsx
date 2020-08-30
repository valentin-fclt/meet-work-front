import React from "react";
import { Grid, GridColumn } from "@atlaskit/page";
import { FormSection } from "@atlaskit/form";
import PeopleGroupIcon from "@atlaskit/icon/glyph/people-group";
import AddCircleIcon from "@atlaskit/icon/glyph/add-circle";
import Button from "@atlaskit/button";

function NewMeetingModalParticipantsSection() {
  return (
    <FormSection>
      <GridColumn medium={100}>
        <Grid layout="fluid" spacing="cosy">
          <GridColumn medium={15} />

          <GridColumn medium={15}>
            <PeopleGroupIcon label="Meeting Participants" size="medium" />
          </GridColumn>
          <GridColumn medium={40}>
            <h2>Meeting Participants</h2>
          </GridColumn>
          <GridColumn medium={15}>
            <Button
              className="add-item-button"
              onClick={() => true}
              appearance="default"
            >
              <AddCircleIcon label="Add Item" size="small" />
            </Button>
          </GridColumn>

          <GridColumn medium={15} />
        </Grid>
      </GridColumn>

      <i>Coming soon.</i>
    </FormSection>
  );
}

export default NewMeetingModalParticipantsSection;

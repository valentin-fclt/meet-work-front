import React from "react";
import { Grid, GridColumn } from "@atlaskit/page";
import DropdownMenu, {
  DropdownItemGroupCheckbox,
  DropdownItemCheckbox,
} from "@atlaskit/dropdown-menu";

import "./MeetingSidebarOutputRecipients.css";

function MeetingSidebarOutputRecipients() {
  return (
    <div className="meeting-sidebar-output-recipients-container">
      <GridColumn medium={100}>
        <Grid layout="fluid" spacing="cosy">
          <GridColumn medium={50}>
            After the meeting, send this output to:
          </GridColumn>
          <GridColumn medium={50}>
            <div className="meeting-sidebar-output-recipients-selector">
              <DropdownMenu
                isMenuFixed
                appearance="tall"
                trigger="All participants"
                triggerType="button"
              >
                <DropdownItemGroupCheckbox id="">
                  <DropdownItemCheckbox id="">
                    All participants
                  </DropdownItemCheckbox>
                </DropdownItemGroupCheckbox>
              </DropdownMenu>
            </div>
          </GridColumn>
        </Grid>
      </GridColumn>
    </div>
  );
}

export default MeetingSidebarOutputRecipients;

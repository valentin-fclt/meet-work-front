import React from "react";
import PropTypes from "prop-types";
import { Grid, GridColumn } from "@atlaskit/page";
import Button from "@atlaskit/button";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import PresenceActiveIcon from "@atlaskit/icon/glyph/presence-active";
import "./MeetingSidebarOutputItem.css";

function MeetingSidebarOutputItem(props) {
  const { content, deleteFunc } = props;

  return (
    <div className="meeting-sidebar-output-item">
      <GridColumn medium={100}>
        <Grid layout="fluid" spacing="cosy">
          <GridColumn medium={15}>
            <PresenceActiveIcon label="Output" size="small" />
          </GridColumn>
          <GridColumn medium={70}>
            <div className="meeting-sidebar-output-item-name">{content}</div>
          </GridColumn>
          <GridColumn medium={15}>
            <Button onClick={() => deleteFunc()} appearance="default">
              <TrashIcon label="Delete Item" size="small" />
            </Button>
          </GridColumn>
        </Grid>
      </GridColumn>
    </div>
  );
}

export default MeetingSidebarOutputItem;

MeetingSidebarOutputItem.propTypes = {
  content: PropTypes.string.isRequired,
  deleteFunc: PropTypes.func.isRequired,
};

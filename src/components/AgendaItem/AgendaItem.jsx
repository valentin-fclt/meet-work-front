import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from "@atlaskit/checkbox";
import { Grid, GridColumn } from "@atlaskit/page";
import Button from "@atlaskit/button";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import CheckboxIcon from "./checkCircleGlyph";

import "./AgendaItem.css";

function AgendaItem(props) {
  const {
    id,
    checked,
    name,
    deleteFunc,
    checkFunc,
    alignNameCenter,
    checkBoxBlueColor,
  } = props;

  return (
    <div className="agenda-item-container">
      <GridColumn medium={100}>
        <Grid layout="fluid" spacing="cosy">
          <GridColumn medium={15}>
            <div
              className={`item-left-icon ${
                checkBoxBlueColor ? "agenda-item-checkbox-blue" : null
              }`}
            >
              <Checkbox
                overrides={{
                  Icon: {
                    component: CheckboxIcon,
                  },
                }}
                id={id}
                isChecked={checked}
                onChange={(e) => checkFunc(e.target.checked)}
              />
            </div>
          </GridColumn>
          <GridColumn medium={70}>
            <div
              className={
                alignNameCenter
                  ? "agenda-item-name-centered"
                  : "agenda-item-name"
              }
            >
              {name}
            </div>
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

export default AgendaItem;

AgendaItem.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  deleteFunc: PropTypes.func.isRequired,
  checkFunc: PropTypes.func.isRequired,
  alignNameCenter: PropTypes.bool,
  checkBoxBlueColor: PropTypes.bool,
};

AgendaItem.defaultProps = {
  alignNameCenter: false,
  checkBoxBlueColor: false,
};

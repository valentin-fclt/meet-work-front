import React, { Component } from "react";
import PropTypes from "prop-types";
import Button, { ButtonGroup } from "@atlaskit/button";
import Textfield from "@atlaskit/textfield";
import { Grid, GridColumn } from "@atlaskit/page";
import EditorDoneIcon from "@atlaskit/icon/glyph/editor/done";
import EditorCloseIcon from "@atlaskit/icon/glyph/editor/close";

import "./NewItemEdit.css";

class NewItemEdit extends Component {
  constructor(props) {
    super(props);

    this.textFieldRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { show } = this.props;

    if (prevProps.show === false && show === true) {
      this.textFieldRef.current.focus();
    }
  }

  render() {
    const { show, value, setValue, onSubmit, charLimit, setShow } = this.props;

    return (
      <div>
        <div className={show ? "new-item-edit" : "new-item-edit-hidden"}>
          <Textfield
            ref={this.textFieldRef}
            {...this.props}
            elemAfterInput={
              <div
                className={`new-item-edit-char-limit ${
                  value.length >= charLimit ? "reached" : ""
                }`}
              >
                {charLimit - value.length}
              </div>
            }
            isInvalid={value.length > charLimit}
            onChange={(e) => {
              setValue(e.target.value);

              if (e.target.value.length > charLimit) {
                setValue(e.target.value.substring(0, charLimit));
              }
            }}
            // onBlur={() => setShow(false)}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                if (e.target.value.length > 0) {
                  onSubmit(e.target.value);
                }

                setValue("");
                setShow(false);
              } else if (e.keyCode === 27) {
                setShow(false);
              }
            }}
            value={value}
          />

          <GridColumn medium={100}>
            <Grid layout="fluid" spacing="cosy">
              <GridColumn medium={70} />
              <GridColumn medium={30}>
                <div className="new-item-edit-buttons-group">
                  <ButtonGroup appearance="default">
                    <Button
                      className="new-item-edit-button"
                      onClick={() => {
                        if (value.length > 0) {
                          onSubmit(value);
                        }

                        setValue("");
                        setShow(false);
                      }}
                      appearance="default"
                    >
                      <EditorDoneIcon label="Add Item" size="small" />
                    </Button>
                    <Button
                      className="new-item-edit-button"
                      onClick={() => setShow(false)}
                      appearance="default"
                    >
                      <EditorCloseIcon label="Cancel" size="small" />
                    </Button>
                  </ButtonGroup>
                </div>
              </GridColumn>
            </Grid>
          </GridColumn>
        </div>
      </div>
    );
  }
}

export default NewItemEdit;

NewItemEdit.propTypes = {
  show: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  charLimit: PropTypes.number.isRequired,
  setShow: PropTypes.func.isRequired,
};

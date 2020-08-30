import React from "react";
import PropTypes from "prop-types";
import { Grid, GridColumn } from "@atlaskit/page";
import Button from "@atlaskit/button";
import TrashIcon from "@atlaskit/icon/glyph/trash";

import {
  ATTACHMENT_TYPE_INTERNET_LINK,
  ATTACHMENT_TYPE_FILE_UPLOADED,
  ATTACHMENT_TYPE_FILE_UPLOADING,
} from "../../config";
import { AttachmentTypeIcon } from "..";
import "./AttachmentItem.css";

function AttachmentItem(props) {
  const {
    name,
    link,
    deleteFunc,
    type,
    uploadingProgress,
    originalName,
    alignNameCenter,
    transparentProgressBar,
  } = props;

  return (
    <div className="attachment-item-container">
      <GridColumn medium={100}>
        <Grid layout="fluid" spacing="cosy">
          <GridColumn medium={15}>
            <div className="item-left-icon">
              <AttachmentTypeIcon
                type={type}
                uploadingProgress={uploadingProgress}
                transparentProgressBar={transparentProgressBar}
              />
            </div>
          </GridColumn>
          <GridColumn medium={70}>
            <div
              className={
                alignNameCenter
                  ? "attachment-item-name-centered"
                  : "attachment-item-name"
              }
            >
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={type === ATTACHMENT_TYPE_FILE_UPLOADED}
                >
                  {originalName || name}
                </a>
              )}
              {!link && name}
            </div>
          </GridColumn>
          {deleteFunc && (
            <GridColumn medium={15}>
              <Button onClick={() => deleteFunc()} appearance="default">
                <TrashIcon label="Delete Item" size="small" />
              </Button>
            </GridColumn>
          )}
        </Grid>
      </GridColumn>
    </div>
  );
}

export default AttachmentItem;

AttachmentItem.propTypes = {
  name: PropTypes.string.isRequired,
  originalName: PropTypes.string,
  link: PropTypes.string,
  type: PropTypes.oneOf([
    ATTACHMENT_TYPE_FILE_UPLOADED,
    ATTACHMENT_TYPE_FILE_UPLOADING,
    ATTACHMENT_TYPE_INTERNET_LINK,
  ]).isRequired,
  deleteFunc: PropTypes.func,
  uploadingProgress: PropTypes.number,
  alignNameCenter: PropTypes.bool,
  transparentProgressBar: PropTypes.bool,
};

AttachmentItem.defaultProps = {
  uploadingProgress: undefined,
  deleteFunc: undefined,
  originalName: undefined,
  link: undefined,
  alignNameCenter: false,
  transparentProgressBar: false,
};

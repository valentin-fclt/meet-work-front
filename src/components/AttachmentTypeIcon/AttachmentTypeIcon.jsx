import React from "react";
import PropTypes from "prop-types";
import ProgressBar, { TransparentProgressBar } from "@atlaskit/progress-bar";
import DocumentIcon from "@atlaskit/icon/glyph/document";
import WorldIcon from "@atlaskit/icon/glyph/world";

import {
  ATTACHMENT_TYPE_FILE_UPLOADING,
  ATTACHMENT_TYPE_FILE_UPLOADED,
  ATTACHMENT_TYPE_INTERNET_LINK,
} from "../../config";

function AttachmentTypeIcon(props) {
  const { type, uploadingProgress, transparentProgressBar } = props;

  if (type === ATTACHMENT_TYPE_FILE_UPLOADING) {
    if (transparentProgressBar) {
      return <TransparentProgressBar value={uploadingProgress} />;
    }
    return <ProgressBar value={uploadingProgress} />;
  }

  if (type === ATTACHMENT_TYPE_FILE_UPLOADED) {
    return <DocumentIcon label="File" size="small" />;
  }

  if (type === ATTACHMENT_TYPE_INTERNET_LINK) {
    return <WorldIcon label="Internet link" size="small" />;
  }

  return null;
}

export default AttachmentTypeIcon;

AttachmentTypeIcon.propTypes = {
  type: PropTypes.string.isRequired,
  uploadingProgress: PropTypes.number.isRequired,
  transparentProgressBar: PropTypes.bool,
};

AttachmentTypeIcon.defaultProps = {
  transparentProgressBar: false,
};

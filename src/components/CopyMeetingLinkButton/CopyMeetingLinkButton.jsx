import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "@atlaskit/button";
import Popup from "@atlaskit/popup";
import CopyIcon from "@atlaskit/icon/glyph/copy";

import "./CopyMeetingLinkButton.css";

function CopyMeetingLinkButton(props) {
  const { meetingLink } = props;

  const [meetingLinkCopied, setMeetingLinkCopied] = useState(false);

  return (
    <Popup
      isOpen={meetingLinkCopied}
      placement="bottom"
      content={() => (
        <div className="copy-link-button-note-meeting-link">
          <b>Share with caution!</b> Anyone in possession of this link will be
          able to access the meeting.
        </div>
      )}
      trigger={(triggerProps) => (
        <Button
          {...triggerProps}
          className="copy-link-button-container"
          appearance="default"
          iconBefore={<CopyIcon label="Copy meeting link" size="medium" />}
          isDisabled={meetingLinkCopied}
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            setMeetingLinkCopied(true);
            setTimeout(() => setMeetingLinkCopied(false), 10000);
          }}
        >
          {meetingLinkCopied ? "Copied!" : "Copy meeting link"}
        </Button>
      )}
    />
  );
}

export default CopyMeetingLinkButton;

CopyMeetingLinkButton.propTypes = {
  meetingLink: PropTypes.string.isRequired,
};

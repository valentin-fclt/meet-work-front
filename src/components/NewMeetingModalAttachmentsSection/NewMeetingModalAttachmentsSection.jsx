import React, { useState, useRef } from "react";
import FileUploader from "react-firebase-file-uploader";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import firebase from "firebase";
import { Grid, GridColumn } from "@atlaskit/page";
import AttachmentIcon from "@atlaskit/icon/glyph/attachment";
import AddCircleIcon from "@atlaskit/icon/glyph/add-circle";
import Button from "@atlaskit/button";
import DocumentIcon from "@atlaskit/icon/glyph/document";
import WorldIcon from "@atlaskit/icon/glyph/world";
import Popup from "@atlaskit/popup";
import { ButtonItem } from "@atlaskit/menu";

import { AttachmentItem, NewItemEdit } from "..";
import {
  MAX_MEETING_ATTACHMENT_ITEM_INTERNET_LINK_LENGTH,
  ATTACHMENT_TYPE_INTERNET_LINK,
  ATTACHMENT_TYPE_FILE_UPLOADED,
  ATTACHMENT_TYPE_FILE_UPLOADING,
} from "../../config";
import "./NewMeetingModalAttachmentsSection.css";

function NewMeetingModalAttachmentsSection(props) {
  const { meetingAttachments, onAttachmentsChange, firebaseMeetingId } = props;

  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [fileUploadingProgress, setFileUploadingProgress] = useState(0);
  const [fileUploadingName, setFileUploadingName] = useState("");
  const [newInternetLinkEditOpen, setInternetLinkEditOpen] = useState(false);
  const [newInternetLinkEditText, setInternetLinkEditText] = useState("");

  const fileUploaderRef = useRef(null);
  const fileUploaderInputRef = useRef(null);

  return (
    <div className="new-meeting-modal-meeting-subsection">
      <GridColumn medium={100}>
        <Grid layout="fluid" spacing="cosy">
          <GridColumn medium={10} />

          <GridColumn medium={15}>
            <AttachmentIcon label="Meeting Attachments" size="medium" />
          </GridColumn>
          <GridColumn medium={50}>
            <h2>Meeting Attachments</h2>
          </GridColumn>
          <GridColumn medium={15}>
            <FileUploader
              hidden
              ref={fileUploaderRef}
              accept="*"
              className="new-meeting-modal-attachments-section-add-button"
              name="attachmentUploader"
              randomizeFilename
              storageRef={firebase
                .storage()
                .ref(`meetings/${firebaseMeetingId}/attachments`)}
              onUploadError={() => {
                setFileUploadingProgress(0);
                setIsFileUploading(false);
              }}
              onUploadStart={(file) => {
                setIsFileUploading(true);
                setFileUploadingName(file.name);
              }}
              onProgress={(progress) =>
                setFileUploadingProgress(progress / 100)
              }
              onUploadSuccess={(filename, fileUploaded) => {
                const newMeetingAttachments = meetingAttachments;

                firebase
                  .storage()
                  .ref(`meetings/${firebaseMeetingId}/attachments`)
                  .child(filename)
                  .getDownloadURL()
                  .then((url) => {
                    newMeetingAttachments.set(uuidv4(), {
                      attachmentLink: url,
                      attachmentName: filename,
                      // eslint-disable-next-line no-underscore-dangle
                      attachmentOriginalName: fileUploaded.blob_.data_.name,
                      attachmentType: ATTACHMENT_TYPE_FILE_UPLOADED,
                    });

                    onAttachmentsChange(newMeetingAttachments);
                  });

                setFileUploadingProgress(0);
                setIsFileUploading(false);
              }}
            />
            <input
              hidden
              ref={fileUploaderInputRef}
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];

                fileUploaderRef.current.startUpload(file);
                fileUploaderInputRef.current.value = null;
              }}
            />

            <Popup
              zIndex={999}
              isOpen={isAttachmentMenuOpen}
              onClose={() => setIsAttachmentMenuOpen(false)}
              content={() => (
                <div>
                  <ButtonItem
                    isDisabled={isFileUploading}
                    iconBefore={<DocumentIcon label="Add Item" size="small" />}
                    onClick={() => {
                      fileUploaderInputRef.current.click();
                      setIsAttachmentMenuOpen(false);
                    }}
                  >
                    Upload a file...
                  </ButtonItem>
                  <ButtonItem
                    iconBefore={<WorldIcon label="Add Item" size="small" />}
                    onClick={() => {
                      setIsAttachmentMenuOpen(false);
                      setInternetLinkEditOpen(true);
                    }}
                  >
                    Add an internet link...
                  </ButtonItem>
                </div>
              )}
              placement="bottom-end"
              trigger={(triggerProps) => (
                <Button
                  className="add-item-button"
                  {...triggerProps}
                  isSelected={isAttachmentMenuOpen}
                  onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                >
                  <AddCircleIcon label="Add Item" size="small" />
                </Button>
              )}
            />
          </GridColumn>
          <GridColumn medium={10} />
        </Grid>

        {meetingAttachments.size <= 0 && (
          <div className="new-meeting-modal-attachments-section-hint">
            Will the meeting&apos;s participants need access to internet links
            or documents?
          </div>
        )}

        {Array.from(meetingAttachments.keys()).map((id) => {
          const item = meetingAttachments.get(id);

          return (
            <AttachmentItem
              alignNameCenter
              key={id}
              name={item.attachmentName}
              originalName={item.attachmentOriginalName}
              link={item.attachmentLink}
              type={item.attachmentType}
              deleteFunc={() => {
                if (item.attachmentType === ATTACHMENT_TYPE_FILE_UPLOADED) {
                  firebase
                    .storage()
                    .ref(`meetings/${firebaseMeetingId}/attachments`)
                    .child(item.attachmentName)
                    .delete();
                }

                const newMeetingAttachments = meetingAttachments;
                newMeetingAttachments.delete(id);

                onAttachmentsChange(newMeetingAttachments);
              }}
            />
          );
        })}

        {isFileUploading && (
          <AttachmentItem
            name={fileUploadingName}
            type={ATTACHMENT_TYPE_FILE_UPLOADING}
            uploadingProgress={fileUploadingProgress}
          />
        )}
      </GridColumn>

      <NewItemEdit
        placeholder="https://..."
        show={newInternetLinkEditOpen}
        value={newInternetLinkEditText}
        setValue={(value) => setInternetLinkEditText(value)}
        onSubmit={(value) => {
          const link =
            value.includes("http://") || value.includes("https://")
              ? value
              : `http://${value}`;

          const newMeetingAttachments = meetingAttachments;

          newMeetingAttachments.set(uuidv4(), {
            attachmentLink: link,
            attachmentName: link,
            attachmentOriginalName: null,
            attachmentType: ATTACHMENT_TYPE_INTERNET_LINK,
          });

          onAttachmentsChange(newMeetingAttachments);
        }}
        charLimit={MAX_MEETING_ATTACHMENT_ITEM_INTERNET_LINK_LENGTH}
        setShow={(bool) => setInternetLinkEditOpen(bool)}
      />
    </div>
  );
}

export default NewMeetingModalAttachmentsSection;

NewMeetingModalAttachmentsSection.propTypes = {
  meetingAttachments: PropTypes.instanceOf(Map).isRequired,
  onAttachmentsChange: PropTypes.func.isRequired,
  firebaseMeetingId: PropTypes.string.isRequired,
};

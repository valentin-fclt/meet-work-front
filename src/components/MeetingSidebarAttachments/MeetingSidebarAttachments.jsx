import React, { useState, useRef } from "react";
import { Grid, GridColumn } from "@atlaskit/page";
import PropTypes from "prop-types";
import FileUploader from "react-firebase-file-uploader";
import firebase from "firebase";
import Button from "@atlaskit/button";
import AddIcon from "@atlaskit/icon/glyph/add";
import AttachmentIcon from "@atlaskit/icon/glyph/attachment";
import DocumentIcon from "@atlaskit/icon/glyph/document";
import WorldIcon from "@atlaskit/icon/glyph/world";
import Popup from "@atlaskit/popup";
import { ButtonItem } from "@atlaskit/menu";

import "./MeetingSidebarAttachments.css";
import { AttachmentItem, NewItemEdit } from "..";
import {
  MAX_MEETING_ATTACHMENT_ITEM_INTERNET_LINK_LENGTH,
  ATTACHMENT_TYPE_INTERNET_LINK,
  ATTACHMENT_TYPE_FILE_UPLOADED,
  ATTACHMENT_TYPE_FILE_UPLOADING,
} from "../../config";

function addPreparationItem(
  attachmentName,
  attachmentOriginalName,
  attachmentLink,
  attachmentType,
  meetingId,
  firebaseDb
) {
  firebaseDb.collection(`meetings/${meetingId}/preparation`).add({
    attachmentLink,
    attachmentName,
    attachmentOriginalName,
    attachmentType,
  });
}

function deletePreparationItem(
  itemId,
  itemName,
  attachmentType,
  meetingId,
  firebaseDb
) {
  // Delete in the database
  firebaseDb
    .collection(`meetings/${meetingId}/preparation`)
    .doc(itemId)
    .delete();

  if (attachmentType === ATTACHMENT_TYPE_FILE_UPLOADED) {
    // Delete in the storage
    firebase
      .storage()
      .ref(`meetings/${meetingId}/attachments`)
      .child(itemName)
      .delete();
  }
}

function addAttachmentLinkToFirebaseDb(
  filename,
  originalFileName,
  meetingId,
  firebaseDb
) {
  firebase
    .storage()
    .ref(`meetings/${meetingId}/attachments`)
    .child(filename)
    .getDownloadURL()
    .then((url) =>
      addPreparationItem(
        filename,
        originalFileName,
        url,
        ATTACHMENT_TYPE_FILE_UPLOADED,
        meetingId,
        firebaseDb
      )
    );
}
/**
 *
 * @todo Add the poossibility to add an external link as well!
 * @param {*} props
 * @returns
 */
function MeetingSidebarAttachments(props) {
  const { meetingAttachments, meetingId, firebaseDb } = props;
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [fileUploadingProgress, setFileUploadingProgress] = useState(0);
  const [fileUploadingName, setFileUploadingName] = useState("");
  const [newInternetLinkEditOpen, setInternetLinkEditOpen] = useState(false);
  const [newInternetLinkEditText, setInternetLinkEditText] = useState("");

  const fileUploaderRef = useRef(null);
  const fileUploaderInputRef = useRef(null);

  return (
    <div className="meeting-sidebar-subcontent">
      <GridColumn medium={100}>
        <Grid layout="fluid" spacing="cosy">
          <GridColumn medium={15}>
            <AttachmentIcon label="Meeting Attachments" size="medium" />
          </GridColumn>
          <GridColumn medium={70}>
            <h2>Meeting Attachments</h2>
          </GridColumn>
          <GridColumn medium={15}>
            <FileUploader
              hidden
              ref={fileUploaderRef}
              accept="*"
              className="meeting-sidebar-attachments-add-button"
              name="attachmentUploader"
              randomizeFilename
              storageRef={firebase
                .storage()
                .ref(`meetings/${meetingId}/attachments`)}
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
                addAttachmentLinkToFirebaseDb(
                  filename,
                  // eslint-disable-next-line no-underscore-dangle
                  fileUploaded.blob_.data_.name,
                  meetingId,
                  firebaseDb
                );
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
                  <AddIcon label="Add Item" size="small" />
                </Button>
              )}
            />
          </GridColumn>

          {Array.from(meetingAttachments.keys()).map((id) => {
            const item = meetingAttachments.get(id);

            return (
              <AttachmentItem
                key={id}
                name={item.attachmentName}
                originalName={item.attachmentOriginalName}
                link={item.attachmentLink}
                type={item.attachmentType}
                deleteFunc={() => {
                  deletePreparationItem(
                    id,
                    item.attachmentName,
                    item.attachmentType,
                    meetingId,
                    firebaseDb
                  );
                }}
              />
            );
          })}

          {isFileUploading && (
            <AttachmentItem
              transparentProgressBar
              name={fileUploadingName}
              type={ATTACHMENT_TYPE_FILE_UPLOADING}
              uploadingProgress={fileUploadingProgress}
            />
          )}
        </Grid>
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

          addPreparationItem(
            value,
            null,
            link,
            ATTACHMENT_TYPE_INTERNET_LINK,
            meetingId,
            firebaseDb
          );
        }}
        charLimit={MAX_MEETING_ATTACHMENT_ITEM_INTERNET_LINK_LENGTH}
        setShow={(bool) => setInternetLinkEditOpen(bool)}
      />
    </div>
  );
}

export default MeetingSidebarAttachments;

MeetingSidebarAttachments.propTypes = {
  meetingAttachments: PropTypes.instanceOf(Map).isRequired,
  meetingId: PropTypes.string.isRequired,
  firebaseDb: PropTypes.instanceOf(firebase.firestore).isRequired,
};

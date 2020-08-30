import React, { Component } from "react";
import firebase from "firebase";
import { key as firebaseAutoKey } from "firebase-key";
import { Redirect } from "react-router-dom";
import moment from "moment";
import { Button } from "@atlaskit/button/dist/cjs/components/Button";
import Textfield from "@atlaskit/textfield";
import { Fieldset, Field } from "@atlaskit/form";
import { Grid, GridColumn } from "@atlaskit/page";
import Modal, { ModalTransition, ModalBody } from "@atlaskit/modal-dialog";
import { DatePicker } from "@atlaskit/datetime-picker";
// import CrossIcon from "@atlaskit/icon/glyph/cross";
import CopyIcon from "@atlaskit/icon/glyph/copy";
import Select from "@atlaskit/select";

import {
  APP_ADDRESS,
  DEFAULT_LOCALE,
  MAX_MEETING_NAME_LENGTH,
  MEETING_START_TIME_NOW_VALUE,
  MEETING_START_TIME_NOW_LABEL,
  MEETING_START_TIME_ERROR_VALUE,
} from "../../config";
import {
  NewMeetingModalAgendaSection,
  NewMeetingModalAttachmentsSection,
} from "..";
import "./NewMeetingModal.css";

class NewMeetingModal extends Component {
  static generatePossibleDurations() {
    const returnArray = [];

    for (let i = 5; i <= 90; i += 5) {
      returnArray.push({
        label: `${i} minutes`,
        value: 60000 * i,
      });
    }

    return returnArray;
  }

  constructor(props) {
    super(props);

    const currentTime = moment().startOf("day").valueOf();

    this.state = {
      modalOpen: true,
      name: "",
      meetingAgenda: new Map(),
      meetingPreparation: new Map(),
      firebaseMeetingId: firebaseAutoKey(Date.now()),
      duration: { label: "15 minutes", value: 900000 },
      startDate: {
        label: new Date(currentTime).toLocaleDateString(DEFAULT_LOCALE),
        value: currentTime,
      },
      startTime: {
        label: MEETING_START_TIME_NOW_LABEL,
        value: MEETING_START_TIME_NOW_VALUE,
      },
      redirectToMeeting: null,
      possibleStartTimes: [],
      meetingLinkCopied: false,
      creatingMeeting: false,
    };

    this.meetingLinkTextRef = React.createRef();
  }

  componentDidMount() {
    const { startDate } = this.state;

    this.setState({
      possibleStartTimes: this.generatePossibleTimes(startDate.value),
    });

    // Reload possible start times every minute
    this.reloadPossibleTimesInterval = setInterval(
      () => this.generatePossibleTimes(startDate.value),
      60000
    );
  }

  componentWillUnmount() {
    clearInterval(this.reloadPossibleTimesInterval);
  }

  generatePossibleTimes(chosenDateInMilliseconds) {
    const returnArray = [];

    const { startTime } = this.state;

    const currentDate = moment().startOf("day");

    if (
      moment(chosenDateInMilliseconds).format("DD-MM-YYYY") ===
      currentDate.format("DD-MM-YYYY")
    ) {
      returnArray.push({
        label: "Now",
        value: MEETING_START_TIME_NOW_VALUE,
      });
    }

    if (moment(chosenDateInMilliseconds) >= currentDate) {
      const chosenDateIsToday =
        moment(chosenDateInMilliseconds).format("DD-MM-YYYY") ===
        currentDate.format("DD-MM-YYYY");
      const currentHour = Number.parseInt(moment().format("H"), 10);
      const currentMinute = Number.parseInt(moment().format("m"), 10);

      for (
        let hour = chosenDateIsToday ? currentHour : 0;
        hour < 24;
        hour += 1
      ) {
        for (
          let minute =
            hour === currentHour ? 15 * Math.ceil(currentMinute / 15) : 0;
          minute < 60;
          minute += 15
        ) {
          returnArray.push({
            label: `${`0${hour}`.slice(-2)}:${`0${minute}`.slice(-2)}`,
            value: 3600000 * hour + 60000 * minute,
          });
        }
      }

      this.setState({
        possibleStartTimes: returnArray,
        startTime:
          startTime.value === MEETING_START_TIME_ERROR_VALUE ||
          (startTime.value === MEETING_START_TIME_NOW_VALUE &&
            moment(chosenDateInMilliseconds) > currentDate)
            ? { label: "12:00", value: 43200000 }
            : startTime,
      });
    } else {
      returnArray.push({
        label: "You may not choose a date in the past",
        value: MEETING_START_TIME_ERROR_VALUE,
      });

      this.setState({
        possibleStartTimes: returnArray,
        startTime: {
          label: "You may not choose a start date in the past",
          value: MEETING_START_TIME_ERROR_VALUE,
        },
      });
    }

    return returnArray;
  }

  /*   generateDisabledDatesArray() {
    const returnArray = [];
    const today = moment().startOf("day");

    for (let i = 0; i < 365; i++) {
      today.subtract(1, "day");
      returnArray.push(today.toDate().toLocaleDateString(DEFAULT_LOCALE));
    }

    return returnArray;
  } */

  createMeeting() {
    const {
      firebaseMeetingId,
      name,
      duration,
      startDate,
      startTime,
      meetingAgenda,
      meetingPreparation,
    } = this.state;

    this.setState({ creatingMeeting: true });

    const firebaseDb = firebase.firestore();
    firebaseDb
      .collection(`meetings`)
      .doc(firebaseMeetingId)
      .set({
        name,
        duration: duration.value,
        startDate: new Date(
          startTime.value === MEETING_START_TIME_NOW_VALUE
            ? moment().valueOf()
            : startDate.value + startTime.value
        ),
      })
      .then(async () => {
        await Array.from(meetingAgenda.values()).forEach((value) =>
          firebaseDb
            .collection(`meetings/${firebaseMeetingId}/agenda`)
            .add(value)
        );

        await Array.from(meetingPreparation.values()).forEach((value) =>
          firebaseDb
            .collection(`meetings/${firebaseMeetingId}/preparation`)
            .add(value)
        );

        this.setState({
          redirectToMeeting: firebaseMeetingId,
        });
      })
      .catch(() => {});
  }

  canCreateMeeting() {
    const { name, startTime, startDate, duration } = this.state;

    const currentTime = moment().valueOf();

    if (startDate.value === MEETING_START_TIME_ERROR_VALUE) {
      return false;
    }

    if (
      name.length > 0 &&
      name.length <= MAX_MEETING_NAME_LENGTH &&
      (startDate.value + startTime.value > currentTime - 900000 ||
        startTime.value === MEETING_START_TIME_NOW_VALUE) &&
      duration.value >= 60000
    ) {
      return true;
    }

    return false;
  }

  render() {
    const {
      modalOpen,
      name,
      meetingAgenda,
      meetingPreparation,
      duration,
      startDate,
      startTime,
      possibleStartTimes,
      redirectToMeeting,
      firebaseMeetingId,
      meetingLinkCopied,
      creatingMeeting,
    } = this.state;

    if (redirectToMeeting) {
      return <Redirect to={`/${redirectToMeeting}`} />;
    }

    return (
      <div>
        <ModalTransition>
          {modalOpen && (
            <Modal
              header={() => (
                <div className="new-meeting-modal-header">
                  <GridColumn medium={100}>
                    <Grid layout="fluid" spacing="cosy">
                      <GridColumn medium={35}>
                        <div className="new-meeting-modal-button-close">
                          {/*                           <Button
                            iconBefore={
                              <CrossIcon label="Close" size="medium" />
                            }
                            appearance="subtle-link"
                            onClick={() => this.setState({ modalOpen: false })}
                          >
                            Close
                          </Button> */}
                        </div>
                      </GridColumn>

                      <GridColumn medium={30}>
                        <h1 className="new-meeting-modal-title">New Meeting</h1>
                      </GridColumn>
                      <GridColumn medium={35}>
                        <div className="new-meeting-modal-button-copy-meeting-link">
                          <Button
                            appearance="subtle-link"
                            iconAfter={<CopyIcon label="Copy" size="medium" />}
                            isDisabled={meetingLinkCopied}
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${APP_ADDRESS}/${firebaseMeetingId}`
                              );
                              this.setState({ meetingLinkCopied: true });
                              setTimeout(
                                () =>
                                  this.setState({ meetingLinkCopied: false }),
                                10000
                              );
                              this.setState({ meetingLinkCopied: true });
                            }}
                          >
                            {meetingLinkCopied
                              ? "Copied!"
                              : "Copy meeting link"}
                          </Button>
                          {meetingLinkCopied && (
                            <div className="new-meeting-modal-note-meeting-link">
                              <b>Share with caution!</b> Anyone in possession of
                              this link will be able to access the meeting.
                            </div>
                          )}
                        </div>
                      </GridColumn>
                    </Grid>
                  </GridColumn>
                  <Fieldset>
                    <div className="new-meeting-modal-meeting-subsection-header">
                      <Field isRequired label="Meeting Name" name="name">
                        {() => (
                          <Textfield
                            autoFocus
                            className="new-meeting-modal-name"
                            elemAfterInput={
                              <div
                                className={`new-meeting-modal-char-limit ${
                                  name.length >= MAX_MEETING_NAME_LENGTH
                                    ? "reached"
                                    : ""
                                }`}
                              >
                                {MAX_MEETING_NAME_LENGTH - name.length}
                              </div>
                            }
                            onChange={(e) => {
                              this.setState({ name: e.target.value });

                              if (
                                e.target.value.length > MAX_MEETING_NAME_LENGTH
                              ) {
                                this.setState({
                                  name: e.target.value.substring(
                                    0,
                                    MAX_MEETING_NAME_LENGTH
                                  ),
                                });
                              }
                            }}
                            value={name}
                          />
                        )}
                      </Field>
                    </div>

                    <div className="new-meeting-modal-meeting-subsection-header">
                      <Grid layout="fluid">
                        <GridColumn medium={4}>
                          <Field isRequired label="Start Date" name="date">
                            {() => (
                              <DatePicker
                                // disabled={this.generateDisabledDatesArray()}
                                placeholder="07/18/2020"
                                locale={DEFAULT_LOCALE}
                                onChange={(date) => {
                                  const newStartDateValue = moment(date)
                                    .startOf("day")
                                    .valueOf();
                                  this.setState({
                                    startDate: {
                                      label: new Date(
                                        newStartDateValue
                                      ).toLocaleDateString(DEFAULT_LOCALE),
                                      value: newStartDateValue,
                                    },
                                  });

                                  this.generatePossibleTimes(newStartDateValue);
                                }}
                                value={new Date(
                                  startDate.value
                                ).toLocaleDateString(DEFAULT_LOCALE)}
                              />
                            )}
                          </Field>
                        </GridColumn>
                        <GridColumn medium={4}>
                          <Field isRequired label="Start Time" name="time">
                            {() => (
                              <Select
                                options={possibleStartTimes}
                                value={startTime}
                                onChange={(time) =>
                                  this.setState({ startTime: time })
                                }
                              />
                            )}
                          </Field>
                        </GridColumn>
                        <GridColumn medium={4}>
                          <Field
                            isRequired
                            label="Meeting Duration"
                            name="duration"
                          >
                            {() => (
                              <>
                                <Select
                                  isRequired
                                  options={NewMeetingModal.generatePossibleDurations()}
                                  onChange={(selected) => {
                                    this.setState({
                                      duration: selected,
                                    });
                                  }}
                                  value={duration}
                                />
                                <div className="new-meeting-modal-duration-hint">
                                  (Keep it as short as possible!)
                                </div>
                              </>
                            )}
                          </Field>
                        </GridColumn>
                      </Grid>
                    </div>
                  </Fieldset>
                </div>
              )}
              height="100%"
              width="large"
              actions={[
                {
                  style: {
                    fontSize: "x-large",
                    alignSelf: "center",
                    textAlign: "center",
                  },
                  isDisabled: !this.canCreateMeeting(),
                  appearance: "primary",
                  text: "Create meeting",
                  onClick: () => this.createMeeting(),
                  isLoading: creatingMeeting,
                },
              ]}
              // onClose={() => this.setState({ modalOpen: false })}
            >
              <ModalBody className="new-meeting-modal-body">
                <NewMeetingModalAgendaSection
                  meetingAgenda={meetingAgenda}
                  onChangeMeetingAgenda={(agenda) =>
                    this.setState({ meetingAgenda: agenda })
                  }
                />

                <NewMeetingModalAttachmentsSection
                  meetingAttachments={meetingPreparation}
                  onAttachmentsChange={(attachments) =>
                    this.setState({ meetingPreparation: attachments })
                  }
                  firebaseMeetingId={firebaseMeetingId}
                />

                {/* <NewMeetingModalParticipantsSection
                            meetingParticipants={meetingParticipants}
                            onParticipantsChange={(participants) =>
                              this.setState({ meetingParticipants: participants })
                            }
                            /> */}
              </ModalBody>
            </Modal>
          )}
        </ModalTransition>

        {/*         <Button
          appearance="primary"
          onClick={() => this.setState({ modalOpen: true })}
        >
          New meeting
        </Button> */}
      </div>
    );
  }
}

export default NewMeetingModal;

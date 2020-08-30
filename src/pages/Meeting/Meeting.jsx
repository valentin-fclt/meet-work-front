import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import ReactRouterPropTypes from "react-router-prop-types";
import firebase from "firebase";
import Page, { Grid, GridColumn } from "@atlaskit/page";
import Spinner from "@atlaskit/spinner";

import {
  Countdown,
  Error,
  MeetingVideoConference,
  MeetingSidebar,
  CopyMeetingLinkButton,
} from "../../components";
import {
  APP_ADDRESS,
  MEETING_OVERTIME_ALLOWANCE,
  JITSI_HOST,
  APP_NAME,
} from "../../config";
import "./Meeting.css";

class Meeting extends Component {
  /**
   * Resize the Jitsi iFrame manually on window resize aas it's not automatically handled by the browser
   *
   * @memberof Meeting
   */
  static resizeIframe() {
    const calculatePageY = (elem) => {
      return elem.offsetParent
        ? elem.offsetTop + calculatePageY(elem.offsetParent)
        : elem.offsetTop;
    };

    let height = document.documentElement.clientHeight;
    height -= calculatePageY(document.getElementById("jitsiWindow"));
    height = height < 0 ? 0 : height;

    document.getElementById("jitsiWindow").style.height = `${height}px`;
    document.getElementById("jitsiWindow").style.width = `calc(100% + 8px)`;
  }

  constructor(props) {
    super(props);

    const { match } = props;

    this.state = {
      meetingDataFetched: false,
      meetingExists: false,
      meetingExistanceChecked: false,
      meetingId: match.params.id,
      meetingName: null,
      meetingStartDate: 0,
      meetingDuration: 0,
      meetingAgenda: new Map(),
      meetingPreparation: new Map(),
      meetingOutput: new Map(),
      meetingLink: `${APP_ADDRESS}/${match.params.id}`,
      errorBackend: null,
      videoConferenceLoaded: false,
      currentTime: Date.now(),
      firebaseDb: null,
      setupJitsi: false,
      redirectToThankYouPage: false,
    };
  }

  componentDidMount() {
    const { meetingId } = this.state;

    // Add Jitsi script to the page
    const script = document.createElement("script");
    script.src = `https://${JITSI_HOST}/external_api.js`;
    script.id = "jitsiScript";
    script.async = true;
    document.body.appendChild(script);

    // Connect to Firebase and check existance of meeting
    const firebaseDb = firebase.firestore();
    firebaseDb
      .collection("meetings")
      .doc(meetingId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({
            meetingExists: true,
            meetingExistanceChecked: true,
          });
        } else {
          throw new Error("Meeting not found");
        }
      })
      .catch((err) => {
        console.log(err);

        if (
          err.message.includes("Meeting not found") ||
          err.message.includes("Invalid hook call") ||
          err.message.includes("Minified React error")
        ) {
          this.setState({
            meetingExists: false,
            meetingExistanceChecked: true,
          });
        } else {
          this.setState({
            errorBackend: err,
            meetingExists: false,
            meetingExistanceChecked: false,
          });
        }
      });

    this.setupFirebaseListeners(firebaseDb, meetingId);

    this.setState({
      firebaseDb,
    });

    this.interval = setInterval(
      () => this.setState({ currentTime: Date.now() }),
      1000
    );
  }

  componentDidUpdate() {
    const { meetingExists, meetingId, setupJitsi } = this.state;

    if (
      meetingExists === true &&
      setupJitsi === false &&
      document.getElementById("jitsiWindow") != null &&
      document.getElementById("jitsiScript") != null &&
      window.JitsiMeetExternalAPI
    ) {
      this.setupJitsi(meetingId);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setupJitsi(meetingId) {
    this.setState({
      setupJitsi: true,
    });

    // Connect to jitsi
    const domain = JITSI_HOST;
    const options = {
      roomName: meetingId,
      width: "100%",
      height: "100%",
      parentNode: document.querySelector("#jitsiWindow"),
    };
    const jitsiAPI = new window.JitsiMeetExternalAPI(domain, options);
    jitsiAPI.addEventListener("videoConferenceJoined", () =>
      this.setState({ videoConferenceLoaded: true })
    );
    jitsiAPI.addEventListener("videoConferenceLeft", () =>
      this.setState({
        redirectToThankYouPage: true,
      })
    );
    Meeting.resizeIframe();
    window.addEventListener("resize", Meeting.resizeIframe);
  }

  setupFirebaseListeners(firebaseDb, meetingId) {
    // Meeting fields
    firebaseDb
      .collection("meetings")
      .doc(meetingId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const { name, startDate, duration } = doc.data();

          this.setState({
            meetingName: name,
            meetingStartDate: startDate.seconds * 1000,
            meetingDuration: duration,
            meetingDataFetched: true,
          });

          if (name && name.length > 0) {
            document.title = `${APP_NAME} - ${name}`;
          } else {
            document.title = `${APP_NAME}`;
          }
        }
      });

    // Meeting Agenda collection
    firebaseDb
      .collection(`meetings/${meetingId}/agenda`)
      .onSnapshot((querySnapshot) => {
        const meetingAgenda = new Map();
        querySnapshot.forEach((doc) => {
          const { checked, duration, name, position } = doc.data();
          meetingAgenda.set(doc.id, {
            checked,
            duration,
            name,
            position,
          });
        });

        this.setState({ meetingAgenda });
      });

    // Meeting Preparation collection
    firebaseDb
      .collection(`meetings/${meetingId}/preparation`)
      .onSnapshot((querySnapshot) => {
        const meetingPreparation = new Map();
        querySnapshot.forEach((doc) => {
          const {
            attachmentLink,
            attachmentName,
            attachmentOriginalName,
            attachmentType,
          } = doc.data();
          meetingPreparation.set(doc.id, {
            attachmentLink,
            attachmentOriginalName,
            attachmentName,
            attachmentType,
          });
        });

        this.setState({ meetingPreparation });
      });

    // Meeting Output collection
    firebaseDb
      .collection(`meetings/${meetingId}/output`)
      .onSnapshot((querySnapshot) => {
        const meetingOutput = new Map();
        querySnapshot.forEach((doc) => {
          const { content } = doc.data();
          meetingOutput.set(doc.id, {
            content,
          });
        });

        this.setState({ meetingOutput });
      });
  }

  render() {
    const {
      meetingDataFetched,
      meetingExists,
      meetingId,
      meetingExistanceChecked,
      meetingStartDate,
      meetingDuration,
      meetingName,
      meetingAgenda,
      meetingPreparation,
      meetingOutput,
      meetingLink,
      errorBackend,
      videoConferenceLoaded,
      currentTime,
      firebaseDb,
      redirectToThankYouPage,
    } = this.state;

    if (redirectToThankYouPage) {
      return <Redirect to="/thank-you" />;
    }

    // Meeting doesn't exist
    if (meetingExistanceChecked && !meetingExists) {
      return (
        <Page>
          <Error title="Sorry! It looks like that the meeting doesn't exist." />
        </Page>
      );
    }

    // Error back-end
    if (errorBackend) {
      return (
        <Page>
          <Error
            title={"Couldn't connect to the back-end"}
            subtitle={`Error description: ${errorBackend.message}`}
          />
        </Page>
      );
    }

    // Meeting not started yet
    if (meetingExists && meetingDataFetched && currentTime < meetingStartDate) {
      return (
        <Page>
          <Error
            title={"This meeting hasn't started yet."}
            subtitle={
              <div>
                {meetingName} will automatically start in:{" "}
                <Countdown deadline={meetingStartDate + 1} />
                <br />
                <CopyMeetingLinkButton meetingLink={meetingLink} />
              </div>
            }
          />
        </Page>
      );
    }

    // Meeting ended already
    if (
      meetingExists &&
      meetingDataFetched &&
      currentTime >
        meetingStartDate + meetingDuration + MEETING_OVERTIME_ALLOWANCE
    ) {
      return (
        <Page>
          <Error title={`${meetingName} has ended already.`} />
        </Page>
      );
    }

    // Loading, no data yet
    if (!meetingExistanceChecked) {
      return (
        <Page>
          <div className="container-centered-elements">
            <Spinner size="xlarge" />
            <h2>Loading meeting...</h2>
          </div>
        </Page>
      );
    }

    if (
      meetingDataFetched &&
      meetingExists &&
      currentTime > meetingStartDate &&
      currentTime <
        meetingStartDate + meetingDuration + MEETING_OVERTIME_ALLOWANCE
    ) {
      return (
        <Page>
          <div className="meeting-page-container-meeting-on">
            <Grid layout="fluid" spacing="compact">
              <GridColumn medium={100}>
                <Grid>
                  <GridColumn medium={75}>
                    <MeetingVideoConference
                      videoConferenceLoaded={videoConferenceLoaded}
                    />
                  </GridColumn>

                  <GridColumn medium={25}>
                    <MeetingSidebar
                      meetingLink={meetingLink}
                      meetingName={meetingName}
                      meetingStartDate={meetingStartDate}
                      meetingDuration={meetingDuration}
                      meetingAgenda={meetingAgenda}
                      meetingPreparation={meetingPreparation}
                      meetingOutput={meetingOutput}
                      currentTime={currentTime}
                      meetingId={meetingId}
                      firebaseDb={firebaseDb}
                    />
                  </GridColumn>
                </Grid>
              </GridColumn>
            </Grid>
          </div>
        </Page>
      );
    }

    return (
      <Page>
        <Error title="Unknown error while loading the meeting." />
      </Page>
    );
  }
}

export default Meeting;

Meeting.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

import React, { useState } from "react";
import Button from "@atlaskit/button";
import PropTypes from "prop-types";

import "./Error.css";
import { LANDING_ADDRESS } from "../../config";

function Error(props) {
  const { title, subtitle } = props;

  const [redirectToHome, setRedirectToHome] = useState(false);

  if (redirectToHome) {
    window.location.href = LANDING_ADDRESS;
  }

  return (
    <div className="container-centered-elements">
      <div className="error-container">
        <h1 className="error-title">{title}</h1>
        {subtitle && <h2 className="error-subtitle">{subtitle}</h2>}
        <div className="error-button">
          <Button onClick={() => setRedirectToHome(true)} appearance="primary">
            Go to the home page
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Error;

Error.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.element,
};

Error.defaultProps = {
  subtitle: <></>,
};

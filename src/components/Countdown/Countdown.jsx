import React from "react";
import PropTypes from "prop-types";
import ReactCountdown from "react-countdown";

function Countdown(props) {
  const { deadline, countdownClassName } = props;

  return (
    <ReactCountdown
      zeroPadTime={2}
      renderer={(p) => (
        <div className={countdownClassName(p)}>
          {`${p.days ? `${p.days} days, ` : ""}${
            p.hours ? `${String(`0${p.hours}`).slice(-2)}:` : ""
          }${p.minutes ? String(`0${p.minutes}`).slice(-2) : "00"}:${
            p.seconds ? String(`0${p.seconds}`).slice(-2) : "00"
          }`}
        </div>
      )}
      date={deadline}
    />
  );
}

export default Countdown;

Countdown.propTypes = {
  deadline: PropTypes.number.isRequired,
  countdownClassName: PropTypes.func,
};

Countdown.defaultProps = {
  countdownClassName: () => "",
};

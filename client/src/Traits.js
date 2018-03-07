import React from 'react';
import {Link} from 'react-router-dom';

const Traits = function(props) {
  return (
    <ul>
      <li>Organization:&nbsp;
        <Link to={{
            pathname: `/orgs/${props.task.organization}`,
            username: props.username,
          }}
        >
          {props.task.organization}
        </Link>
      </li>
      <li>Date: {props.task.date}</li>
      <li>Location: {props.task.location}</li>
      <li>Time: {props.task.time}</li>
    </ul>
  );
};

export default Traits;

import React from 'react';
import {Link} from 'react-router-dom';

const TaskListItem = props => (
  <div className="ui segment">
    <div
      className="ui raised card"
      style={{ width: '600px' }}
    >
      <div className="content">
        <div className="header">
          <Link to={{
            pathname: `/tasks/${props.task.id}`,
            username: props.username,
            }}
          >
            {props.task.title}
          </Link>
        </div>
        <div className="meta">
          <span className="category">Volunteer Opportunity</span>
        </div>
        <div className="description">
          <p>{props.task.description}</p>
        </div>
      </div>
      <div className="extra content">
          <div>
            <span>{props.task.volunteers}/{props.task.needed}</span>
          </div>
        <div className="right floated author">
          <Link to={{
            pathname: `/orgs/${props.task.organization}`,
            username: props.username,
          }}>
            <span>{props.task.organization}</span>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default TaskListItem;
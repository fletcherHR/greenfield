import React from 'react';
import TaskList from './TaskList.js';
import axios from 'axios';
import Header from './Header.js';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    };
  }

  componentWillMount() {
    console.log(this.props.match.params.username);
    axios.get(`/users/${this.props.match.params.username}`).then(data => {
      console.log('--------', data);
      function getTasks(el) {
        return axios.get(`/tasks/${el}`);
      }
      Promise.all(data.data.map(getTasks)).then(arrayOfTasks => {
        console.log('array of tasks: ', arrayOfTasks);
        var Tasks = [];
        arrayOfTasks.map(task => Tasks.push(task.data));
        console.log('----TASKS---- ', Tasks);
        this.setState({
          tasks: Tasks,
        });
      });
    });
  }

  render() {
    return (
      <div className="ui container" style={{paddingTop: '25px'}}>
        <div className="ui middle aligned center aligned grid">
          <div className="column" style={{maxWidth: '350px'}}>
            {this.state.tasks.length > 0 ? (
              <div>
                <Header className="ui header" name={this.props.match.params.username}/>
                <div style={{paddingTop: '50px'}}>
                  <TaskList tasks={this.state.tasks} />
                </div>
              </div>
            ) : (
              <div>
                <Header className="ui header" name={this.props.match.params.username}/>
                <div style={{paddingTop: '50px'}}>
                  <h2>No Tasks to Display!</h2>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;

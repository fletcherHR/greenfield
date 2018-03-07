const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('./database/models.js').db;
const {User, Task, UserTasks, Organization, UserOrg} = require('./database/models.js');
const session = require('express-session');

let app = express();

app.use(
  session({
    secret: 'team lyly',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 600000,
      secure: false,
    },
  }),
);

const isLoggedIn = function(req) {
  return req.session ? !!req.session.user : false;
};

const isAuthorized = function(req, res, next) {
  if (!isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
};

// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms as well
app.use(bodyParser.urlencoded({extended: true}));

// Declare static files
app.use(express.static(__dirname + '/../client/build'));

// ROUTES --------------------------------------------------

// Should authenticate a user, creating a session token and assigning it
// to this user.

app.post('/login', function(req, res) {
  console.log('req.body.username: ', req.body.username);
  console.log('req.body.password: ', req.body.password);
  User.find({
    where: {
      username: req.body.username,
    },
  })
    .then(e => {
      if (e && e.dataValues.password === req.body.password) {
        res.status(200).send(
          JSON.stringify({
            authenticated: true,
            username: req.body.username,
            password: req.body.password,
          }),
        );
      } else {
        console.log(`Server DID NOT FIND user ${req.body.username}`);
        res.status(401).send(
          JSON.stringify({
            authenticated: false,
            username: req.body.username,
            password: req.body.password,
          }),
        );
      }
    })
    .catch(err => {
      console.log('--------- ERROR IN USER LOGIN PROMISE ---');
      console.log(err);
    });
});

app.post('/username', function(req, res) {
  let name = req.session.user;
  res.end(name);
});

app.get('/username', function(req, res) {
  res.send(req.session.user);
})

app.get('/destroySession', function(req, res) {
  if (req.session) {
    req.session.destroy();
  } else {
    res.end();
  }
});

// TODO: Really fake. We should be checking if the session ID is valid, not if
// it exists and has any user.
app.get('/status', function(req, res) {
  if (req.session.user) {
    res.send(JSON.stringify({authenticated: true}));
  } else {
    res.send(JSON.stringify({authenticated: false}));
  }
});

app.post('/signup', function(req, res) {
  User.find({
    where: {
      username: req.body.username,
    },
  }).then(e => {
    if (e && e.dataValues.username === req.body.username) {
      res.redirect('/signup');
    } else {
      User.create({
        username: req.body.username,
        password: req.body.password,
      }).then(() => {
        res.redirect('/login');
      });
    }
  });
});

// Returns a list of all users from the database.
app.get('/users', function(req, res) {
  User.all().then(results => {
    console.log(results);
  });
});

// Returns array of Tasks ID from database by userID.
app.get('/users/:username', function(req, res) {
  User.find({
    where: {
      username: req.params.username,
    },
  }).then(data => {
    //data is object of that user with 'id' key
    UserTasks.findAll({
      where: {
        UserId: data.dataValues.id,
      },
    }).then(data => {
      // data is array of objects with property each 'TaskId'
      var arrayOfTasks = [];
      data.map(task => {
        arrayOfTasks.push(task.dataValues.TaskId);
      });
      console.log(arrayOfTasks);
      res.send(arrayOfTasks);
    });
  });
});

// Returns all tasks from the database.
app.get('/tasks', function(req, res) {
  Task.all().then(results => {
    res.send(results);
  });
});

// Expects JSON containing all information necessary to create and
// save a new task object to the database.
app.post('/tasks', function(req, res) {
  // TODO: Need UserId for Task object creation, acquired from session.
  const { title, date, description, location, time, organization, latitude, longitude, needed } = req.body;
  Task.create({
    time,
    organization,
    date,
    location,
    title,
    description,
    latitude,
    longitude,
    needed,
    volunteers: 0,
  })
    .then(
    results => {
      res.send('created');
    },
  );
});

// Returns information for a single task.
app.get('/tasks/:taskId', function(req, res) {
  Task.find({
    where: {
      id: req.params.taskId,
    },
  })
    .then(result => {
      // If task not found ...
      if (!result) {
        res.status(404).send(`Task with taskId ${req.params.taskId} not found`);
      } else {
        res.send(result);
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// Assign the :taskId task to the current user. Triggered when a user
// accepts/applies to a task.
app.post('/tasks/:taskId/accept', function(req, res) {
  console.log('--------', req.body.username);
  User.find({
    where: {
      username: req.body.username,
    },
  }).then(data => {
    console.log(data);
    var UserID = data.dataValues.id.toString();
    var TaskID = req.params.taskId.toString();
    console.log('IDS---', data.dataValues);
    UserTasks.find({
      where: {
        UserId: UserID,
        TaskId: TaskID,
      },
    }).then(data => {
      if (data === null) {
        UserTasks.create({UserId: UserID, TaskId: TaskID})
          .then(() => {
            Task.findById(TaskID)
            .then(task => {
              task.increment('volunteers', {by: 1})
            }).then(() => {
              res.send('Task is added');
            })
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  });
});


app.post('/tasks/:taskId/reject', function(req, res) {
  var UserName = req.body.username;
  var TaskID = req.params.taskId.toString();
  console.log('------', req.session.user);
  User.find({
    where: {
      username: UserName,
    },
  }).then(data => {
    UserTasks.find({
      where: {
        UserId: data.dataValues.id,
        TaskId: TaskID,
      },
    })
      .then(data => {
        console.log('about to destroy it');
        return UserTasks.destroy({
          where: {
            id: data.dataValues.id,
          },
        });
        console.log('just destroyed it');
      })
      .then(data => {
        Task.findById(TaskID)
        .then(task => {
          task.increment('volunteers', {by: -1})
        }).then(() => {
          res.send('SHOULD REDIRECT');
        })
      });
  });
});

app.post('/tasks/:taskId/delete', function(req, res) {
  var TaskID = req.params.taskId.toString();
  Task.find({
    where: {
      id: TaskID
    }
  }).then(task => {
    task.destroy()
  }).then(() => {
    res.send('DELETED');
  })
})

app.post('/orgs', function(req, res) {
  const {username, password, name, bio, site, location, contact, userUsername} = req.body;
  Organization.create({username, password, name, bio, site, location, contact}).then(
    results => {
      User.find({
        where: {
          username: userUsername
        }
      }).then(data => {
        UserOrg.create({userId: data.id, orgId: results.id});
        res.send();
      })
    },
  );
});

app.get('/orgs/user/:username', function(req, res) {
  User.find({
    where: {
      username: req.params.username
    }
  }).then(data => {
    UserOrg.findAll({
      attributes: ['orgId'],
      where: {
        userId: data.id
      }
    }).then(data2 => {
      Organization.findAll({
        where: {
          id: {
            [Op.in]: data2.map(x => x.orgId)
          }
        }
      }).then(final => {
        res.send(final);
      }).catch(err => {
        console.log('here is the error 2',err);
      });
    }).catch(err => {
      console.log('here is the error 1',err);
    });
  });
});

app.get('/orgs/tasks/:orgname', function(req, res) {
  Task.findAll({
    where: {
      organization: req.params.orgname
    }
  }).then(data => {
    res.send(data);
  }).catch(err => {
    console.log('here is the error 1',err);
  });
});

app.get('/orgs/:orgname', function(req, res) {
  Organization.find({
    where: {
      name: req.params.orgname
    }
  }).then(data => {
    console.log('dattatatatattata', data);
    res.send(data);
  }).catch(err => {
    console.log('here is the error 1',err);
  });
});

app.post('/checkDelete', function(req, res) {
  Organization.find({
    where: {
      name: req.body.organization
    }
  }).then(org => {
    UserOrg.find({
      where: {
        orgId: org.id
      }
    }).then(userorg => {
      User.find({
        where: {
          id: userorg.userId
        }
      }).then(user => {
        (user.username === req.body.username)
        ? res.send(true)
        : res.send(false)
      })
    })
  })
})

let port = process.env.PORT || 3001;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

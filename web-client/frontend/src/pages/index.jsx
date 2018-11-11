import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

// page components
import StudentComponent from '../components/student.component'
import TeacherComponent from '../components/teacher.component'
import StudentAccount from '../components/studentAccount.component'


// Index component
class Index extends Component {
  render() {
    return (
      <div>
        <Router>
          <div>
            <Route path='/student/0/courses/' component={StudentComponent} />
            <Route path='/student/0/account/' component={StudentAccount} />
            <Route path='/student/0/unlock-tutorial/' component={StudentAccount} />
            <Route path='/teacher/1/students' component={TeacherComponent} />
          </div>
        </Router>
      </div>
    );
  }

}

export default Index;

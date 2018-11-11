import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

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
            <Route path='/student/courses/' component={StudentComponent} />
            <Route path='/teacher/students' component={TeacherComponent} />
            <Route path='/student/account/' component={StudentAccount} />
          </div>
        </Router>
      </div>
    );
  }

}

export default Index;

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import ViewProject from './components/ViewProject';
import ViewTask from './components/ViewTask';

function App() {

  const [refreshProjectList, setRefreshProjectList] = useState(false);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/project/:projectId" element={<ViewProject />} />
          <Route path="/task/:taskId" element={<ViewTask />} />
          <Route path="/" element={
            <>
              <ProjectForm onProjectAdded={() => setRefreshProjectList(true)} />
              <ProjectList shouldRefresh={refreshProjectList} onRefreshed={() => setRefreshProjectList(false)} />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RecordPage from "./pages/record-page";
import ListenPage from "./pages/listen-page";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <RecordPage />
        </Route>
        <Route path="/audio/:id" exact component={ListenPage}></Route>
      </Switch>
    </Router>
  );
}

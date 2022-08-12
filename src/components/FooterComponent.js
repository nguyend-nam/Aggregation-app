import React, { Component } from "react";

export default class OrgReposComponent extends Component {
  state = {

  };

  render() {
    return (
      <div className="ftr">
        <div>&copy; 2022 Nam Nguyen Dinh</div>
        <div>
          <div>
            <div>API:</div>
            <ul>
              <li><a href="https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api" target="_blank">Get started</a></li>
              <li><a href="https://docs.github.com/en/rest/reference/repos" target="_blank">API docs</a></li>
            </ul>
          </div>
          <div>
            <div>This site:</div>
            <ul>
              <li><a href="https://github.com/NguyenD-Nam/Aggregation-app" target="_blank">GitHub repository</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

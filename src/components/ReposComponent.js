import React, {Component} from "react";

export default class UserReposComponent extends Component {
  state = {
    loading: true,
    totalorg: [], // for storing all repos
    org: [] // for rendering repos that fit sort criterion
  };

  // Lifecycle functions
  componentDidUpdate(prevProps){
    if (prevProps.name !== this.props.name) {
      this.fetchorg();
    }
    else if ((prevProps.name === this.props.name && prevProps.sort !== this.props.sort)) {
      this.sortRepos();
    }
  }

  async getReposCount(userName) {
    const resp = await fetch('https://api.github.com/users/' + userName);
    if (resp.ok) {
        const data = await resp.json();
        return data.public_repos;
    }
}

  // Firstly fetch API endpoint for users
  async fetchorg() {
    let apilist = [];
    let idlist = new Set();
    let trimList = this.props.name.split(' ').join('');
    const namelist = trimList.split(",");
    let found = false;
    for(let i=0; i<namelist.length; i++){
      const reposCount = await this.getReposCount(namelist[i])
      for(let j=1; j<=reposCount; j++){
        await fetch('https://api.github.com/users/' + namelist[i] + '/repos?page=' + j + '&per_page=100')
        .then(function(resp) {
          if (resp.ok) {
            found = true;
            return resp.json();
          }
          throw new Error('Something went wrong');
          // return resp.json()
        }) // Convert data to json
        .then(
          data => {
            if(data["message"] != "Not Found"){
              for(let k=0; k<data.length; k++){
                // apilist.push(data[k])
                if(idlist.has(data[k]["id"])) continue;
                else{
                  // apilist = apilist.concat(data);
                  apilist.push(data[k])
                  idlist.add(data[k]["id"]);
                }
              }
            }
          }
        )
        .catch((error) => { console.log(error) });
        // If no users found start fetching API endpoint for organizations
        if(found == false){
          await fetch('https://api.github.com/orgs/' + namelist[i] + '/repos')
          .then(function(resp) {
            if (resp.ok) {
              return resp.json();
            }
            // throw new Error('Something went wrong');
            // return resp.json()
          }) // Convert data to json
          .then(
            data => {
              if(data["message"] != "Not Found"){
                for(let k=0; k<data.length; k++){
                  // apilist.push(data[k])
                  if(idlist.has(data[k]["id"])) continue;
                  else{
                    // apilist = apilist.concat(data);
                    apilist.push(data[k])
                    idlist.add(data[k]["id"]);
                  }
                }
              }
            }
          )
          .catch((error) => { console.log(error) });
        }
      }
    }

    this.setState({
      totalorg: apilist,
      loading: false
    })
    if(this.props.sort == "stars"){
      let n = apilist.length;
      for (let i = 1; i < n; i++) {
          let current = apilist[i];
          let j = i-1;
          while ((j > -1) && (current["stargazers_count"] > apilist[j]["stargazers_count"])) {
              apilist[j+1] = apilist[j];
              j--;
          }
          apilist[j+1] = current;
      }
    }
    if(this.props.sort == "popular"){
      let n = apilist.length;
      for (let i = 1; i < n; i++) {
          let current = apilist[i];
          let j = i-1;
          while ((j > -1) && (
            (current["stargazers_count"] + current["forks_count"] + current["watchers_count"]) > (apilist[j]["stargazers_count"] + apilist[j]["forks_count"] + apilist[j]["watchers_count"]))
          ) {
              apilist[j+1] = apilist[j];
              j--;
          }
          apilist[j+1] = current;
      }
    }
    this.setState({
      org: apilist
    })

    let newapilist = [];
    if(this.props.sort == "original"){
      let n = apilist.length;
      for (let i = 0; i < n; i++) {
          let current = apilist[i];
          if(current["fork"] === false) newapilist.push(current);
      }
      let m = newapilist.length;
      for (let i = 1; i < m; i++) {
          let current = newapilist[i];
          let j = i-1;
          while ((j > -1) && (
            (current["stargazers_count"] + current["forks_count"] + current["watchers_count"]) > (newapilist[j]["stargazers_count"] + newapilist[j]["forks_count"] + newapilist[j]["watchers_count"]))
          ) {
              newapilist[j+1] = newapilist[j];
              j--;
          }
          newapilist[j+1] = current;
      }
      this.setState({
        org: newapilist
      })
    }
  }

  sortRepos(){
    let apilist = this.state.totalorg;
    if(this.props.sort == "stars"){
      let n = apilist.length;
      for (let i = 1; i < n; i++) {
          let current = apilist[i];
          let j = i-1;
          while ((j > -1) && (current["stargazers_count"] > apilist[j]["stargazers_count"])) {
              apilist[j+1] = apilist[j];
              j--;
          }
          apilist[j+1] = current;
      }
    }
    if(this.props.sort == "popular"){
      let n = apilist.length;
      for (let i = 1; i < n; i++) {
          let current = apilist[i];
          let j = i-1;
          while ((j > -1) && (
            (current["stargazers_count"] + current["forks_count"] + current["watchers_count"]) > (apilist[j]["stargazers_count"] + apilist[j]["forks_count"] + apilist[j]["watchers_count"]))
          ) {
              apilist[j+1] = apilist[j];
              j--;
          }
          apilist[j+1] = current;
      }
    }
    this.setState({
      org: apilist
    })

    let newapilist = [];
    if(this.props.sort == "original"){
      let n = apilist.length;
      for (let i = 0; i < n; i++) {
          let current = apilist[i];
          if(current["fork"] === false) newapilist.push(current);
      }
      let m = newapilist.length;
      for (let i = 1; i < m; i++) {
          let current = newapilist[i];
          let j = i-1;
          while ((j > -1) && (
            (current["stargazers_count"] + current["forks_count"] + current["watchers_count"]) > (newapilist[j]["stargazers_count"] + newapilist[j]["forks_count"] + newapilist[j]["watchers_count"]))
          ) {
              newapilist[j+1] = newapilist[j];
              j--;
          }
          newapilist[j+1] = current;
      }
      this.setState({
        org: newapilist
      })
    }
  }


  render() {
    if (this.state.loading) {
      return (
        <div className="startpage">
          <img src="icons.png" height="45px" width="45px" alt="Aggregation App" /><h2></h2>
        </div>
      );
    }

    var orgs;
    if(this.state.org !== undefined){
      orgs = this.state.org.map((org) => {
        var owner = org["owner"]["login"];
        var reponame = org["name"];
        var description = org["description"];
        var visibility = org["visibility"];
        var url = org["html_url"];
        var language = "--";
        if(org["language"] != null) language = org["language"];
        var stars = org["stargazers_count"];
        var forks = org["forks_count"];
        var watchs = org["watchers_count"];
        var isFork = org["fork"];
        var type = org["owner"]["type"];
        var issues = org["open_issues"];
        var avatar = org["owner"]["avatar_url"];

        return(
          <div key={org["id"]} className="repo-item">
            <div className="repo-title">
              <img src={avatar}/>
              <h3><a href={url} target="_blank">{owner}/{reponame}</a></h3>
              <span>{visibility}</span>
            </div>
            <div className="modal">
              <div>{(description == null)? "--":description}</div>
              <div>
                <div>
                  <div><i className="fas fa-user"></i> {type}</div>
                  <div><i className="fas fa-star"></i> {stars}</div>
                  <div><i className="fas fa-code-branch"></i> {forks}</div>
                </div>
                <div>
                  <div><i className="fas fa-code"></i> {language}</div>
                  <div><i className="fas fa-eye"></i> {watchs}</div>
                  <div><i className="fas fa-dot-circle"></i> {issues}</div>
                </div>
              </div>
            </div>
            <div className="repo-description">{(description == null)? "--":description}</div>
            <div className="repo-overview">
              <div><i className="fas fa-code"></i> {language}</div>
              <div><i className="fas fa-star"></i> {stars}</div>
              <div><i className="fas fa-code-branch"></i> {forks}</div>
            </div>
          </div>
        );
      });

      return (
        <div className="repo-content">
          {orgs}
        </div>
      );
    }
  }
}

import React, { Component, useState } from 'react';
import OrgRepos from './ReposComponent';
import Footer from './FooterComponent';

function Main(){

  const [buffer, setBuffer] = useState('');
  const [inputval, setInputValue] = useState('');
  const [sortcriteria, setSortcriteria] = useState('stars');
  const [isLoading, setIsLoading] = useState(false);

  const updateInputValue = (evnt) => {
    const val = evnt.target.value;
    setBuffer(val);
  }
  const handleSubmit = () => {
    if(buffer != ""){
      setInputValue(buffer);
      console.log(buffer);
      // console.log('Your input value is: ' + this.state.buffer);
    }
  }
  const onKeyDown = (key) => {
    if(key.charCode === 13) {
      setIsLoading(true)
      handleSubmit();
    }
  };

  return(
  <>
    <div id="top"/>
    <div className="header" id="header">
      <div className="line"/>
      <div className="title">
        <a href="/"><img src="icons.png" height="55px" width="55px" alt="Aggregation App" />
        <h1>Aggregation App</h1></a>
        {/*<h1>{sortcriteria}</h1>*/}
      </div>

      <div className="searchbar">
        <div>
            <input required={true} className="input" id="name" type="text" placeholder="octocat, dwarvesf, etc."
                onInput={updateInputValue}
                onKeyPress={onKeyDown}/>
            <button onClick={handleSubmit} className="ml-md-1"><i className="fas fa-search"></i></button>
        </div>
      </div>

    </div>
    <div className="sortbar">
      <div>
        <button onClick={() => setSortcriteria('stars')} className="ml-md-1">Stars</button>
        <button onClick={() => setSortcriteria('popular')} className="ml-md-1">Popular</button>
        <button onClick={() => setSortcriteria('original')} className="ml-md-1">Original</button>
      </div>
      <div className="sortinfo">
        Current sort criterion: <span className="sortcrit">{sortcriteria.toUpperCase()}</span><br/><span>{(sortcriteria == "stars")?"All repositories are ranked base on total stars count.":(sortcriteria == "popular")?"All repositories are ranked base on sum of stars, watchers and forks count.":"Repositories (excluding forks) are ranked base on sum of stars, watchers and forks count."}</span>
      </div>
    </div>
    <div className="content">
      <OrgRepos name={inputval} sort={sortcriteria} loading={isLoading} setLoading={setIsLoading} />
      <div className="intro">Input existing GitHub usernames and/or organization names into search bar to view repositories.<br/>
      If you want to search for <b>multiple</b> names, separate each of them by <b>comma</b>.</div>
    </div>

    <a className="scrollup" id="scrollup" href="#top">&#8248;</a>
    <Footer />
  </>
  );
}

export default Main;

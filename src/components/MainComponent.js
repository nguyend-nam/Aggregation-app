import React, { Component, useState, useRef, useCallback, useEffect } from 'react';
import OrgRepos from './ReposComponent';
import Footer from './FooterComponent';

function Main() {
  const searchInputRef = useRef(null)
  const [buffer, setBuffer] = useState('');
  const [inputval, setInputValue] = useState('');
  const [sortcriteria, setSortcriteria] = useState('stars');
  const [isLoading, setIsLoading] = useState(false);

  const updateInputValue = (evnt) => {
    const val = evnt.target.value;
    setBuffer(val);
  }
  const handleSubmit = () => {
    if (buffer != "") {
      setIsLoading(true)
      setInputValue(buffer);
      console.log(buffer);
      // console.log('Your input value is: ' + this.state.buffer);
    }
  }
  const onKeyDown = (key) => {
    if (key.charCode === 13) {
      handleSubmit();
    }
  };

  const slashFunction = useCallback((event) => {
    if (event.key === "/") {
      searchInputRef.current.focus()
      searchInputRef.current.value = searchInputRef.current.value.slice(0, -1)
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", slashFunction, false);

    return () => {
      document.removeEventListener("keydown", slashFunction, false);
    };
  }, []);

  return (
    <>
      <div id="top" />
      <div className="header" id="header">
        <div className="line" />
        <div className="title">
          <a href="/"><img src="icons.png" height="55px" width="55px" alt="Aggregation App" />
            <h1>Aggregation App</h1></a>
          {/*<h1>{sortcriteria}</h1>*/}
        </div>

        <div className="searchbar">
          <div>
            <input ref={searchInputRef} required={true} className="input" id="name" type="text" placeholder="octocat, dwarvesf, etc."
              onInput={updateInputValue}
              onKeyPress={onKeyDown} />
            <code style={{
              height: 'max-content',
              padding: '3px',
              border: '1px solid #00000028',
              backgroundColor: '#00000008',
              borderRadius: '5px',
              color: '#0005',
            }}>/</code>
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
          Current sort criterion: <span className="sortcrit">{sortcriteria.toUpperCase()}</span><br /><span>{(sortcriteria == "stars") ? "All repositories are ranked base on total stars count." : (sortcriteria == "popular") ? "All repositories are ranked base on sum of stars, watchers and forks count." : "Repositories (excluding forks) are ranked base on sum of stars, watchers and forks count."}</span>
        </div>
      </div>
      <div className="content">
        <OrgRepos name={inputval} sort={sortcriteria} loading={isLoading} setLoading={setIsLoading} />
        <div className="intro">Input existing GitHub usernames and/or organization names into search bar to view repositories.<br />
          If you want to search for <b>multiple</b> names, separate each of them by <b>comma</b>.</div>
      </div>

      <a className="scrollup" id="scrollup" href="#top"><i className="fas fa-long-arrow-alt-up"></i></a>
      <Footer />
    </>
  );
}

export default Main;

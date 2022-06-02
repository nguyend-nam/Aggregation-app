let input = document.getElementById('input');
let reposContainer = document.getElementById('repos_container');
let sortDetails = document.getElementById('sort_details');
let curInputVal = '';
let repoList = [];
let displayedRepoList = [];
let repoIds = new Set();
let curSortCriteria = 'stars';

function setSortCriteria(criteria) {
    if(criteria != curSortCriteria) {
        curSortCriteria = criteria;
        let sortInfo = document.createElement('b');
        sortInfo.innerText = curSortCriteria[0].toUpperCase() + curSortCriteria.slice(1);
    
        sortDetails.innerHTML = '';
        sortDetails.append(sortInfo);
        
        reposContainer.innerHTML = '';
        showRepos();
    }
}

/* Process input data on Enter */
input.addEventListener('keypress', function(event) {
    if(event.key == 'Enter'){
        getInputVal();
    }
});

function getInputVal() {
    if(input.value != '' && input.value != curInputVal){
        console.log(input.value);
        repoList = [];
        repoIds.clear();
        curInputVal = input.value;
        fetchAPI(input.value);
    }
}

async function fetchAPI(name) {
    let found = false;
    let li = name.split(' ').join('');
    const nameList = li.split(',');
    reposContainer.innerText = '';
    for(let i=0; i<nameList.length; i++){

    	await fetch('https://api.github.com/users/' + nameList[i] + '/repos')
    	.then((resp) => {
            if (resp.ok) {
                found = true;
                return resp.json();
            }
        }) // Convert data to json
        .then((data) => {
            if(!("message" in data) && data["message"] != "Not Found"){
                for(let k=0; k<data.length; k++){
                    // apilist.push(data[k])
                    if(repoIds.has(data[k]["id"])) continue;
                    else{
                        // apilist = apilist.concat(data);
                        repoList.push(data[k])
                        repoIds.add(data[k]["id"]);
                    }
                }
            }
        })
        .catch((error) => { console.log(error) });
        
        // If no users found start fetching API endpoint for organizations
        if(found == false){
            await fetch('https://api.github.com/orgs/' + nameList[i] + '/repos')
            .then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                
            }) // Convert data to json
            .then((data) => {
                if(!("message" in data) && data["message"] != "Not Found"){
                    for(let k=0; k<data.length; k++){
                    // apilist.push(data[k])
                        if(repoIds.has(data[k]["id"])) continue;
                        else{
                            // apilist = apilist.concat(data);
                            repoList.push(data[k])
                            repoIds.add(data[k]["id"]);
                        }
                    }
                }
            })
            .catch((error) => { console.log(error) });
        }
    }
    showRepos();
}

function showRepos() {
    
    displayedRepoList = repoList;
    
    /* Sort repoList */
    if(curSortCriteria == 'stars') {
        displayedRepoList.sort((b, a) => a.stargazers_count - b.stargazers_count);
    }
    else if(curSortCriteria == 'popular') {
        displayedRepoList.sort(
            (b, a) => (a.stargazers_count + a.forks_count + a.watchers_count) - (b.stargazers_count + b.forks_count + b.watchers_count)
        );
    }
    else if(curSortCriteria == 'original') {
        displayedRepoList = [];
        for(let k=0; k<repoList.length; k++) {
            if(repoList[k].fork == false){
                displayedRepoList.push(repoList[k]);
            }
        }
        displayedRepoList.sort(
            (b, a) => (a.stargazers_count + a.forks_count + a.watchers_count) - (b.stargazers_count + b.forks_count + b.watchers_count)
        );
    }
    
    let fragment = new DocumentFragment();
    for(let i=0; i<displayedRepoList.length; i++){
        
        /* Create repo card */
        let repoItem = document.createElement('div');
        repoItem.classList.add('repo__card');
        
        /* Delete button */
        let delButton = document.createElement('button');
        delButton.innerText = 'X';
        delButton.onclick = () => {
            delButton.parentNode.style.maxHeight = '0';
            delButton.parentNode.style.margin = '0';
            delButton.parentNode.style.padding = '0 10px';
            
        }
        
        /* Title of repo card */
        let repoTitle = document.createElement('a');
        repoTitle.href = displayedRepoList[i].html_url;
        repoTitle.target = '_blank';
        repoTitle.innerText = displayedRepoList[i].full_name;
        
        /* Details of repo */
        let starsCount = document.createElement('div');
        starsCount.innerText = displayedRepoList[i].stargazers_count;
        let language = document.createElement('div');
        language.innerText = (displayedRepoList[i].language == null)?'--':displayedRepoList[i].language;
        let forksCount = document.createElement('div');
        forksCount.innerText = displayedRepoList[i].forks_count;
        
        let repoDetails = document.createElement('div');
        repoDetails.classList.add('repo__details');
        repoDetails.append(starsCount, language, forksCount);
        
        /* Avater of repo owner */
        let repoAvatar = document.createElement('img');
        repoAvatar.src = displayedRepoList[i].owner.avatar_url;
        
        let repoItemLeft = document.createElement('div');
        repoItemLeft.append(repoTitle);
        repoItemLeft.append(repoDetails);
        
        repoItem.append(repoItemLeft);
        repoItem.append(repoAvatar);
        repoItem.append(delButton);
        fragment.append(repoItem);
        
    }
    reposContainer.append(fragment);
}

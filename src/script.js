let input = document.getElementById('input');
let reposContainer = document.getElementById('repos_container');
let sortDetails = document.getElementById('sort_details');
let curInputVal = '';
let repoList = [];
let repoIds = new Set();
let curSortCriteria = 'stars';

function setSortCriteria(criteria) {
    if(criteria != curSortCriteria) {
        curSortCriteria = criteria;
        let sortInfo = document.createElement('b');
        sortInfo.innerText = curSortCriteria[0].toUpperCase() + curSortCriteria.slice(1);
    
        sortDetails.innerHTML = '';
        sortDetails.append(sortInfo);
        if(repoList.length != 0){
            reposContainer.innerText = '';
            showRepos();
        }
    }
}

/* Process input data on Enter */
input.addEventListener('keypress', function(event) {
    if(event.key == 'Enter'){
        console.log(input.value);
        if(input.value != '' && input.value != curInputVal){
            repoList = [];
            repoIds.clear();
            curInputVal = input.value;
            fetchAPI(input.value);
        }
    }
});

function getInputVal() {
    if(input.value != '' && input.value != curInputVal){
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
    	.then(function(resp) {
            if (resp.ok) {
                found = true;
                return resp.json();
            }
            throw new Error('Something went wrong');
            
        }) // Convert data to json
        .then(
            data => {
                if(data["message"] != "Not Found"){
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
            }
    	)
        .catch((error) => { console.log(error) });
        // If no users found start fetching API endpoint for organizations
        if(found == false){
            await fetch('https://api.github.com/orgs/' + nameList[i] + '/repos')
            .then(function(resp) {
                if (resp.ok) {
                    return resp.json();
                }
                
            }) // Convert data to json
            .then(
                data => {
                if(data["message"] != "Not Found"){
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
    let fragment = new DocumentFragment();
    for(let i=0; i<repoList.length; i++){
        fragment.append(repoList[i].full_name);
        fragment.append(document.createElement('br'));
    }
    reposContainer.append(fragment);
}

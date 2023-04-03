//Global variables
const baseURL = "http://localhost:3000";
const basePath = "/dogs";


//This is the code that runs.
document.addEventListener('DOMContentLoaded', () => {
  main();
})


//Main execution function that runs when the DOM content loads.
function main(){
  renderPage();
  addEventListenerOnForm();
}


/******************************************************/
/* Functions that add event listeners to DOM elements */
/******************************************************/
function addEventListenerOnForm(){
  document.querySelector("#dog-form").addEventListener("submit", submitHandler);
}


/**************************************************/
/* Function Handlers that act on triggered events */
/**************************************************/
function editHandler(dog){
  const form = document.querySelector("#dog-form");

  form.name.value  = dog.name;   
  form.breed.value = dog.breed; 
  form.sex.value   = dog.sex;     
  form.dataset.id  = dog.id;
  console.log("Data entry id: ", form.dataset.id);
}


function submitHandler(event){
   event.preventDefault();

   console.log(event.target.dataset.id)
    if (event.target.dataset.id){
      let dog = {
        id : event.target.dataset.id,
        name: event.target.name.value,
        breed: event.target.breed.value,
        sex: event.target.sex.value
      };

      patchServer(dog);
      const recordToUpdate = document.querySelector(`#singleRecord${dog.id}`);
      recordToUpdate.querySelector(`#td1${dog.id}`).textContent = dog.name;
      recordToUpdate.querySelector(`#td2${dog.id}`).textContent = dog.breed;
      recordToUpdate.querySelector(`#td3${dog.id}`).textContent = dog.sex;
      
    } else {
      let dog = {
        name: event.target.name.value,
        breed: event.target.breed.value,
        sex: event.target.sex.value
      };

      updateServer(dog);
      renderOneDog(dog);
    }
  }


/*************************************************************/
/* Functions that render the information by DOM manipulation */
/*************************************************************/
function renderOneDog(dog){
  let singleRecord = document.createElement("tr");

  let editButtonTableData = document.createElement("td");
  let editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.id = dog["id"];

  editButton.addEventListener("click", () => editHandler(dog));

  editButtonTableData.appendChild(editButton);

  singleRecord.innerHTML = `
                             <td id="td1${dog.id}">${dog["name"]}</td>
                             <td id="td2${dog.id}">${dog["breed"]}</td>
                             <td id="td3${dog.id}">${dog["sex"]}</td>
                           `
  singleRecord.id = `singleRecord${dog["id"]}`;
  singleRecord.appendChild(editButtonTableData);


  document.querySelector("#table-body").appendChild(singleRecord);
}


/***************************************************/
/*   Functions that communicate with the server.   */
/***************************************************/
function renderPage(){

  const destinationURL = baseURL + basePath;
  fetch(destinationURL, {method: "GET"}).then((response) => response.json()).then((dogs) => {
    dogs.forEach((dog) => renderOneDog(dog));
  })

}


function updateServer(dog){

  const destinationURL = baseURL + basePath;
  
  fetch(destinationURL, {
    method: "POST",
    headers: {"Content-Type": "application/json",
              "Accept": "application/json"
             },
    body: JSON.stringify(dog) 
  })
  .then((response) => response.json()).then((dog) => {
    console.log(dog);
  })
  .catch((error) => console.error(error));
}


function patchServer(dog){
  const destinationURL = baseURL + basePath;
  
  fetch(destinationURL + `/${dog.id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json",
              "Accept": "application/json"
             },
    body: JSON.stringify(dog) 
  })
  .then((response) => response.json()).then((dog) => {
    console.log(dog);
  })
  .catch((error) => console.error(error));
}
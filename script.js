const listings = [

{
title:"Retail Associate",
location:"Mississauga",
minAge:16,
type:"job",
description:"Help customers, organize products, and gain retail experience.",
tags:[
"no experience needed",
"walk-in friendly"
]
},


{
title:"Library Assistant",
location:"Mississauga",
minAge:15,
type:"job",
description:"Organize books and assist community programs.",
tags:[
"after school",
"flexible hours"
]
},


{
title:"Food Bank Volunteer",
location:"Mississauga",
minAge:14,
type:"volunteer",
description:"Support food sorting and community programs.",
tags:[
"community impact",
"service hours"
]
},


{
title:"Community Centre Helper",
location:"Mississauga",
minAge:14,
type:"volunteer",
description:"Help run activities and events for residents.",
tags:[
"volunteer hours",
"leadership"
]
}


];



const searchInput=document.getElementById("search-input");

const locationFilter=document.getElementById("location-filter");

const ageFilter=document.getElementById("age-filter");

const typeFilter=document.getElementById("type-filter");

const tagFilter=document.getElementById("tag-filter");


const homeResults=document.getElementById("home-results");

const jobsResults=document.getElementById("jobs-results");

const volunteerResults=document.getElementById("volunteer-results");





function setupFilters(){


[...new Set(listings.map(x=>x.location))]
.forEach(location=>{

let option=document.createElement("option");

option.value=location;

option.textContent=location;

locationFilter.appendChild(option);

});



[...new Set(listings.flatMap(x=>x.tags))]
.forEach(tag=>{


let option=document.createElement("option");

option.value=tag;

option.textContent=tag;

tagFilter.appendChild(option);


});


}







function card(item){

return `

<div class="card">

<h3>${item.title}</h3>

<p>
📍 ${item.location}
</p>

<p>
Age: ${item.minAge}+
</p>


<p>
${item.description}
</p>


<div class="tags">

${item.tags.map(tag=>`

<span class="tag">
${tag}
</span>

`).join("")}

</div>


</div>

`;

}





function filterListings(){


let search=searchInput.value.toLowerCase();


return listings.filter(item=>{


return (

item.title.toLowerCase().includes(search)

||

item.description.toLowerCase().includes(search)

)

&&

(!locationFilter.value ||
item.location===locationFilter.value)

&&

(!ageFilter.value ||
item.minAge<=Number(ageFilter.value))

&&

(!typeFilter.value ||
item.type===typeFilter.value)

&&

(!tagFilter.value ||
item.tags.includes(tagFilter.value))


});


}





function render(){


let filtered=filterListings();


homeResults.innerHTML=
filtered.map(card).join("");



jobsResults.innerHTML=
filtered
.filter(x=>x.type==="job")
.map(card)
.join("");



volunteerResults.innerHTML=
filtered
.filter(x=>x.type==="volunteer")
.map(card)
.join("");



}






function navigation(){


document.querySelectorAll(".nav-btn")
.forEach(button=>{


button.onclick=()=>{


document.querySelectorAll(".nav-btn")
.forEach(btn=>btn.classList.remove("active"));


button.classList.add("active");



document.querySelectorAll(".page")
.forEach(page=>page.classList.remove("active"));



document
.getElementById(button.dataset.page+"-page")
.classList.add("active");

};


});


}







function tracker(){


const input=document.getElementById("hours-input");

const button=document.getElementById("update-hours");

const bar=document.getElementById("hours-progress");

const text=document.getElementById("hours-text");



button.onclick=()=>{


let hours=Number(input.value)||0;


let percent=Math.min((hours/40)*100,100);


bar.style.width=
percent+"%";


text.textContent=
`${hours}/40 hours completed`;


};


}






[
searchInput,
locationFilter,
ageFilter,
typeFilter,
tagFilter

]
.forEach(element=>{

element.addEventListener("input",render);

});



setupFilters();

navigation();

tracker();

render();

const $completeBy = $("#complete-by");
const $priority = $("#priority");   
let complete_by = $completeBy.val();
let priority = $priority.val();  


function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  $completeBy.change(() => {
    complete_by = $completeBy.val();
    console.log(complete_by)
})
$priority.change(() => {
    priority = $priority.val();
    console.log(priority)
})

// ADD NEW USER //
$(`#add-me`).on("click", () => {
    let first_name = toTitleCase($('input[aria-label="first-name"]').val());
    console.log(first_name);
    const last_name = toTitleCase($('input[aria-label="last-name"]').val());
    const age = $('input[aria-label="age"]').val();
    const phone_number = $('input[aria-label="phone-number"]').val();
    const email = $('input[aria-label="email"]').val();
    const newUser = {first_name, last_name, age, phone_number, email};
    console.log(newUser, "new user data")
    fetch('/api/client', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode:'cors',
        body: JSON.stringify(newUser),
    })
    .then((response) => response.json())
    .then((data) => console.log('Success:', data));
    console.log("Form Submitted")

    // newGoal();
})

// ADD NEW GOAL // 
// function newGoal() {
$(`#search-bttn`).on("click",() => {
    console.log("click")
    const userSearch = $('input[name="searchForMe"]').val();
    console.log(userSearch, "client Found")
        $.get(`/api/goals/${userSearch}`, (result) => {
        console.log(result)
        // Button Submitting the data input//
    $('#submit-goal').on("click", () => {
    
        console.log("clicked submit")

        const client_id = userSearch;
        const goal_name = $('textarea[id="goal-name-text"]').val();
        console.log(client_id)
        console.log(goal_name)
        console.log(`${complete_by}`)
        console.log(`${priority}`)
        // const complete = $('input[id="flexCheckDisabled"');
        const complete = "no"
        console.log(complete)
        const newGoal = {client_id, goal_name, complete_by, priority, complete}
            fetch(`/api/goals/${client_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode:'cors',
            body: JSON.stringify(newGoal),
            })
            .then((response) => response.json())
            .then((data) => console.log('Success:', data));
            
         })
    })
        // for(i = 0; i < result.length; i++) {
        //     let{goal_name, complete_by, priority } = result[i];
        //     // $(`<h2>Owner: ${client_id}<h2>`).appendTo(".incomplete-goals");
        //     $(`<h5>Goal: ${goal_name}<h5>`).appendTo(".incomplete-goals");
        //     $(`<h5>Complete by: ${complete_by}<h5>`).appendTo(".incomplete-goals");
        //     $(`<h5>Priority: ${priority}<h5><br>`).appendTo(".incomplete-goals");
        //     // $(`<h5>Complete: ${complete}<h5><br>`).appendTo(".incomplete-goals");
        // }

})
// }



// $(`#current-user`).on("click", (event) => {
//     console.log("click")
//     event.preventDefault();
//     searchCurrent();
// })

// CURRENT USERS GOAL SEARCH//
//Search by Name -- populates goals//
$(`#person-search`).submit((event) => {
    event.preventDefault();
    console.log("click")
    const userInput = $('input[name="search"]').val();
    console.log(userInput, "client")

    $(".incomplete-goals").empty();
    $.get(`/api/goals/${userInput}`, (result) => {
        console.log(result)
        for(i = 0; i < result.length; i++) {
            let{goal_name, complete_by, priority } = result[i];
            // $(`<h2>Owner: ${client_id}<h2>`).appendTo(".incomplete-goals");
            $(`<h5>Goal: ${goal_name}<h5>`).appendTo(".incomplete-goals");
            $(`<h5>Complete by: ${complete_by}<h5>`).appendTo(".incomplete-goals");
            $(`<h5>Priority: ${priority}<h5><br>`).appendTo(".incomplete-goals");
            // $(`<h5>Complete: ${complete}<h5><br>`).appendTo(".incomplete-goals");
        }
    })
});

// UPDATE User Info //
$('#update-first')


// See COMPLETED goal by USER//
// $('#completed-goals').submit((event) => {
//     event.preventDefault();
//     console.log("click")
//     const userInput = $('input[name="search"]').val();
//     console.log(userInput, "client")

//     $(".complete-goals").empty();
//     $.get(`/api/goals/${userInput}`, (result) => {
//         console.log(result)
//         for(i = 0; i < result.length; i++) {
//             let{goal_name, complete_by, priority, complete } = result[i];
//             $(`<h5>Goal: ${goal_name}<h5>`).appendTo(".complete-goals");
//             $(`<h5>Complete by: ${complete_by}<h5>`).appendTo(".complete-goals");
//             $(`<h5>Priority: ${priority}<h5><br>`).appendTo(".complete-goals");
            // $(`<h5>Complete: ${complete}<h5><br>`).appendTo(".complete-goals");
//         }
//     })
// });


function onSignIn(googleUser) {
  event.preventDefault()
  const profile = googleUser.getBasicProfile();
  // console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log("Name: " + profile.getName());
  // console.log("Image URL: " + profile.getImageUrl());
  // console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  const id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    url: 'http://localhost:3000/signin/google',
    type: 'POST',
    data: {
      id_token
    }
  })
    .done(function (response) {
      // console.log(response)
      localStorage.setItem('token', response.token)
      localStorage.setItem('userId', response.id)
      localStorage.setItem('username', response.username)
      $('#public-page').hide()
      $('#dashboard').show()
      fetchTodoList()

    })
    .fail(function (err, textStatus) {
      // console.log(err.responseJSON.err)
      let errors = ''
      for (let keys in err.responseJSON.err.errors) {
        if (err.responseJSON.err.errors[keys].message) {
          errors += `${err.responseJSON.err.errors[keys].message} \n`
        }
      }
      swal({
        text: errors,
        icon: "warning",
        button: "Understood",
      });
      console.log(`request failed ${textStatus}`)
    })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');

    $('#public-page').show()
    $('#dashboard').hide()
    $('#registration-page').hide()
    $('#username').val('')
    $('#password').val('')
    // console.log('User signed out.');
  });
}

function login() {
  event.preventDefault()
  let username = $('#username').val()
  let password = $('#password').val()
  // console.log(username, password, 'INI DATA LOGIN')
  $.ajax({
    url: 'http://localhost:3000/signin/local',
    type: 'POST',
    data: {
      username, password
    }
  })
    .done(function (response) {
      // console.log(response, 'response logiin')
      localStorage.setItem('token', response.token)
      localStorage.setItem('userId', response._id)
      localStorage.setItem('username', response.username)
      $('#public-page').hide()
      $('#dashboard').show()
      fetchTodoList()
    })
    .fail(function (err, textStatus) {
      // console.log(err)
      let errors = ''
      swal({
        text: errors,
        icon: "warning",
        button: "Understood",
      });
      console.log(`request failed ${textStatus}`)
    })
}

function showRegistration() {
  event.preventDefault()
  $('#public-page').hide()
  $('#dashboard').hide()
  $('#registration-page').show()
}

function register() {
  event.preventDefault()
  let username = $('#username-regist').val()
  let password = $('#password-regist').val()
  let email = $('#email-regist').val()
  // console.log('masuk', username, email, password)
  $.ajax({
    url: 'http://localhost:3000/user/',
    type: 'POST',
    data: {
      username, password, email
    }
  })
    .done(function (response) {
      // console.log(response)
      // console.log('berhasil create user ajax')
      $('#public-page').show()
      $('#registration-page').hide()

    })
    .fail(function (err, textStatus) {
      // console.log(err.responseJSON.err)
      let errors = ''
      for (let keys in err.responseJSON.err.errors) {
        if (err.responseJSON.err.errors[keys].message) {
          errors += `${err.responseJSON.err.errors[keys].message} \n`
        }
      }
      swal({
        text: errors,
        icon: "warning",
        button: "Understood",
      });
      console.log(`request failed ${textStatus}`)
    })
}

function fetchTodoList() {
  let name = localStorage.getItem('username')
  $('#name-header').html(name)
  $.ajax({
    url: `http://localhost:3000/todo/`,
    type: 'GET',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done((response) => {
      // console.log(response, 'ini done fettch')
      $("#todo-list").html("");
      response.forEach(todo => {
        let color = `blue-grey darken-4`
        if (!todo.status) color = `blue-grey darken-1`
        // console.log(todo._id, 'ini id dari all')
        $('#todo-list').append(`<div class="card ${color}">
          <div class="card-content white-text">
            <span class="card-title">${todo.name}</span>
            <p>Detail : ${todo.description}.</p>
      
            <p>Due : ${todo.dueDate.split('T')[0]}</p>
          </div>
          <div class="card-action">

            ${todo.status ?
              `<a id="${todo._id}" onclick="changeToUncheck(this)">Uncheck</a>` :
              `<a id="${todo._id}" onclick="changeToCheck(this)">Check</a>`
            }
            <a onclick="deleteTodo('${todo._id}')">Delete</a>
          </div>`
        )
      })
    })
    .fail(function (err, textStatus) {
      swal({
        text: 'Something is wrong',
        icon: "warning",
        button: "Understood",
      });
    })
}


function changeToUncheck(code) {
  event.preventDefault()
  // console.log(code, 'MAU UNCEK')

  $.ajax({
    url: `http://localhost:3000/todo/${code.getAttribute('id')}`,
    type: 'PUT',
    headers: {
      token: localStorage.getItem('token')
    },
    data : {status : false}
  })
  .done(todo => {
    M.toast({ html: 'You cancel your finished task' })
    fetchTodoList()

  })
  .fail(function (err, textStatus) {
    swal({
      text: 'Something is wrong',
      icon: "warning",
      button: "Understood",
    });
  })
}

function changeToCheck(code) {
  event.preventDefault()
  // console.log(code, 'MAU NGECEK')

  $.ajax({
    url: `http://localhost:3000/todo/${code.getAttribute('id')}`,
    type: 'PUT',
    headers: {
      token: localStorage.getItem('token')
    },
    data : {status : true}
  })
  .done(todo => {
    M.toast({ html: 'Well done you finished a task' })
    fetchTodoList()
  })
  .fail(function (err, textStatus) {
    swal({
      text: 'Something is wrong',
      icon: "warning",
      button: "Understood",
    });
  })
}

function deleteTodo(id) {
  $.ajax({
    url: `http://localhost:3000/todo/${id}`,
    type : 'DELETE',
    headers : {
      token: localStorage.getItem('token'),
    }
  })
  .done(todo => {
    M.toast({ html: 'You deleted a task' })
    fetchTodoList()
  })
  .fail(function (err, textStatus) {
    swal({
      text: 'Something is wrong',
      icon: "warning",
      button: "Understood",
    });
  })
}

function showChecked() {
  event.preventDefault()
  let name = localStorage.getItem('username')
  $('#name-header').html(name)
  $.ajax({
    url: `http://localhost:3000/todo/checked`,
    type: 'GET',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done((response) => {
      $("#todo-list").html("");
      response.forEach(todo => {
        let color = `blue-grey darken-4`
        if (!todo.status) color = `blue-grey darken-1`
        $('#todo-list').append(`<div class="card ${color}">
          <div class="card-content white-text">
            <span class="card-title">${todo.name}</span>
            <p>Detail : ${todo.description}.</p>
      
            <p>Due : ${todo.dueDate.split('T')[0]}</p>
          </div>
          <div class="card-action">

            ${todo.status ?
              `<a id="${todo._id}" onclick="changeToUncheck(this)">Uncheck</a>` :
              `<a id="${todo._id}" onclick="changeToCheck(this)">Check</a>`
            }
            <a onclick="deleteTodo('${todo._id}')">Delete</a>
          </div>`
        )
      })
    })
    .fail(function (err, textStatus) {
      swal({
        text: 'Something is wrong',
        icon: "warning",
        button: "Understood",
      });
    })
}

function showUnchecked() {
  event.preventDefault()
  let name = localStorage.getItem('username')
  $('#name-header').html(name)
  $.ajax({
    url: `http://localhost:3000/todo/unchecked`,
    type: 'GET',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done((response) => {
      $("#todo-list").html("");
      response.forEach(todo => {
        let color = `blue-grey darken-4`
        if (!todo.status) color = `blue-grey darken-1`
        // console.log(todo._id, 'ini id dari all')
        $('#todo-list').append(`<div class="card ${color}">
          <div class="card-content white-text">
            <span class="card-title">${todo.name}</span>
            <p>Detail : ${todo.description}.</p>
      
            <p>Due : ${todo.dueDate.split('T')[0]}</p>
          </div>
          <div class="card-action">

            ${todo.status ?
              `<a id="${todo._id}" onclick="changeToUncheck(this)">Uncheck</a>` :
              `<a id="${todo._id}" onclick="changeToCheck(this)">Check</a>`
            }
            <a onclick="deleteTodo('${todo._id}')">Delete</a>
          </div>`
        )
      })
    })
    .fail(function (err, textStatus) {
      swal({
        text: 'Something is wrong',
        icon: "warning",
        button: "Understood",
      });
    })
}


function addTodo() {
  event.preventDefault()
  // let token = localStorage.getItem('token')
  let name = $('#task-name').val()
  let description = $('#task-desc').val()
  let dueDate = $("#task-dueDate").val()

  $.ajax({
    url: `http://localhost:3000/todo/`,
    type: 'POST',
    headers: {
      token: localStorage.getItem('token'),
    },
    data: {
      name, description, dueDate
    }
  })
    .done((todo) => {
      // console.log(todo)
      let showDone;
      if (todo.status == false) showDone = 'Check'
      else showDone = 'Uncheck'
      $('#todo-list').append(`<div class="card blue-grey darken-1">
    <div class="card-content white-text">
      <span class="card-title">${todo.name}</span>
      <p>Detail : ${todo.description}.</p>

      <p>Due : ${todo.dueDate.split('T')[0]}</p>
    </div>
    <div class="card-action">
      <a onclick="">${showDone}</a>
      <a onclick="deleteTodo('${todo._id}')">Delete</a>
    </div>
    `)
      M.toast({ html: 'New task has been created.' })
    })
    .fail(function (err, textStatus) {
      swal({
        text: 'Something is wrong',
        icon: "warning",
        button: "Understood",
      });
    })
}

function showLogin() {
  event.preventDefault()
  $('#public-page').show()
  $('#dashboard').hide()
  $('#registration-page').hide()
}

if (!localStorage.getItem('token')) {
  $('#public-page').show()
  $('#dashboard').hide()
  $('#registration-page').hide()
} else {
  $('#dashboard').show()
  $('#registration-page').hide()
  $('#public-page').hide()
  fetchTodoList()
}


// function querySearch() {
//   let q1 = search-box-text.val()
//   $.ajax({
//     url: `http://localhost:3000/todo/?name=${q1}&description=${q1}`,
//     type: 'GET',
//     headers: {
//       token: localStorage.getItem('token')
//     }
//   })
//   .done((response) => {
//     M.toast({ html: 'Search succeed' })
//       $("#todo-list").html("");
//       response.forEach(todo => {
//         let color = `blue-grey darken-4`
//         if (!todo.status) color = `blue-grey darken-1`
//         $('#todo-list').append(`<div class="card ${color}">
//           <div class="card-content white-text">
//             <span class="card-title">${todo.name}</span>
//             <p>Detail : ${todo.description}.</p>   
//             <p>Due : ${todo.dueDate.split('T')[0]}</p>
//           </div>
//           <div class="card-action">

//             ${todo.status ?
//               `<a id="${todo._id}" onclick="changeToUncheck(this)">Uncheck</a>` :
//               `<a id="${todo._id}" onclick="changeToCheck(this)">Check</a>`
//             }
//             <a onclick="deleteTodo('${todo._id}')">Delete</a>
//           </div>`
//         )
//       })
//   })
//   .fail(function (err, textStatus) {
//     // console.log(err, 'disini')
//     swal({
//       text: 'Something is wrong',
//       icon: "warning",
//       button: "Understood",
//     });
//   })
// }


//materialize

$(document).ready(function () {
  $('.modal').modal()
  $('.datepicker').datepicker({
    minDate: new Date(),
    format: 'yyyy-mm-dd',
    readOnly: true
  });
  $('.dropdown-trigger').dropdown();
  $('select').formSelect();
  $('.fixed-action-btn').floatingActionButton();
  $('.sidenav').sidenav();
  
})
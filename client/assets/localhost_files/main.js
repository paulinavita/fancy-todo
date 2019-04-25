const baseURL = `http://localhost:3000`

function onSignIn(googleUser) {
  event.preventDefault()
  const profile = googleUser.getBasicProfile();
  const id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    url: `${baseURL}/signin/google`,
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

    Swal.fire(
      'Hope to see you soon <3',
      'Do what you need to do!',
      'success'
    )
    // console.log('User signed out.');
  });
}

function login() {
  event.preventDefault()
  let username = $('#username').val()
  let password = $('#password').val()
  // console.log(username, password, 'INI DATA LOGIN')
  $.ajax({
    url: `${baseURL}/signin/local`,
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
      swal({
        text: 'Please check your credentials',
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
    url: `${baseURL}/user/`,
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
    url: `${baseURL}/todo/`,
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
          <a href="#editTodo" onclick="getEditForm('${todo._id}')" class="modal-trigger" id="${todo._id}">Edit</a>
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

function getEditForm(id) {
  console.log(id)
  $.ajax({
    url: `${baseURL}/todo/${id}`,
    type: 'GET',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function (response) {
        $('#edit-task-name').val(response.name)
        $('#edit-task-desc').val(response.description)
        $('#edit-task-dueDate').val(new Date(response.dueDate).toISOString().slice(0,16))     
        $('#edit-button').html(`<div id ="edit-button" class="modal-footer"><a onclick="postEditForm('${id}')"  class="modal-close waves-effect waves-green btn-flat">OK</a></div>`)
        
    })
    .fail(function (err, textStatus) {
      swal({
        text: 'Something is wrong',
        icon: "warning",
        button: "Understood",
      });
    })
  }

  
function postEditForm(id) {
  // console.log('sini bray');
  
  let name = $('#edit-task-name').val()
  let description = $('#edit-task-desc').val()
  let dueDate = $('#edit-task-dueDate').val()
  $.ajax({
    url: `${baseURL}/todo/${id}`,
    type: 'PATCH',
    headers: {
      token: localStorage.getItem('token')
    },
      data : {
        name,
        description,
        dueDate
      },
  })
  .done(todo => {
    M.toast({ html: 'You edited a task' })
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




function changeToUncheck(code) {
  event.preventDefault()
  // console.log(code, 'MAU UNCEK')

  $.ajax({
    url: `${baseURL}/todo/${code.getAttribute('id')}`,
    type: 'PATCH',
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
    url: `${baseURL}/todo/${code.getAttribute('id')}`,
    type: 'PATCH',
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
    url: `${baseURL}/todo/${id}`,
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
  let userId = localStorage.getItem('userId')

  $('#name-header').html(name)
  $.ajax({
    url: `${baseURL}/todo/${userId}/checked`,
    type : 'GET',
    headers : {
      token: localStorage.getItem('token'),
    }
  })
    .done((response) => {
      console.log(response, '.asuk respone')
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
      console.log(err, 'mauk ekk')
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
  let userId = localStorage.getItem('userId')

  $('#name-header').html(name)
  $.ajax({
    url: `${baseURL}/todo/${userId}/unchecked`,
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
  let userId = localStorage.getItem('userId')
  let name = $('#task-name').val()
  let description = $('#task-desc').val()
  let dueDate = $("#task-dueDate").val()

  $.ajax({
    url: `${baseURL}/todo/`,
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
    <a href="#editTodo" onclick="getEditForm('${todo._id}')" class="modal-trigger" id="${todo._id}">Edit</a>
    <a id="${todo._id}" onclick="changeToCheck(this)">Check</a>
    <a onclick="deleteTodo('${todo._id}')">Delete</a>
    </div>
    `)
      M.toast({ html: 'New task has been created.' })
    })
    .fail(function (err, textStatus) {
      swal({
        text: 'All field must be filled',
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
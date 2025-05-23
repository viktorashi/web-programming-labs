let offset = 0
let isAdmin = false
let filters = {}
let totalEntries = 0

function fetchEntries () {
  $.ajax({
    url: 'api.php?action=list',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ offset, filters }),
    success: function (data) {
      totalEntries = data.total
      const $container = $('#entries')
      $container.empty()

      data.entries.forEach(e => {
        const $div = $('<div></div>').addClass('entry').html(`
          <b>${e.title}</b> by ${e.author_email}<br>
          <p>${e.comment}</p>
          <small>${e.date}</small>
        `)

        if (isAdmin) {
          const $btns = $('<div></div>').addClass('admin-controls').html(`
            <button onclick="editEntry(${e.id}, '${e.title}', \`${e.comment}\`)">Edit</button>
            <button onclick="deleteEntry(${e.id})">Delete</button>
          `)
          $div.append($btns)
        }
        $container.append($div)
      })

      $('#next').prop('disabled', offset + 4 >= totalEntries)
      $('#prev').prop('disabled', offset === 0)
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error fetching entries: ', textStatus, errorThrown)
      alert('No more entries or an error occurred.')
      offset = Math.max(0, offset - 4)
    }
  })
}

function editEntry (id, title, comment) {
  const newTitle = prompt('Enter the new title:', title)
  const newComment = prompt('Enter the new comment:', comment)

  if (newTitle !== null && newComment !== null) {
    $.ajax({
      url: 'api.php?action=update',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ id, title: newTitle, comment: newComment }),
      success: function () {
        fetchEntries()
      },
      error: function () {
        alert('Error updating entry.')
      }
    })
  }
}

function deleteEntry (id) {
  if (confirm('Are you sure you want to delete this entry?')) {
    $.ajax({
      url: 'api.php?action=delete',
      type: 'DELETE',
      contentType: 'application/json',
      data: JSON.stringify({ id }),
      success: function () {
        fetchEntries()
      },
      error: function () {
        alert('Error deleting entry.')
      }
    })
  }
}

$(document).ready(function () {
  $('#entry-form').on('submit', function (e) {
    e.preventDefault()

    const formArray = $(this).serializeArray()
    const data = {}
    $.each(formArray, function (i, field) {
      data[field.name] = field.value
    })

    $.ajax({
      url: 'api.php?action=insert',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function () {
        $('#entry-form')[0].reset()
        fetchEntries()
      },
      error: function () {
        alert('Error submitting entry.')
      }
    })
  })

  $('#login-form').on('submit', function (e) {
    e.preventDefault()
    const pass = $(this).find('input[name="admin_pass"]').val()

    $.ajax({
      url: 'api.php?action=login',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ password: pass }),
      success: function (data) {
        if (data.success) {
          isAdmin = true

          $('#filter-form').show()
          $('#logout-form').show()
          $('#login-form').hide()
          fetchEntries()
        } else {
          alert('Incorrect password.')
        }
      },
      error: function () {
        alert('Login request failed.')
      }
    })
  })

  $('#logout-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      url: 'api.php?action=logout',
      type: 'POST',
      contentType: 'application/json',
      success: function () {
        isAdmin = false
        filters = {}

        $('#filter-form').hide()
        $('#logout-form').hide()
        $('#login-form').show()
        $('#filter-form')[0].reset()
        fetchEntries()
      },
      error: function () {
        alert('Logout request failed.')
      }
    })
  })

  $('#filter-form').on('submit', function (e) {
    e.preventDefault()
    const formArray = $(this).serializeArray()
    filters = {}
    $.each(formArray, function (i, field) {
      if (field.value.trim() !== '') {
        filters[field.name] = field.value
      }
    })
    offset = 0
    fetchEntries()
  })

  $('#prev').on('click', function () {
    offset = Math.max(0, offset - 4)
    fetchEntries()
  })

  $('#next').on('click', function () {
    offset += 4
    fetchEntries()
  })

  fetchEntries()
})

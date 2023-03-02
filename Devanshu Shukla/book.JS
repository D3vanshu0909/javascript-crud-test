$(document).ready(function () {
  let books;

  // Fetch data from 1.json and store in local storage
  $.ajax({
    url: "book.json",
    dataType: "json",
    success: function (data) {
      books = data;
      localStorage.setItem("books", JSON.stringify(books));
      populateTable();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  });

  // DataTable initialization
  $("#bookTable").DataTable({
    searching: true,
    paging: true,
    data: books,
    columns: [
      { data: "id" },
      { data: "name" },
      {
        data: "image",
        render: function (data, type, row) {
          return '<img src="' + data + '" height="100" />';
        },
      },
      { data: "price" },
      { data: "copies" },
      {
        data: null,
        render: function (data, type, row) {
          return `<button class="btn btn-primary btn-sm" data-id="${row.id}" data-toggle="modal" data-target="#bookModal">Edit</button> 
                  <button  class="btn btn-danger btn-sm" onclick="deleteItem()" data-id="${row.id}">Delete</button>
                  <button class="btn btn-info btn-sm view-book" data-id="${row.id}" data-toggle="modal" data-target="#viewBookModal">Details</button>`;
        },
      },
    ],
  });

  // Populate table with data from local storage
  function populateTable() {
    books = JSON.parse(localStorage.getItem("books")) || [];
    $("#bookTable").DataTable().clear().rows.add(books).draw();
  }

  // Add or update book on save button click
  $("#saveBtn").click(function () {
    let id = $("#bookId").val();
    let name = $("#name").val();
    let image = $("#image").val();
    let price = parseFloat($("#price").val()).toFixed(2);
    let copies = parseInt($("#copies").val());

    // Update the book with the given id, or add a new book if the id is empty
    if (id) {
      let book = books.find((b) => b.id == id);
      book.name = name;
      book.image = image;
      book.price = price;
      book.copies = copies;
    } else {
      let maxId = Math.max(...books.map((b) => b.id));
      books.push({
        id: maxId + 1,
        name: name,
        image: image,
        price: price,
        copies: copies,
      });
    }

    // Update local storage and table
    localStorage.setItem("books", JSON.stringify(books));
    populateTable();

    // Reset form and hide modal
    $("#bookForm")[0].reset();
    $("#bookId").val("");
    // $("#bookModal").modal("hide");
    $("#bookModal").hide();
  });

  // Edit book modal populating
  $("#bookTable tbody").on("click", "button.btn-primary", function () {
    let id = $(this).data("id");
    let book = books.find((b) => b.id == id);
    $("#bookId").val(book.id);
    $("#name").val(book.name);
    $("#image").val(book.image);
    $("#price").val(book.price);
    $("#copies").val(book.copies);
  });

  // Search functionality
  $("#searchInput").keyup(function () {
    let searchVal = $(this).val().toLowerCase();
    let filteredData = books.filter((b) =>
      b.name.toLowerCase().includes(searchVal)
    );
    $("#bookTable").DataTable().clear().rows.add(filteredData).draw();
  });

  // View book modal populating
  $("#bookTable tbody").on("click", ".view-book", function () {
    let id = $(this).data("id");
    let book = books.find((b) => b.id == id);
    $("#viewBookId").text(book.id);
    $("#viewName").text(book.name);
    $("#viewImage").attr("src", book.image);
    $("#viewPrice").text(book.price);
    $("#viewCopies").text(book.copies);
  
  });
  // Delete book and show toastr confirmation
  $("#bookTable tbody").on("click", "button.btn-danger", function () {
    let id = $(this).data("id");
    let bookIndex = books.findIndex((b) => b.id == id);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      localStorage.setItem("books", JSON.stringify(books));
      populateTable();
      toastr.success("Book deleted successfully.");
    }
  });

  // Delete book
$("#bookTable tbody").on("click", "button.btn-danger", function () {
  if (confirm("Are you sure you want to delete this book?")) {
    let id = $(this).data("id");
    let bookIndex = books.findIndex((b) => b.id == id);
    books.splice(bookIndex, 1);
    localStorage.setItem("books", JSON.stringify(books));
    populateTable();
    toastr.success('Book deleted successfully!');
  }  else {
    toastr.error('Not Deleted');
  }
});



});

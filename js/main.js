let initElement = (() => {
  let arrow = document.querySelectorAll(".arrow");
  arrow[0].addEventListener("click", goTop);

  $(".arrow").hide();
})();

$(document).ready(() => {
  $("#searchForm").on("submit", e => {
    $(".arrow").show();
    let searchText = $("#searchText").val();

    clearStorage();

    getMovies(searchText);
    e.preventDefault();
  });
});

function getMovies(searchText) {
  // Request to API using axios npm
  axios
    .get(
      "https://api.themoviedb.org/3/search/movie?api_key=fa155f635119344d33fcb84fb807649b&query=" +
        searchText
    )
    .then(response => {
      if (localStorage.length === 0) {
        let stringObj = JSON.stringify(response);
        localStorage.setItem(searchText, stringObj);
      }

      let movies = response.data.results;

      if (typeof movies === "undefined" || movies.length === 0) {
        errorPage();
      } else {
        let output = "";

        $.each(movies, (index, movie) => {
          output += '<div class="col-md-3">';
          output += '<div class="well text-center">';
          output +=
            '<img onerror="handleMissingImg(this);" src="http://image.tmdb.org/t/p/w185/' +
            movie.poster_path +
            '">';
          output += "<h5>" + movie.title.substring(0, 26) + "</h5>";
          output +=
            "<a onclick=movieSelected(" +
            movie.id +
            ') class="btn btn-info" href="#">Movie Details</a>';
          output += "</div>";
          output += "</div>";
        });

        $("#movies").html(output);
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function handleMissingImg(image) {
  image.onerror = "";
  image.src = "img/noImage.jpg";
  return false;
}

function movieSelected(id) {
  // Sending data through sessionStorage
  // Save ID
  sessionStorage.setItem("movieId", id);
  window.location = "movie.html";
  return false;
}

function getMovie() {
  displayArrow();
  // Taking 'movieId' from sessionStorage
  let movieId = sessionStorage.getItem("movieId");

  // New request for single movie
  axios
    .get(
      "https://api.themoviedb.org/3/movie/" +
        movieId +
        "?api_key=fa155f635119344d33fcb84fb807649b"
    )
    .then(response => {
      // Init data for single movie
      let movie = response.data;

      let genres = movie.genres;
      let production_companies = movie.production_companies;

      // Funciton get all values of key 'name' - return strings
      let getNames = function(prop) {
        return `${prop.map(val => val.name)}`;
      };

      const genreNames = getNames(genres);

      const companyNames = getNames(production_companies);
      // ...end of init data

      // 'output' inside template string literals for single movie
      let output = `
               <div class="row">
                  <div class="col-md-4">
                     <img onerror="handleMissingImg(this);" src="https://image.tmdb.org/t/p/w185/${
                       movie.poster_path
                     }" class="thumbnail">
                  </div>

                  <div class="col-md-8">
                     <h2><strong>${movie.title}</strong></h2>
                     <hr>
                     <ul class="list-group">
                        <li class="list-item-group"><h5><strong>Release Date: </strong>${
                          movie.release_date
                        }</h5></li>
                        <li class="list-item-group"><h5><strong>Genre: </strong>${genreNames}</h5></li>
                        <li class="list-item-group"><h5><strong>Original Title: </strong>${
                          movie.original_title
                        }</h5></li>
                        <li class="list-item-group"><h5><strong>Language: </strong>${
                          movie.original_language
                        }</h5></li>
                        <li class="list-item-group"><h5><strong>Overview: </strong>${
                          movie.overview
                        }</h5></li>
                        <li class="list-item-group"><h5><strong>Rated: </strong>${
                          movie.vote_average
                        }</h5></li>
                        <li class="list-item-group"><h5><strong>Production Companies: </strong>${companyNames}</h5></li>
                     </ul>
                  </div>
               </div>

               <div class="row">
                  <div class="col-md-12">
                     <div class="well" id="overview">
                        <h2>Plot</h2>
                        <p>${movie.tagline}</p>
                        <hr>
                        <a href="https://www.imdb.com/title/${
                          movie.imdb_id
                        }" class="btn btn-info" target="_blanc">View iMDB</a>
                        <a onclick="changeLocation();" class="btn btn-primary" href="#">Go Back</a>
                     </div>
                  </div>
               </div>
      `;

      $("#movie").html(output);
    })
    .catch(error => {
      errorPage();
      console.log(error);
    });
}

function errorPage() {
  let errPage = (window.location = "error/error.html");
  return errPage;
}

function goTop(e) {
  showArrow(e);
  window.scrollTo(0, 0);
}

function showArrow(event) {
  if (event.keyCode === 13) {
    arrow[0].style.display = "inline";
  }
}

function clearStorage() {
  localStorage.clear();
}

function displayArrow() {
  let arrow = document.querySelectorAll(".arrow");
  arrow[0].addEventListener("click", goTop);

  arrow[0].style.display = "inline";
}

function changeLocation() {
  window.location = "storedMovies.html";
  return false;
}

function getStoredObject(object) {
  displayArrow();

  // Getting key and object value from local storage
  let key = localStorage.key(0);
  object = JSON.parse(localStorage.getItem(key));

  let objects = object.data.results;

  // Inserting text into h3 element
  let h3Element = document.getElementById("message");
  let textIn = document.createTextNode(`Movie Results for Search: "${key}"`);
  h3Element.style.color = "#ffe4b5";
  h3Element.appendChild(textIn);

  // Insert element into DOM
  let jumbotron = document.querySelector(".container .jumbotron");
  let h3 = document.querySelector(".container h3");
  jumbotron.insertBefore(h3Element, h3);

  let output = "";

  $.each(objects, (index, object) => {
    output += `
              <div class="col-md-3">
                <div class="well text-center">
                  <img onerror="handleMissingImg(this);" src="http://image.tmdb.org/t/p/w185/${
                    object.poster_path
                  }" class="thumbnail">
                  <h5>${object.title.substring(0, 26)}</h5>                  
                  <a onclick="movieSelected(${
                    object.id
                  });" class="btn btn-info" href="#">Movie Details</a>
                </div>
              </div>
    `;
  });

  $("#storedMovies").html(output);
}

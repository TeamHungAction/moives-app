(async () => {
    // This is the entry point for your application. Write all of your code here.
    // Before you can use the database, you need to configure the "db" object
    // with your team name in the "js/movies-api.js" file.
    "use strict"

    const pageLoader = async () => {
        // collects movie list from database
        const movies = await getMovies();
        // console.log(movies);

        // creates array of movie titles
        const movieTitles = movies.map((movie) => {
            return movie.title;
        });
        // console.log(movieTitles);

        // Contacts movie poster api to generate poster images for movies
        // maps result to create arr of just the poster images
        let moviePosters = [];
        const getThePosters = async () => {
            for (let i = 0; i < movieTitles.length; i += 1) {
                await $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=" + `${movieTitles[i]}` + "&callback=?", function (json) {
                    let posterData = '';
                    if (json != "Nothing found.") {
                        // console.log(json.results[0].poster_path);
                        posterData = json.results[0].poster_path;
                        moviePosters.push(posterData);
                    }
                });
            }
        }

        console.log(moviePosters)

        await getThePosters();


        // Creates and dynamically writes html based of movies array
        const writeHtml = () => {

            let dynamicHtml = ``;

            for (let i = 0; i < movies.length; i++) {
                dynamicHtml += `<div class="carousel-item ${i === 0 ? 'active' : ''}" data-movie="${movies[i].id}" data-title="${movies[i].title}" data-year="${movies[i].year}" data-genre="${movies[i].genre}" data-rating="${movies[i].rating}">
                            <div class="container d-flex carousel-card">
                                <div class="row flex-grow-1 d-flex card-row">
                                    <div class="col-6 d-flex justify-content-center"><img src="https://image.tmdb.org/t/p/w500/${moviePosters[i]}" class="poster-img" alt="current poster image"></div>
                                    <div class="col-6 d-flex justify-content-between flex-column">
                                        <section>
                                            <h1 class="mb-4 mov-title">${movies[i].title}</h1>
                                            <h3 class="mb-2 mov-director">${movies[i].director} - ${movies[i].year}</h3>
                                            <h5 class="mov-genre mt-5">${movies[i].genre}</h5>
                                            <h5 class="mov-rating mt-2">Rating: ${movies[i].rating}</h5>
                                            <p class='hidden'>${movies[i].id}</p>
                                        </section>
                                        <section class="d-flex flex-row pb-1">
                                            <button class="me-5 update-btn update-user" id="update-btn">Update</button>
                                            <button class="ms-5 delete-btn delete-user">Delete</button>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>`
            }

            let btnHtml = `<button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>`


            $(`.cards-here`).html(`<div class="carousel-inner"> ${dynamicHtml} </div> ${btnHtml}`);

        }

        // Calling the function to write the html
        writeHtml();

        // end of page load
    }

    await pageLoader();



    // event listeners

    //Filter and search function
    $(document).on('click', `#submit`, (e) => {
        e.preventDefault();
        console.log(`btn clicked`);
        let searchValue = $('#search').val();
        console.log(searchValue);
        $('[data-title]').each(function(){
           let title = $(this).attr('data-title');
           if (title.toLowerCase() === searchValue.toLowerCase()){
               // found a card with a matching title
               $('[data-title].active').removeClass('active');
               $(this).addClass('active');
           }
        });
    })

    // btn for adding movies
    $('#add-btn').on('click', () => {
        $(`#unhidden`).toggleClass(`hidden`)
    })

    $(`#movie-added`).on(`click`, async () => {
        let title = $(`#title-user`).val();
        let director = $(`#director-user`).val();
        let year = $(`#year-user`).val();
        let genre = $(`#genre-user`).val();
        let rating = $(`#rating-user`).val();
        await addMovie({
            title: `${title}`,
            year: `${year}`,
            director: `${director}`,
            rating: `${rating}`,
            genre: `${genre}`,
        })
        await pageLoader();
        $(`#unhidden`).toggleClass(`hidden`);
    });

    // btn for deleting movie

    $(document).on('click', '.delete-user', async function () {
        let currentID = $(this).parents('.carousel-item').attr('data-movie');
        await deleteMovie({
            id: currentID
        })
        await pageLoader();
    })

    // btn for updating movie
    $(document).on(`click`, '.update-user', function () {
        let currentID = $(this).parents('.carousel-item').attr('data-movie');
        $(`#update-unhidden`).toggleClass(`hidden`);
        // $(`#update-btn`).toggleClass(`hidden`);
        $(`#movie-update`).on(`click`, async () => {
            let title = ($(`#title-update`).val() === "" ? $(this).parents('.carousel-item').attr('data-title') : $('#title-update').val());
            let director = ($(`#director-update`).val() === "" ? $(this).parents('.carousel-item').attr('data-director') : $('#director-update').val());
            let year = ($(`#year-update`).val() === "" ? $(this).parents('.carousel-item').attr('data-year') : $('#year-update').val());
            let genre = ($(`#genre-update`).val() === "" ? $(this).parents('.carousel-item').attr('data-genre') : $('#genre-update').val());
            let rating = ($(`#rating-update`).val() === "" ? $(this).parents('.carousel-item').attr('data-rating') : $('#rating-update').val());

            await updateMovie({
                id: currentID,
                title: title,
                year: year,
                director: director,
                rating: rating,
                genre: genre
            })
            await pageLoader();
            $('[data-title].active').removeClass('active');
            $(`.carousel-item[data-movie="${currentID}"]`).addClass('active');
            $(`#update-unhidden`).toggleClass(`hidden`);
        });
    });
})();
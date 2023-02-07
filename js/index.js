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

        // console.log(moviePosters)

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
        // console.log(searchValue);
        $('[data-title]').each(function () {
            let title = $(this).attr('data-title');
            if (title.toLowerCase() === searchValue.toLowerCase()) {
                // found a card with a matching title
                $('[data-title].active').removeClass('active');
                $(this).addClass('active');
            }
        });
    })

    // btn for deleting movie

    $(document).on('click', '.delete-user', async function () {
        let currentID = $(this).parents('.carousel-item').attr('data-movie');
        await deleteMovie({
            id: currentID
        })
        $(`.cards-here`).html(`<div class="col d-flex justify-content-end align-items-center">
                        <div class="dot-pulse"></div>
                    </div>
                    <h1 class="col loading-text justify-content-center">loading</h1>
                    <div class="col d-flex align-items-center">
                        <div class="dot-pulse"></div>
                    </div>`);
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
            $(`.cards-here`).html(`<div class="col d-flex justify-content-end align-items-center">
                        <div class="dot-pulse"></div>
                    </div>
                    <h1 class="col loading-text justify-content-center">loading</h1>
                    <div class="col d-flex align-items-center">
                        <div class="dot-pulse"></div>
                    </div>`);
            $(`#update-unhidden`).addClass(`hidden`);
            await pageLoader();
            $('[data-title].active').removeClass('active');
            $(`.carousel-item[data-movie="${currentID}"]`).addClass('active');
        });
    });

    // TMDB API
    const api_base_url = 'https://api.themoviedb.org/3/', image_base_url = 'https://image.tmdb.org/t/p/w1280';

    $(document).on('click', '#submit-tmdb', async (e) => {
        e.preventDefault();
        const search = $('#search-tmdb').val();
        let data = []
        try {
            const response = await fetch(`${api_base_url}search/movie/?api_key=${keys.tmdb}&query=${search}`)
            const responseData = await response.json()
            data.push(responseData)
        } catch (error) {

        }


        console.log(data[0].results);
        let dynamicHtml = ``;
        for (let i = 0; i < data[0].results.length; i += 1) {
            console.log(data[0].results[i].id);
            dynamicHtml += `<div class="carousel-item ${i === 0 ? 'active' : ''}" tmdb-title="${data[0].results[i].title}" tmdb-rating="${data[0].results[i].vote_average}" tmdb-id="${data[0].results[i].id}">
                            <div class="container d-flex carousel-card">
                                <div class="row flex-grow-1 d-flex card-row">
                                    <div class="col-6 d-flex justify-content-center"><img src="https://image.tmdb.org/t/p/w1280${data[0].results[i].poster_path}" class="poster-img" alt="current poster image"></div>
                                    <div class="col-6 d-flex justify-content-between flex-column">
                                        <section">
                                            <h1 class="mb-5 mov-title special-size">${data[0].results[i].title}</h1>
                                            <button class="me-5 mt-5" id="add-btn-tmdb">Add to library</button>  
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
    });

    //add movie to library from TMDB
    $(document).on('click', '#add-btn-tmdb', async function () {
        let currentTmdbTitle = $(this).parents('.carousel-item').attr('tmdb-title');
        let currentTmdbRating = $(this).parents('.carousel-item').attr('tmdb-rating');
        let currentTmdbId = $(this).parents('.carousel-item').attr('tmdb-id');
        let data = [];
        console.log(currentTmdbId);
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${currentTmdbId}?api_key=${keys.tmdb}&language=en-US`);
            const responseData = await response.json();
            data.push(responseData);


        } catch (error) {

        }
        let director = [];
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${currentTmdbId}/credits?api_key=${keys.tmdb}&language=en-US`);
            const responseData = await response.json();
            director.push(responseData);

        } catch (error) {

        }
        console.log(director);

        let yearArr = data[0].release_date.split(``)
        let year = yearArr[0] + yearArr[1] + yearArr[2] + yearArr[3];

        console.log(data);
        await addMovie({
            title: currentTmdbTitle,
            rating: currentTmdbRating,
            year: year,
            director: director[0].crew.find(member => member.job === "Director").name,
            genre: data[0].genres[0].name
        })
        $(`.cards-here`).html(`<div class="col d-flex justify-content-end align-items-center">
                        <div class="dot-pulse"></div>
                    </div>
                    <h1 class="col loading-text justify-content-center">loading</h1>
                    <div class="col d-flex align-items-center">
                        <div class="dot-pulse"></div>
                    </div>`);
        await pageLoader();
    })


})();
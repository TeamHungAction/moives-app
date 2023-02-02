(async () => {
    // This is the entry point for your application. Write all of your code here.
    // Before you can use the database, you need to configure the "db" object 
    // with your team name in the "js/movies-api.js" file.
    "use strict"
    const movies = await getMovies();
    console.log(movies);

    // let html = ``;
    // movies.forEach((movie)=>{
    //     html += `<div class="card m-2" style="width: 18rem;">
    //                 <img src="img/jurrasic-park-poster.jpeg" class="card-img-top" alt="...">
    //                 <div class="card-body">
    //                     <h3 class="card-title">${movie.title}</h3>
    //                     <h5>${movie.director} - ${movie.year}</h5>
    //                     <p class="card-text">*****${movie.rating}</p>
    //                     <a href="#" class="btn btn-danger" id="delete-btn">Delete</a>
    //                 </div>
    //             </div>`
    // });
    //
    // $(`#movie-cards`).html(html);


    // $(`#delete-btn`).on(`click`, ()=>{
    //     deleteMovie()
    // })

    // await deleteMovie({
    //     id: "0LDz3lbnTbvffQWwMOdb"
    // });

    // await updateMovie({
    //     id: 'GbBq6P1Jc9yCXmWRSnvP',
    //     year: '1972'
    // })




    //  movie object structure
    // {
    //     title: 'The Shawshank Redemption',
    //         year: 1994,
    //     director: 'Frank Darabont',
    //     rating: 9.3,
    //     runtime: 142,
    //     genre: 'Drama',
    //     actors: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
    // },
    //
})();
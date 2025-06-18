import MoviesDAO from '../dao/moviesDAO.js' 

export default class MoviesController{

    static async apiGetMovies(req,res,next){
        //displays whats typed in or 20 movies/page
        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage) : 20
        //displays whats typed in or page 0
        const page = req.query.page ? parseInt(req.query.page) : 0

        //whats typed is pushed to filters object, updating values
        let filters = {} 
        if(req.query.rated){            
            filters.rated = req.query.rated
        } 
        else if(req.query.title){            
            filters.title = req.query.title            
        }
         
        //links to movies DAO to access filters
        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({filters, page, moviesPerPage})
        
        //response displays in json format
        let response ={
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        }
        res.json(response) 
    }
    static async apiGetMovieById(req,res, next){
        try{
            //look for parameters, whats typed atthe end of the url
            let id = req.params.id || {}
            //id is the identifier
            let movie = await MoviesDAO.getMovieById(id)
            //error handling if movie id isn't found in movie object
            if(!movie){ 
                res.status(404).json({ error: "not found"})
                return
            }
            res.json(movie)
        }
        catch(e){
            //error message
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    static async apiGetRatings(req,res,next){
        try{ 
            //respond with property in json format
            let propertyTypes = await MoviesDAO.getRatings()
            res.json(propertyTypes)
        }
        catch(e){
            //error message
            console.log(`api,${e}`)
            res.status(500).json({error: e})
        }
    }

}

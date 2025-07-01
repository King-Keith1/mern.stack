import React, { useState, useEffect } from 'react';
// Service to handle API requests
import MovieDataService from "../services/movies";
// Link for navigation between pages
import { Link } from "react-router-dom";
// Bootstrap components for styling
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
// Custom CSS for movie list styling
import './MovieList.css';

const MoviesList = props => {

   //  State for total number of movies available (temporary fallback to 100)
   const [totalResults, setTotalResults] = useState(100);

   // State to hold list of movies returned from API
   const [movies, setMovies] = useState([]);
   // State for search input: movie title
   const [searchTitle, setSearchTitle] = useState("");
   // State for search input: movie rating
   const [searchRating, setSearchRating] = useState("");
   // State for available ratings options
   const [ratings, setRatings] = useState(["All Ratings"]);
   // State to track the current page number for pagination
   const [currentPage, setCurrentPage] = useState(0);
   // State for how many entries per page
   const [entriesPerPage, setEntriesPerPage] = useState(0);
   // State to know if searching by title or rating
   const [currentSearchMode, setCurrentSearchMode] = useState("");

   // Whenever the search mode changes, reset to first page
   useEffect(() => {
      setCurrentPage(0);
      // eslint-disable-next-line 
   }, [currentSearchMode]);

   // Whenever the page number changes, retrieve next set of movies
   useEffect(() => {
      retrieveNextPage();
      // eslint-disable-next-line 
   }, [currentPage]);

   // Decide which retrieve function to call based on current search mode
   const retrieveNextPage = () => {
      if (currentSearchMode === 'findByTitle')
         findByTitle();
      else if (currentSearchMode === 'findByRating')
         findByRating();
      else
         retrieveMovies();
   };

   // On first load, get movies list and ratings
   useEffect(() => {
      retrieveMovies();
      retrieveRatings();
      // eslint-disable-next-line 
   }, []);

   // Get all movies for the current page
   const retrieveMovies = () => {
      setCurrentSearchMode("");
      MovieDataService.getAll(currentPage)
         .then(response => {
            console.log(response.data);
            setMovies(response.data.movies); // Update movies state
            setCurrentPage(response.data.page); // Update page number
            setEntriesPerPage(response.data.entries_per_page); // Update per page count

            if (response.data.total_results) {
              setTotalResults(response.data.total_results);
            }
         })
         .catch(e => {
            console.log(e);
         });
   };

   // Get available movie ratings for filter dropdown
   const retrieveRatings = () => {
      MovieDataService.getRatings()
         .then(response => {
            console.log(response.data);
            setRatings(["All Ratings"].concat(response.data));
         })
         .catch(e => {
            console.log(e);
         });
   };

   // Handler for search title input change
   const onChangeSearchTitle = e => {
      const searchTitle = e.target.value;
      setSearchTitle(searchTitle);
   };

   // Handler for search rating dropdown change
   const onChangeSearchRating = e => {
      const searchRating = e.target.value;
      setSearchRating(searchRating);
   };

   // General find function used by findByTitle and findByRating
   const find = (query, by) => {
      MovieDataService.find(query, by, currentPage)
         .then(response => {
            console.log(response.data);
            setMovies(response.data.movies);
         })
         .catch(e => {
            console.log(e);
         });
   };

   // Find movies by title
   const findByTitle = () => {
      setCurrentSearchMode("findByTitle");
      find(searchTitle, "title");
   };

   // Find movies by rating or reset if "All Ratings" is selected
   const findByRating = () => {
      setCurrentSearchMode("findByRating");
      if (searchRating === "All Ratings") {
         retrieveMovies();
      } else {
         find(searchRating, "rated");
      }
   };

   // Calculate how many movies are left to view
   const moviesLeft = totalResults - ((currentPage + 1) * entriesPerPage);

   return (
      <div className="App">
         <Container>
            {/* Search form for title and rating */}
            <Form>
               <Row>
                  <Col>
                     <Form.Group>
                        <Form.Control
                           type="text"
                           placeholder="Search by title"
                           value={searchTitle}
                           onChange={onChangeSearchTitle}
                        />
                     </Form.Group>
                     <Button
                        variant="primary"
                        type="button"
                        onClick={findByTitle}
                     >
                        Search
                     </Button>
                  </Col>
                  <Col>
                     <Form.Group>
                        <Form.Control as="select" onChange={onChangeSearchRating} >
                           {ratings.map(rating => {
                              return (
                                 <option key={rating} value={rating}>{rating}</option>
                              )
                           })}
                        </Form.Control>
                     </Form.Group>
                     <Button
                        variant="primary"
                        type="button"
                        onClick={findByRating}
                     >
                        Search
                     </Button>
                  </Col>
               </Row>
            </Form>

            {/* Movie cards list */}
            <Row>
               {movies.map((movie) => {
                  return (
                     <Col key={movie._id}>
                        <Card style={{ width: '18rem' }}>
                           <Card.Img src={movie.poster + "/100px180"} />
                           <Card.Body>
                              <Card.Title>{movie.title}</Card.Title>
                              <Card.Text>
                                 Rating: {movie.rated}
                              </Card.Text>
                              <Card.Text>
                                 {movie.plot}
                              </Card.Text>
                              <Link to={"/movies/" + movie._id} >View Reviews</Link>
                           </Card.Body>
                        </Card>
                     </Col>
                  )
               })}
            </Row>

         </Container>
         <br />
         {/* Pagination: show current page and load next results */}
         Showing page: {currentPage}
         <Button
            variant="link"
            onClick={() => { setCurrentPage(currentPage + 1) }}
         >
            Get next {entriesPerPage} results
         </Button>

         <br />
         {/* Show how many movies are left */}
         <p>
            {moviesLeft > 0
              ? `${moviesLeft} movies left to view`
              : `No more movies left to view.`}
         </p>
      </div>
   );
}

export default MoviesList;

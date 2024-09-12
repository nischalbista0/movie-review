import { fireEvent, render, screen } from "@testing-library/react";
import { MovieLists } from "./movielists";

describe("MovieLists", () => {
  const setActiveTab = jest.fn();
  const setMovie = jest.fn();

  const movie = {
    movieDetails: {
      title: "Test Movie",
      poster_path: "test_poster.jpg",
    },
  };

  it("renders movie details correctly and sets active tab and movie on click", () => {
    render(<MovieLists setActiveTab={setActiveTab} movie={movie} setMovie={setMovie} />);

    // Check if the movie title is rendered correctly
    expect(screen.getByText("Test Movie")).toBeInTheDocument();

    // Check if the movie poster is rendered correctly
    const moviePoster = screen.getByRole("img");
    expect(moviePoster).toBeInTheDocument();
    expect(moviePoster).toHaveAttribute("src", "https://image.tmdb.org/t/p/w500/test_poster.jpg");

    // Simulate a click event on the component
    fireEvent.click(moviePoster);

    // Check if setActiveTab and setMovie functions are called correctly
    expect(setActiveTab).toHaveBeenCalledWith("movie details");
    expect(setMovie).toHaveBeenCalledWith(movie.movieDetails);
  });
});

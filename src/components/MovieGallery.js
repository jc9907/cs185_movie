import React, { useState, Component } from "react";

import Movie from "./movie_element.js";
import GridList from "@material-ui/core/GridList";
import Modal from "@material-ui/core/Modal";
import IconButton from "@material-ui/core/IconButton";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import config from "./config.js";

function rootStyle() {
  return {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  };
}
function GridListStyle() {
  return {
    width: "95%",
    height: "85vh",
    transform: "translateZ(0)",
  };
}
function info() {
  return {
    width: "auto",
    height: "auto",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: "23%",
    paddingLeft: "10px",
    paddingRight: "10px",
    lineHeight: "200%",
    backgroundColor: "#c3cfe2",
  };
}
function getModalStyle() {
  return {
    top: "20%",
    left: "20%",
    backgroundColor: "transparent",
    position: "absolute",
    display: "flex",
  };
}

//Fetch data from firebase
const firebase = require("firebase");

export default class MovieGallery extends Component {
  constructor() {
    super();
    this.state = {
      moviePoster: "",
      open: false,
      key: 1,
      isOpen: false,
      toggle: 0,
      visible: 8,
      movies_list: [],
      perf_listSelection: [],
      listShown: [],
      movie_perf_pairs: [],
    };
    this.changeMoviePoster = (data) => {
      this.setState({
        moviePoster: data,
      });
    };
    this.changeKey = (k) => {
      this.setState({
        key: k,
      });
    };
    this.setOpen = (o) => {
      this.setState({
        open: o,
      });
    };

    this.loadmore = this.loadmore.bind(this); //bind evnt handler!
    this.listSelectOnChange = this.listSelectOnChange.bind(this);
    this.ModalDropOptions = this.ModalDropOptions.bind(this);
    this.perf_list = [];
    //initialize firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
  }

  loadmore() {
    this.setState((old) => {
      return { visible: old.visible + 8 }; //trys to set visible 8 more movies
    });
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    let AllLists = firebase.database().ref("AllLists");
    let allMovies = AllLists.child("All");

    var recvObjects = [];
    var cnt = 0;
    allMovies.on("value", (snapshot) => {
      const receivedJSON = snapshot.val();

      snapshot.forEach(function (childSnapshot) {
        var recvIMDbID = childSnapshot.child("IMDbID").val();
        var recvTitle = childSnapshot.child("Title").val();
        var recvDirector = childSnapshot.child("Director").val();
        var recvRating = childSnapshot.child("Rating").val();
        var recvPosterURL = childSnapshot.child("PosterURL").val();
        var recvActors = childSnapshot.child("Actors").val();
        var recvGenre = childSnapshot.child("Genre").val();
        var recvKey = childSnapshot.child("IMDbID").val();
        recvObjects.push({
          key: recvKey,
          IMDbID: recvIMDbID,
          Title: recvTitle,
          PosterURL: recvPosterURL,
          Director: recvDirector,
          Actors: recvActors,
          Genre: recvGenre,
          Rating: recvRating,
        });
      });

      this.setState({
        movies_list: [...this.state.movies_list, ...recvObjects],
      });
    });

    var perfArraySelection = [];
    var cnt = 0;
    AllLists.on("value", (snapshot) => {
      const receivedJSON = snapshot.val();

      snapshot.forEach((item, index) => {
        perfArraySelection.push(item.key); //get the list
      });
      this.setState({
        perf_listSelection: [
          ...this.state.perf_listSelection,
          ...perfArraySelection,
        ],
      });
    });

    var perfArray = [];
    var movie = [];
    var cnt = 0;
    var moviesMasterArray = [];
    var moviesInOneArray = [];
    AllLists.on("value", (snapshot) => {
      const receivedJSON = snapshot.val();

      snapshot.forEach((eachList, index) => {
        eachList.forEach(function (singleMovie) {
          var recvIMDbID = singleMovie.child("IMDbID").val();
          var recvTitle = singleMovie.child("Title").val();
          var recvDirector = singleMovie.child("Director").val();
          var recvRating = singleMovie.child("Rating").val();
          var recvPosterURL = singleMovie.child("PosterURL").val();
          var recvActors = singleMovie.child("Actors").val();
          var recvGenre = singleMovie.child("Genre").val();
          var recvKey = singleMovie.child("IMDbID").val();
          moviesInOneArray.push({
            key: recvKey,
            IMDbID: recvIMDbID,
            Title: recvTitle,
            PosterURL: recvPosterURL,
            Director: recvDirector,
            Actors: recvActors,
            Genre: recvGenre,
            Rating: recvRating,
          });
        });
      });
      moviesMasterArray.push(moviesInOneArray);

      this.perf_list = moviesMasterArray;

      this.forceUpdate();

      this.setState({
        listShown: [...this.perf_list[0]],
      });
    });
    this.forceUpdate();

    var movie_perf_Array = [];
    AllLists.on("value", (snapshot) => {
      const receivedJSON = snapshot.val();
      snapshot.child("movie_perf_pairs").forEach((eachPair, index) => {
        var recvIMDbID = eachPair.child("IMDbID").val();
        eachPair.child("perfs").forEach((perfName, index) => {
          console.log(perfName.val());
        });
      });
      moviesMasterArray.push(moviesInOneArray);

      this.perf_list = moviesMasterArray;

      this.forceUpdate();

      this.setState({
        listShown: [...this.perf_list[0]],
      });
    });
    this.forceUpdate();
  }

  listSelectOnChange(e) {
    this.setState({
      [this.state.active_list]: this.state.perf_listSelection[e.target.index],
    });
  }

  ModalDropOptions(e) {
    this.state.perf_listSelection.map((e, key) => {
      return (
        <option key={key} value={e.value}>
          {e}
        </option>
      );
    });
  }

  render() {
    return (
      <div style={{ display: "block" }}>
        <div>
          Select List
          <select name="perf_listSelection" onChange={this.listSelectOnChange}>
            {this.state.perf_listSelection.map((e, key) => {
              return (
                <option key={key} value={e.value}>
                  {e}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          {this.state.movies_list.map((s, index) => (
            <h6>{s.Title}</h6>
          ))}
        </div>

        <div>
          <GridList cellHeight={150} spacing={1} style={GridListStyle()}>
            {/*{this.state.movies_list.slice(0,this.state.visible).map((movie) => (  */}

            {this.state.movies_list.map((movie) => (
              <Movie
                movieid={movie.IMDbID}
                indexKey={movie.key}
                changeIndexKey={this.changeKey}
                setOpen={this.setOpen}
                changeMoviePoster={this.changeMoviePoster}
              />
            ))}
          </GridList>

          <Modal
            open={this.state.open}
            onClose={() => {
              this.setOpen(false);
            }}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {
              <div style={getModalStyle()}>
                <div style={info()}>
                  <h7>
                    Title: {this.state.moviePoster.Title} <br />
                    Director: {this.state.moviePoster.Director} <br />
                    Genre: {this.state.moviePoster.Genre}
                    <br />
                    IMDB Rating: {this.state.moviePoster.imdbRating}
                  </h7>
                  <div>
                    <select name="perf_listSelection">
                      {this.ModalDropOptions}
                    </select>
                  </div>
                </div>
                <img
                  src={this.state.moviePoster.Poster}
                  height={"auto"}
                  alt={"poster"}
                />

                <IconButton
                  onClick={() => {
                    const deleteTargetKey = this.state.key;
                    var newMovieArray = [];
                    this.state.movies_list.forEach((item, index) => {
                      if (item.key != this.state.key) {
                        newMovieArray.push(item);
                      }
                    });
                    this.setState({
                      movies_list: [],
                    });

                    this.setState({
                      movies_list: [...newMovieArray],
                    });

                    this.setOpen(false);
                  }}
                >
                  <DeleteSweepIcon style={{ color: "white" }} />
                </IconButton>
              </div>
            }
          </Modal>

          <button
            type="button"
            onClick={this.loadmore}
            style={{ position: "relative", alignItems: "center" }}
          >
            Load More
          </button>
        </div>
      </div>
    );
  }
}

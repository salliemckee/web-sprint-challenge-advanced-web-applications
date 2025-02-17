import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";
import axiosWithAuth from "../axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [spinnerOn, setSpinnerOn] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    /* ✨ implement */
    navigate("/");
  };
  const redirectToArticles = () => {
    /* ✨ implement */
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.

    window.localStorage.removeItem("token");
    setMessage("Goodbye!");
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage();
    setSpinnerOn(true);

    axios
      .post(loginUrl, { username, password })
      .then((res) => {
        const token = res.data.token;
        setMessage(res.data.message);
        window.localStorage.setItem("token", token);
        redirectToArticles();
        setSpinnerOn(false);
      })
      .catch((err) => {
        debugger;
      });
  };

  const getArticles = (message = null) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage();
    setSpinnerOn(true);

    axiosWithAuth()
      .get(articlesUrl)
      .then((res) => {
        setArticles(res.data.articles);
        if (message) {
          setMessage(message);
        } else {
          setMessage(res.data.message);
        }
        setSpinnerOn(false);

        // debugger;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const postArticle = (article) => {
    setMessage();
    setSpinnerOn(true);
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    axiosWithAuth()
      .post(articlesUrl, article)
      .then((res) => {
        getArticles(res.data.message);
      })
      .catch((err) => {
        setSpinnerOn(false);
        console.log(err);
      });
  };

  const updateArticle = (article) => {
    setMessage();
    setSpinnerOn(true);
    // ✨ implement
    // You got this!
    axiosWithAuth()
      .put(`${articlesUrl}/${article.article_id}`, article)
      .then((res) => {
        getArticles(res.data.message);
      })
      .catch((err) => {
        setSpinnerOn(false);
        console.log(err);
      });
  };

  const editArticle = (art) => {
    setCurrentArticle(art);
  };

  const deleteArticle = (article_id) => {
    console.log(article_id);
    // ✨ implement
    axiosWithAuth()
      .delete(`${articlesUrl}/${article_id}`)
      .then((res) => {
        setMessage(res.data.message);
        setArticles(
          articles.filter((art) => {
            return art.article_id !== article_id;
          })
        );
      })
      .catch((err) => {
        debugger;
      });
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  editMode={editMode}
                  setEditMode={setEditMode}
                  currentArticle={currentArticle}
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                />
                <Articles
                  editMode={editMode}
                  setEditMode={setEditMode}
                  getArticles={getArticles}
                  articles={articles}
                  deleteArticle={deleteArticle}
                  editArticle={editArticle}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  );
}

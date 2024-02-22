import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { App } from "../layouts/App";
import { auth } from "../services/firebase";
import { getDatabase, ref, push, onValue } from "firebase/database";
import classNames from "classnames";

import { MdDarkMode, MdLightMode } from "react-icons/md";

export const Home = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [tweets, setTweets] = useState([]);
  const textLimit = 255;
  const navigate = useNavigate();

  const database = getDatabase();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setEmail(user.email);
      } else {
        setUser(null);
        setEmail("");
        navigate("/sign-in");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const tweetsRef = ref(database, "tweets");
    const unsubscribe = onValue(tweetsRef, (snapshot) => {
      const tweetsData = snapshot.val();
      if (tweetsData) {
        const tweetsArray = Object.values(tweetsData).sort(
          (a, b) => b.timestamp - a.timestamp
        );
        setTweets(tweetsArray);
      }
    });

    return () => unsubscribe();
  }, [database]);

  async function handleAddTweet() {
    if (text.trim() !== "") {
      const newTweet = {
        id: new Date().getTime(),
        text: text,
        timestamp: new Date().getTime(),
        user: email,
      };

      await push(ref(database, "tweets"), newTweet);

      setText("");
    }
  }

  function handleChangeCaracteres(e) {
    const textType = e.target.value;

    if (textType.length <= textLimit) {
      setText(textType);
    }
  }

  async function handleSignOut() {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  function toggleTheme() {
    setIsDarkTheme((prevTheme) => !prevTheme);
  }

  if (!user) return null;

  return (
    <App>
      <header
        className={classNames(
          "flex justify-between items-center py-3 px-6 border-b border-gray-200",
          {
            "bg-gray-800": isDarkTheme,
            "border-gray-700": isDarkTheme,
            "shadow-lg": isDarkTheme,
          }
        )}
      >
        <div className="flex items-center">
          <h1
            className="text-xl font-bold pr-4 text-sky-500"
          >
            Simple Twitter
          </h1>
          <button onClick={toggleTheme}>
            {isDarkTheme ? <MdLightMode color="#FFFFCC" size={20} /> : <MdDarkMode color="#065F96" size={20} />}
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <span className={classNames("", { "text-white": isDarkTheme })}>
            {email}
          </span>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Sair
          </button>
        </div>
      </header>
      <main
        className={classNames("flex justify-center items-center", {
          "bg-gray-100": !isDarkTheme,
          "bg-gray-900": isDarkTheme,
        })}
      >
        <div className="m-16 w-2/3 ">
          <div className={classNames("App", { dark: isDarkTheme })}>
            <label
              className={classNames("block mb-2 pl-2", {
                "text-white": isDarkTheme,
              })}
            >
              Faça um tweet agora mesmo
            </label>
            <textarea
              className={classNames(
                "w-full h-36 border border-gray-300 rounded-md px-4 py-2 mb-4 shadow-md",
                {
                  "border-gray-700": isDarkTheme,
                  "bg-gray-800": isDarkTheme,
                  "shadow-lg": isDarkTheme,
                  "text-white": isDarkTheme,
                }
              )}
              value={text}
              onChange={handleChangeCaracteres}
              maxLength="255"
              style={{ resize: "none" }}
              placeholder="Sem ideias? Que tal escrever como foi seu dia hoje..."
            />

            <div className="flex justify-between">
              <span className="text-emerald-500">
                Você ainda pode digitar {textLimit - text.length} caracteres
              </span>
              <button
                onClick={handleAddTweet}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md"
              >
                aluritar
              </button>
            </div>

            {tweets.map((tweet) => (
              <div
                key={tweet.id}
                className={classNames(
                  "w-full mt-8 mb-8 pl-4 pr-4 flex flex-col rounded-md",
                  {
                    "bg-white shadow-md": !isDarkTheme,
                    "bg-gray-800 text-white shadow-lg": isDarkTheme,
                  }
                )}
                style={{ maxWidth: "100%" }} // Defina o maxWidth conforme necessário
              >
                <h1 className="text-lg pt-5 mb-7">{tweet.text}</h1>

                <div className="flex justify-between items-center mt-auto pb-3">
                  <span className="text-sky-500">{tweet.user}</span>
                  <span className="opacity-40 pr-4 text-sm">
                    {new Date(tweet.timestamp).toLocaleString("pt-BR", {
                      hour12: false,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </App>
  );
};

export default Home;

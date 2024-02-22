import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { App } from "../layouts/App";
import { auth } from "../services/firebase";
import {
  getDatabase,
  ref as databaseRef,
  push,
  onValue,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import classNames from "classnames";

import { MdDarkMode, MdLightMode } from "react-icons/md";

import { FaImage } from "react-icons/fa";
import { BsX } from "react-icons/bs";

export const Home = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreviewURL, setImagePreviewURL] = useState(null); // Adicionando estado para pré-visualização da imagem
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [tweets, setTweets] = useState([]);
  const textLimit = 255;
  const navigate = useNavigate();
  const database = getDatabase();
  const storage = getStorage();

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
    const tweetsRef = databaseRef(database, "tweets");
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
      try {
        let imageURL = null;
        if (image) {
          const storageReference = storageRef(storage, `images/${image.name}`);
          await uploadBytes(storageReference, image);
          imageURL = await getDownloadURL(storageReference);
        }

        const newTweet = {
          id: new Date().getTime(),
          text: text,
          timestamp: new Date().getTime(),
          user: email,
          imageURL: imageURL,
        };

        await push(databaseRef(database, "tweets"), newTweet);

        setText("");
        setImage(null);
        setImagePreviewURL(null); // Limpar a pré-visualização da imagem após adicionar o tweet
      } catch (error) {
        console.error("Error adding tweet:", error);
      }
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

  function handleCancelImage() {
    setImage(null);
    setImagePreviewURL(null);
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
          <h1 className="text-xl font-bold pr-4 text-sky-500">
            Simple Twitter
          </h1>
          <button onClick={toggleTheme}>
            {isDarkTheme ? (
              <MdLightMode color="white" size={20} />
            ) : (
              <MdDarkMode color="#0A2540" size={20} />
            )}
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
            <div
              className={classNames(
                "w-full flex flex-col justify-center items-center rounded-lg overflow-hidden mb-4 shadow-md",
                {
                  "bg-gray-800 text-white": isDarkTheme,
                  "shadow-lg": isDarkTheme,
                  "bg-white": !isDarkTheme,
                }
              )}
            >
              <textarea
                className={classNames("w-full h-28 px-5 py-4 outline-none", {
                  "border-gray-700": isDarkTheme,
                  "bg-gray-800 text-white": isDarkTheme,
                })}
                value={text}
                onChange={handleChangeCaracteres}
                maxLength="255"
                style={{ resize: "none" }}
                placeholder="Sem ideias? Que tal escrever como foi seu dia..."
              />
              {imagePreviewURL && (
                // Adicionando uma linha separadora
                <hr
                  className={classNames("w-full border-t border-gray-300", {
                    "border-gray-700": isDarkTheme,
                  })}
                />
              )}
              {imagePreviewURL && (
                <div className="flex flex-col items-center relative mt-5 ">
                  <button
                    className="flex items-center absolute -top-5 -left-2 p-2"
                    onClick={handleCancelImage}
                  >
                    <BsX size={30} />
                    <span className="ml-1 text-gray-500 text-xs">
                      Pressione o X para remover a imagem
                    </span>
                  </button>
                  <img
                    src={imagePreviewURL}
                    alt="Preview"
                    className="mt-6 mb-5 rounded-lg"
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-between pl-2">
              <span className="text-emerald-500">
                Você ainda pode digitar {textLimit - text.length} caracteres
              </span>

              <div className="flex justify-center items-center gap-5">
                <label htmlFor="upload-button" className="cursor-pointer">
                  <FaImage size={20} color="#3b91fa" />
                  <input
                    id="upload-button"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                      const imageUrl = URL.createObjectURL(e.target.files[0]);
                      setImagePreviewURL(imageUrl); // Atualizar o URL temporário da imagem
                    }}
                  />
                </label>

                <button
                  onClick={handleAddTweet}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md"
                >
                  publicar
                </button>
              </div>
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
                style={{ maxWidth: "100%" }}
              >
                <h1 className="text-xl pt-4 pl-2 mb-7">{tweet.text}</h1>
                {tweet.imageURL && (
                  <a
                    href={tweet.imageURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={tweet.imageURL}
                      alt="Tweet Image"
                      className="mb-4 mx-auto cursor-pointer"
                      style={{ maxWidth: "70%", display: "block" }}
                    />
                  </a>
                )}
                <div className="flex justify-between items-center mt-auto pb-3">
                  <span className="text-sky-500 pl-2">{tweet.user}</span>
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

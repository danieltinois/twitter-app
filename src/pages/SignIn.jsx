import { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";

import { auth } from "../services/firebase";

import classNames from "classnames";

import { App } from "../layouts/App";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const navigate = useNavigate();

  function handleSignIn(e) {
    e.preventDefault();

    if (!email) {
      setEmailError("O campo de e-mail é necessário.");
      return;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("O campo de senha é necessário.");
      return;
    } else {
      setPasswordError("");
    }

    if (email && password) {
      signInWithEmailAndPassword(email, password);
      setEmail("");
      setPassword("");
    }
  }

  useEffect(() => {
    if (error) {
      setErrorMessage("Email/Senha podem estar incorretos.");
      setIsErrorVisible(true);

      const timeOut = setTimeout(() => {
        setIsErrorVisible(false);
      }, 3000);

      return () => clearTimeout(timeOut);
    }
  }, [error]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <App>
      <div
        className={classNames(
          "bg-red-500 text-white w-full p-2 text-center fixed top-0 z-50",
          { "opacity-0": !isErrorVisible },
          { "transition-opacity duration-300": isErrorVisible }
        )}
      >
        {errorMessage}
      </div>
      <div className="flex items-center justify-center w-screen h-screen flex-col">
        <h1 className="font-sans text-3xl text-sky-500 pb-6">Aluritter</h1>
        <form className="flex flex-col w-full lg:w-1/4 md:w-1/3 sm:w-1/2 px-10 sm:px-0">
          <div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={classNames(
                "w-full p-2 border border-slate-400 rounded text-gray-500 placeholder-slate-400",
                { "border-red-500": error } // Adiciona a classe de erro se houver um erro de autenticação
              )}
              placeholder="email@exemplo.com"
              type="email"
              required
              maxLength={255}
              minLength={5}
            />
            {emailError && <p className="text-red-500 pt-1">{emailError}</p>}
          </div>
          <div className="mt-2.5">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={classNames(
                "w-full p-2 border border-slate-400 rounded text-gray-500 placeholder-slate-400",
                { "border-red-500": error } // Adiciona a classe de erro se houver um erro de validação
              )}
              placeholder="Senha"
              type="password"
              required
              maxLength={255}
              minLength={8}
            />
            {passwordError && (
              <p className="text-red-500 pt-1">{passwordError}</p>
            )}
          </div>
          <button
            className="mt-5 p-2 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-100"
            onClick={handleSignIn}
            type="button"
          >
            Acessar plataforma
          </button>
        </form>
        <div className="mt-2">
          <span className="text-sm mt-2 text-gray-500">
            Não possui uma conta?{" "}
          </span>
          <Link className="text-sky-500 hover:underline" to="/sign-up">
            Crie uma agora!
          </Link>
        </div>
      </div>
    </App>
  );
};

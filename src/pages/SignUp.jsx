import { useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

import { auth } from "../services/firebase";

import classNames from "classnames";

import { App } from "../layouts/App";

import { GrFormViewHide, GrFormView } from "react-icons/gr";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const minimalText = 6;
  const [hidePassWord, setHidePassword] = useState("password");
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  function handleHidePassword() {
    if (hidePassWord === "password") {
      setHidePassword("text");
    } else {
      setHidePassword("password");
    }
  }

  function handleChangeCaracteres(e) {
    const textType = e.target.value;

    if (textType.length <= minimalText) {
      setPassword(textType);
    } else {
      setPassword("");
    }
  }

  function handleSignUp(e) {
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
      createUserWithEmailAndPassword(email, password);
      setEmail("");
      setPassword("");
    }
  }

  useEffect(() => {
    setIsButtonDisabled(password.length < 6);
  }, [password]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorMessage) setErrorMessage("");
      if (successMessage) setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, successMessage]);

  useEffect(() => {
    if (user) {
      setSuccessMessage("Usuario cadastrado com sucesso!");
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setErrorMessage("Endereço de e-mail inválido.");
          break;
        case "auth/weak-password":
          setErrorMessage("A senha é muito fraca.");
          break;
        case "auth/email-already-in-use":
          setErrorMessage("Este e-mail já está cadastrado.");
          break;
        default:
          setErrorMessage("Ocorreu um erro ao criar a conta.");
      }
    }
  }, [error]);

  const remainingCharacters = Math.max(minimalText - password.length, 0);

  return (
    <App>
      <div
        className={classNames(
          "bg-red-500 text-white w-full p-2 text-center fixed top-0 z-50 transition-opacity duration-300",
          { "opacity-0": !errorMessage }
        )}
      >
        <p>{errorMessage}</p>
      </div>

      <div
        className={classNames(
          "bg-green-500 text-white w-full p-2 text-center fixed top-0 z-50 transition-opacity duration-300",
          { "opacity-0": !successMessage }
        )}
      >
        <p>{successMessage}</p>
      </div>

      <div className="flex items-center justify-center w-screen h-screen flex-col dark:bg-gray-900">
        <h1 className="font-sans text-3xl text-sky-500 pb-1">Aluritter</h1>
        <p className="pb-5 text-gray-500">
          Crie uma nova conta e comece aluritar agora mesmo =)
        </p>
        <div className="flex flex-col w-full lg:w-1/4 md:w-1/3 sm:w-1/2 px-10 sm:px-0">
          <div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={classNames(
                "w-full p-2 border border-slate-400 rounded text-gray-500 placeholder-slate-400 dark:bg-gray-800 dark:border-slate-700 dark:text-white"
              )}
              placeholder="email@exemplo.com"
              type="email"
            />
            {emailError && <p className="text-red-500 pt-1">{emailError}</p>}
          </div>
          <div className="mt-2.5">
            <div className="flex w-full mt-1 mb-2 focus-within:border-black border border-slate-400 rounded text-gray-500 placeholder-slate-400 dark:bg-gray-800 dark:border-slate-700 dark:text-white dark:focus-within:border-white">
              <input
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value) && handleChangeCaracteres
                }
                className="w-full p-2 border-none bg-transparent outline-none"
                placeholder="Senha"
                type={hidePassWord}
              />
              <button className="mr-2" onClick={handleHidePassword}>
                {hidePassWord !== "text" ? (
                  <GrFormViewHide size={30} color="#94A3B8" />
                ) : (
                  <GrFormView size={30} color="#94A3B8" />
                )}
              </button>
            </div>
            <span className="text-gray-400 text-sm pl-1">
              Preencha com no mínimo {remainingCharacters} caracteres
            </span>
            {passwordError && (
              <p className="text-red-500 pt-1">{passwordError}</p>
            )}
          </div>
          <button
            onClick={handleSignUp}
            disabled={isButtonDisabled}
            className={classNames(
              "mt-4 p-2 rounded hover:bg-emerald-600 text-slate-100",
              {
                "bg-emerald-500": !isButtonDisabled,
                "bg-emerald-800 cursor-not-allowed": isButtonDisabled,
              }
            )}
            type="submit"
          >
            Criar uma nova conta
          </button>
        </div>
        <div className="mt-2">
          <span className="text-sm mt-2 text-gray-500">
            Ja possui uma conta?{" "}
          </span>
          <Link className="text-sky-500 hover:underline" to="/sign-in">
            Acesse agora!
          </Link>
        </div>
      </div>
    </App>
  );
};

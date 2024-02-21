import { useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

import { auth } from "../services/firebase";

import classNames from "classnames";

import { App } from "../layouts/App";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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

      <div className="flex items-center justify-center w-screen h-screen flex-col">
        <h1 className="font-sans text-3xl text-sky-500 pb-1">Aluritter</h1>
        <p className="pb-5 text-gray-500">
          Crie uma nova conta e comece aluritar agora mesmo =)
        </p>
        <form className="flex flex-col w-full lg:w-1/4 md:w-1/3 sm:w-1/2 px-10 sm:px-0">
          <div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={classNames(
                "w-full p-2 border border-slate-400 rounded text-gray-500 placeholder-slate-400"
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
                "w-full p-2 mb-1 border border-slate-400 rounded text-gray-500 placeholder-slate-400"
              )}
              placeholder="Senha"
              type="password"
              required
              maxLength={255}
              minLength={8}
            />
            <span className="text-gray-400 text-sm">
              Preencha com no mínimo 6 caracteres
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
        </form>
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

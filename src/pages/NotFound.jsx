import { App } from "../layouts/App";

import imgNotFound from "../assets/imgs/notFoundError.gif";

export const NotFound = () => {
  return (
    <App>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col justify-center items-center bg-white w-2/5 h-1/2 rounded-2xl">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Oops!
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Parece que você se perdeu...
          </p>
          <img src={imgNotFound} alt="Error" className="w-full md:w-auto" />
          <p className="text-sm text-gray-500 mt-4">
            Erro 404: Página não encontrada
          </p>
        </div>
      </div>
    </App>
  );
};

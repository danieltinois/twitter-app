import { App } from "../layouts/App";

import imgNotFound from "../assets/imgs/notFoundError.gif";

export const NotFound = () => {
  return (
    <App>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col justify-center items-center shadow-xl bg-white max-w-3xl h-auto rounded-2xl dark:bg-gray-800">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 mt-6 dark:text-gray-200">
            Oops!
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 dark:text-gray-400">
            Parece que você se perdeu...
          </p>
          <div className="flex justify-center items-center select-none">
            <img
              src={imgNotFound}
              alt="Error"
              className="w-full md:w-auto mr-20"
            />
          </div>
          <p className="text-sm text-gray-500 mt-7 mb-10 dark:text-gray-400 ">
            Erro 404: Página não encontrada
          </p>
        </div>
      </div>
    </App>
  );
};

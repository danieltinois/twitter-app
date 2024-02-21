import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Home } from "./Home";
import { NotFound } from "./NotFound";
import { SignUp } from "./SignUp";
import { SignIn } from "./SignIn";

export const Pages = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

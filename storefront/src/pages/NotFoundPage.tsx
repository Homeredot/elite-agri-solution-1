import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="page-stack">
    <section className="glass success-stage">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="primary-btn">
        Back home
      </Link>
    </section>
  </div>
);

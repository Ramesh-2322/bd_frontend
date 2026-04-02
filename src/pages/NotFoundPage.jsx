import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="grid min-h-[70vh] place-content-center px-4 text-center">
      <h1 className="text-6xl font-black text-medical-700">404</h1>
      <p className="mt-3 text-slate-600">The page you requested does not exist.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </main>
  );
}

export default NotFoundPage;

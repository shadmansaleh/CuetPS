import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function NotFound404() {
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = setTimeout(async () => {
      await navigate(`${__BASE_URL__}/`);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (
    <div className="hero min-h-screen">
      <div className="hero-body">
        <h1 className="text-[16rem] font-bold mx-auto text-center p-2">404</h1>
        <h2 className="text-4xl font-normal mx-auto text-center p-2">
          Not Found
        </h2>
        <h3 className="text-xl font-normal mx-auto text-center p-2">
          The requested resource could not be found. Redirecting to home page...
        </h3>
      </div>
    </div>
  );
}

export default NotFound404;

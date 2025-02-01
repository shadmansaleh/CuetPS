import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function NavBar() {
  const [_scrollPosition, setScrollPosition] = useState(0);
  const [isSmallWin, setIsSmallWin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isSignedIn = user !== null;
  const isAdmin = isSignedIn && user?.role === "admin";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };
    window.addEventListener("scroll", handleScroll);
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsSmallWin(screenWidth < 768); // Adjust the screen width breakpoint as needed
    };
    handleResize(); // Call the function initially
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // const navbar_height = 12;
  const dark_section = () => {
    // const path = window.location.pathname;
    // if (path !== "/") return false;
    // const page_pos: number[] = [];
    // const height = window.innerHeight;

    // for (let i = 0; i < page_pos.length; i++) {
    //   if ((scrollPosition + (navbar_height * 4) / 2) / height > page_pos[i])
    //     return i % 2 === 1;
    // }
    return false;
  };

  const nav_items = [
    {
      name: !isAdmin ? "Home" : "Admin",
      link: !isAdmin ? "/" : "/admin",
    },
    {
      name: "Gallery",
      link: "/gallery",
      cond: !isAdmin,
    },
    {
      name: "Exhibitions",
      link: "/exhibitions",
      cond: !isAdmin,
    },
    {
      name: "About us",
      link: "/about",
      cond: !isAdmin,
    },
    {
      name: "Profile",
      link: "/profile",
      cond: isSignedIn,
    },
    {
      name: "Login",
      link: "/login",
      cond: !isSignedIn,
    },
    {
      name: "Logout",
      onClick: () => signOut(),
      cond: isSignedIn,
    },
  ];
  const active = window.location.pathname;

  return (
    <>
      <nav className="navbar bg-base-100 bg-transparent shadow-lg lg:w-[80vw] lg:mx-[10vw] rounded-xl sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex-1">
          <Link to="/">
            {/* <img
              src={dark_section() ? logo_dark : logo_light}
              alt="CSF logo"
              className={`h-${navbar_height} w-12`}
            /> */}
          </Link>
          <Link
            to="/"
            className={`px-6 text-xl font-lora font-semibold ${
              dark_section() ? "text-gray-300" : "text-gray-700"
            }`}
          >
            CUETPS
          </Link>
        </div>
        {!isSmallWin && (
          <div className={`flex-none`}>
            <ul
              className={`menu menu-horizontal px-1 no-animation ${
                dark_section() ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {nav_items.map(
                (item) =>
                  item.cond !== false && (
                    <li key={item.name}>
                      <button
                        onClick={
                          item.onClick
                            ? item.onClick
                            : () => {
                                navigate(item.link);
                              }
                        }
                        className={`hover:underline  btn btn-sm btn-ghost font-normal ${
                          active === item.link &&
                          (dark_section() ? "text-pink-500" : "text-pink-600")
                        }`}
                      >
                        {item.name}
                      </button>
                    </li>
                  )
              )}
            </ul>
          </div>
        )}
        {isSmallWin && (
          <div className={`flex-none relative`}>
            <button
              className="btn btn-ghost btn-sm rounded-md"
              onClick={toggleMenu}
            >
              {!isMenuOpen ? (
                <RxHamburgerMenu
                  size={28}
                  className={`${
                    dark_section() ? "text-gray-300" : "text-gray-700"
                  }`}
                />
              ) : (
                <IoCloseOutline
                  size={28}
                  className={`${
                    dark_section() ? "text-gray-300" : "text-gray-700"
                  }`}
                />
              )}
            </button>
            {isMenuOpen && (
              <div className="absolute inset-0 bg-base-200 bg-opacity-90 z-50 top-12 mr-12">
                <div className="flex flex-col items-center h-screen ">
                  <ul
                    className={`menu menu-vertical no-animation
                   ${dark_section() ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {nav_items.map(
                      (item) =>
                        item.cond !== false && (
                          <li
                            key={item.name}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <button
                              onClick={
                                item.onClick
                                  ? item.onClick
                                  : () => {
                                      navigate(item.link);
                                    }
                              }
                              className={`hover:underline btn btn-ghost font-normal ${
                                active === item.link &&
                                (dark_section()
                                  ? "text-pink-500"
                                  : "text-pink-600")
                              } `}
                            >
                              {item.name}
                            </button>
                          </li>
                        )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

export default NavBar;

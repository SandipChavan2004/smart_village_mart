import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { User, Store, Menu, X, Search, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import NotificationsDropdown from "./NotificationsDropdown";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Price Comparison", path: "/price-comparison" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Chat Support", path: "/chatbot" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-5">
        <nav
          className="flex h-16 items-center justify-between"
          aria-label="Main Navigation"
        >
          {/* 🔥 Logo */}
          <Link
            to="/"
            className="flex items-center gap-2"
            aria-label="Smart Village Mart Home"
          >
            <img
              src="/logo/logo.png"
              alt="Smart Village Mart Logo"
              className=" w-48"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-6 text-sm font-medium">
              {navLinks.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `transition ${isActive
                        ? "text-emerald-600"
                        : "text-gray-600 hover:text-gray-900"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Notifications Dropdown */}
                <NotificationsDropdown />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label="User Menu"
                      className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-gray-100"
                    >
                      <User className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    side="bottom"
                    sideOffset={16}
                    className="w-[30vw] min-w-[320px] max-w-[400px] h-[calc(100vh-4.5rem)] overflow-hidden rounded-2xl rounded-r-none border-r-0 shadow-2xl p-0"
                  >
                    {/* Header with gradient */}
                    <div className="px-6 py-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{user?.name || 'User'}</p>
                          <p className="text-xs text-emerald-100 capitalize">{user?.role || 'Member'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-3">
                      <DropdownMenuItem asChild className="mb-2 p-4 rounded-xl hover:bg-emerald-50 transition-all cursor-pointer">
                        <Link
                          to={
                            user?.role === "customer"
                              ? "/customer/dashboard"
                              : "/shopkeeper/dashboard"
                          }
                          className="flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Store className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Dashboard</p>
                            <p className="text-xs text-gray-500">View your dashboard</p>
                          </div>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className="mb-2 p-4 rounded-xl hover:bg-emerald-50 transition-all cursor-pointer">
                        <Link to="/profile" className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">My Profile</p>
                            <p className="text-xs text-gray-500">Manage your account</p>
                          </div>
                        </Link>
                      </DropdownMenuItem>

                      <div className="my-2 border-t"></div>

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="p-4 rounded-xl hover:bg-red-50 transition-all cursor-pointer text-red-600"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <LogOut className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Logout</p>
                            <p className="text-xs text-red-400">Sign out of your account</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="ghost">
                  <Link to="/customer-login">Customer Login</Link>
                </Button>
                <Button asChild className="rounded-full">
                  <Link to="/shopkeeper-login">Become a Seller</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            aria-label="Toggle Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4">
            <ul className="flex flex-col gap-4 text-sm font-medium">
              {navLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path}>{item.name}</Link>
                </li>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    to={
                      user?.role === "customer"
                        ? "/customer/dashboard"
                        : "/shopkeeper/dashboard"
                    }
                  >
                    Dashboard
                  </Link>
                  <Link to="/profile">My Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/customer-login">Customer Login</Link>
                  <Link to="/shopkeeper-login">Become a Seller</Link>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

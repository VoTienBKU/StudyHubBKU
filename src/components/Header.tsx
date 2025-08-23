import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, TrendingUp, MessageSquare, FileText, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { path: "/schedule", label: "Thời khóa biểu", short: "TKB", icon: Calendar },
  { path: "/grade-prediction", label: "Dự đoán điểm TB", short: "GPA", icon: TrendingUp },
  { path: "/course-review", label: "Review môn học", short: "Review", icon: MessageSquare },
  { path: "/exam-archive", label: "Đề thi", short: "Đề thi", icon: FileText },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-card shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between">
<<<<<<< HEAD
          <Link to="/" className="flex items-center space-x-1 sm:space-x-2">
            <GraduationCap className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
            <span className="text-lg sm:text-xl font-bold text-foreground">StudyHubBKU</span>
          </Link>

          <nav className="flex items-center space-x-1 sm:space-x-4">
            <Button
              variant={location.pathname === "/schedule" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/schedule" className="flex items-center space-x-1 sm:space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Thời khóa biểu</span>
                <span className="sm:hidden text-xs">TKB</span>
              </Link>
            </Button>

            <Button
              variant={location.pathname === "/grade-prediction" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/grade-prediction" className="flex items-center space-x-1 sm:space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Dự đoán điểm TB</span>
                <span className="sm:hidden text-xs">GPA</span>
              </Link>
            </Button>
=======
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 sm:space-x-2">
            <GraduationCap className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
            <span className="text-lg sm:text-xl font-bold text-foreground">
              StudyHubBKU
            </span>
          </Link>

          {/* Navigation */}
          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center space-x-1 sm:space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Button
                  key={path}
                  variant={active ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to={path} className="flex items-center space-x-2">
                    <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                    <span>{label}</span>
                  </Link>
                </Button>
              );
            })}
>>>>>>> refs/remotes/origin/main
          </nav>

          {/* Mobile nav (dropdown) */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navItems.map(({ path, label, short, icon: Icon }) => {
                  const active = location.pathname === path;
                  return (
                    <DropdownMenuItem key={path} asChild>
                      <Link
                        to={path}
                        className={`flex items-center space-x-2 px-2 py-1.5 rounded-md ${active ? "bg-primary/10 text-primary" : "text-foreground"
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

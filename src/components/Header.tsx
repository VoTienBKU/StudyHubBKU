import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, TrendingUp } from "lucide-react";

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-card shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between">
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
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, TrendingUp } from "lucide-react";

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-card shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">StudyHubBKU</span>
          </Link>

          <nav className="flex items-center space-x-4">
            <Button
              variant={location.pathname === "/schedule" ? "default" : "ghost"}
              asChild
            >
              <Link to="/schedule" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Thời khóa biểu</span>
              </Link>
            </Button>

            <Button
              variant={location.pathname === "/grade-prediction" ? "default" : "ghost"}
              asChild
            >
              <Link to="/grade-prediction" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Dự đoán điểm TB</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
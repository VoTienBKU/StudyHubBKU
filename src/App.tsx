import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // <-- HashRouter
import { useVisitTracker } from "@/hooks/useVisitTracker";
import Index from "./pages/Index";
import Schedule from "./pages/Schedule";
import GradePrediction from "./pages/GradePrediction";
import CourseReview from "./pages/CourseReview";
import NotFound from "./pages/NotFound";
import ExamArchive from "./pages/ExamArchive";

const queryClient = new QueryClient();

const AppContent = () => {
  useVisitTracker();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/grade-prediction" element={<GradePrediction />} />
      <Route path="/course-review" element={<CourseReview />} />
      <Route path="/exam-archive" element={<ExamArchive />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter> {/* <-- dùng HashRouter */}
        <AppContent />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

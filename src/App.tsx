import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // <-- HashRouter
import Index from "./pages/Index";
import Schedule from "./pages/Schedule";
import GradePrediction from "./pages/GradePrediction";
import CourseReview from "./pages/CourseReview";
import NotFound from "./pages/NotFound";
import ExamArchive from "./pages/ExamArchive";
import LearningSchedule from "./pages/LearningSchedule";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter> {/* <-- dùng HashRouter */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/grade-prediction" element={<GradePrediction />} />
          <Route path="/course-review" element={<CourseReview />} />
          <Route path="/exam-archive" element={<ExamArchive />} />
          <Route path="/learningschedule" element={<LearningSchedule />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

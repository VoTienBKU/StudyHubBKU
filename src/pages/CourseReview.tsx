import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Search, Plus, BookOpen, Clock, Brain, ThumbsUp, ExternalLink, Lightbulb, Filter, Calendar } from "lucide-react";
import { saveToLocalStorage, STORAGE_KEYS } from "@/utils/localStorage";
import coursesReview from "@/data/course_review.json";

interface CourseReview {
  id: string;
  courseCode: string;
  courseName: string;
  semester: {
    KHMT: string;
    KTMT: string;
  };
  rating: number;
  difficulty: number;
  workload: number;
  review: string;
  BTL?: string;
  Lab?: string;
  CK_CK?: string;
  tips: string[];
  wouldRecommend: boolean;
  FB: string;
  author: string;
  prerequisites?: string[];
  followups?: string[];
}

const CourseReview = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMajor, setSelectedMajor] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const sampleReviews: CourseReview[] = (coursesReview as CourseReview[]) || [];
    setReviews(sampleReviews);
  }, []);

  // Extract unique semester options from data and sort them logically
  const semesterOptions = useMemo(() => {
    const allSemesters = new Set<string>();
    reviews.forEach(review => {
      if (review.semester.KHMT) allSemesters.add(review.semester.KHMT);
      if (review.semester.KTMT) allSemesters.add(review.semester.KTMT);
    });

    // Sort semesters logically: Year 1 before Year 2, HK1 before HK2
    return Array.from(allSemesters).sort((a, b) => {
      // Extract year and semester number
      const getYearAndSemester = (str: string) => {
        const yearMatch = str.match(/Năm (\d+)/);
        const semesterMatch = str.match(/HK(\d+)/);
        return {
          year: yearMatch ? parseInt(yearMatch[1]) : 999,
          semester: semesterMatch ? parseInt(semesterMatch[1]) : 999
        };
      };

      const aData = getYearAndSemester(a);
      const bData = getYearAndSemester(b);

      // Sort by year first, then by semester
      if (aData.year !== bData.year) {
        return aData.year - bData.year;
      }
      return aData.semester - bData.semester;
    });
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      // Search filter
      const matchesSearch = review.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.courseName.toLowerCase().includes(searchQuery.toLowerCase());

      // Major filter
      let matchesMajor = true;
      if (selectedMajor !== "all") {
        const majorSemester = selectedMajor === "KHMT" ? review.semester.KHMT : review.semester.KTMT;
        matchesMajor = Boolean(majorSemester);
      }

      // Semester filter
      let matchesSemester = true;
      if (selectedSemester !== "all") {
        matchesSemester = review.semester.KHMT === selectedSemester || 
                         review.semester.KTMT === selectedSemester;
      }

      return matchesSearch && matchesMajor && matchesSemester;
    });
  }, [reviews, searchQuery, selectedMajor, selectedSemester]);

  const getRatingColor = (rating: number) => {
    const colors = ["bg-red-100 text-red-700", "bg-orange-100 text-orange-700", "bg-yellow-100 text-yellow-700", "bg-blue-100 text-blue-700", "bg-green-100 text-green-700"];
    return colors[rating - 1] || "bg-gray-100 text-gray-700";
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = ["bg-green-100 text-green-700", "bg-blue-100 text-blue-700", "bg-yellow-100 text-yellow-700", "bg-orange-100 text-orange-700", "bg-red-100 text-red-700"];
    return colors[difficulty - 1] || "bg-gray-100 text-gray-700";
  };

  const getWorkloadColor = (workload: number) => {
    const colors = ["bg-green-100 text-green-700", "bg-blue-100 text-blue-700", "bg-yellow-100 text-yellow-700", "bg-orange-100 text-orange-700", "bg-red-100 text-red-700"];
    return colors[workload - 1] || "bg-gray-100 text-gray-700";
  };

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ["Rất dễ", "Dễ", "Trung bình", "Khó", "Rất khó"];
    return labels[difficulty - 1] || "N/A";
  };

  const getWorkloadLabel = (workload: number) => {
    const labels = ["Rất ít", "Ít", "Trung bình", "Nhiều", "Rất nhiều"];
    return labels[workload - 1] || "N/A";
  };

  const handleAddReview = () => {
    setShowAddForm(true);
  };

  const clearFilters = () => {
    setSelectedMajor("all");
    setSelectedSemester("all");
    setSearchQuery("");
  };

  const goToSchedulePage = (courseCode: string) => {
    // Save search query to localStorage for Schedule page to pick up
    const currentFilters = {
      searchQ: courseCode,
      activeCampus: "all",
      selectedLecturer: "all",
      filterByDate: false,
      selectedDate: null,
      viewMonth: new Date().getMonth(),
      viewYear: new Date().getFullYear()
    };

    saveToLocalStorage(STORAGE_KEYS.SCHEDULE_FILTERS, currentFilters);

    // Navigate to schedule page
    navigate('/schedule');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Review Môn Học
          </h1>
          <p className="text-muted-foreground">
            Chia sẻ trải nghiệm và đánh giá về các môn học
          </p>
        </div>

        {/* Search + Filters + Add Review */}
        <div className="space-y-4 mb-6">
          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã môn hoặc tên môn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleAddReview} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Thêm Review
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Bộ lọc:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Major Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Chuyên ngành:</span>
                <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="KHMT">KHMT</SelectItem>
                    <SelectItem value="KTMT">KTMT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Semester Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Học kỳ:</span>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {semesterOptions.map(semester => (
                      <SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {(selectedMajor !== "all" || selectedSemester !== "all" || searchQuery) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="whitespace-nowrap"
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Hiển thị {filteredReviews.length} trên {reviews.length} review
            </span>
            {(selectedMajor !== "all" || selectedSemester !== "all") && (
              <div className="flex items-center gap-2">
                <span>Bộ lọc hiện tại:</span>
                {selectedMajor !== "all" && (
                  <Badge variant="secondary">{selectedMajor}</Badge>
                )}
                {selectedSemester !== "all" && (
                  <Badge variant="secondary">{selectedSemester}</Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Không tìm thấy review nào</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedMajor !== "all" || selectedSemester !== "all" 
                    ? "Thử thay đổi điều kiện tìm kiếm hoặc bộ lọc" 
                    : "Hãy là người đầu tiên chia sẻ review"}
                </p>
                {!(searchQuery || selectedMajor !== "all" || selectedSemester !== "all") && (
                  <Button onClick={handleAddReview}>Thêm Review Đầu Tiên</Button>
                )}
                {(searchQuery || selectedMajor !== "all" || selectedSemester !== "all") && (
                  <Button variant="outline" onClick={clearFilters}>Xóa bộ lọc</Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Course Info */}
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">
                        {review.courseCode} - {review.courseName}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>KHMT: {review.semester.KHMT}</span>
                        <span>•</span>
                        <span>KTMT: {review.semester.KTMT}</span>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="flex flex-wrap gap-3">
                      {/* Rating */}
                      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm font-medium">{review.rating}/5</span>
                      </div>

                      {/* Difficulty */}
                      <div className="flex items-center gap-1">
                        <Brain className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className={`text-xs ${getDifficultyColor(review.difficulty)}`}>
                          {getDifficultyLabel(review.difficulty)}
                        </Badge>
                      </div>

                      {/* Workload */}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className={`text-xs ${getWorkloadColor(review.workload)}`}>
                          {getWorkloadLabel(review.workload)}
                        </Badge>
                      </div>

                      {/* Recommend */}
                      {review.wouldRecommend && (
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 text-green-600" />
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            Recommend
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Review Text */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm leading-relaxed">{review.review}</p>
                  </div>

                  {/* BTL / Lab / CK Grid */}
                  {(review.BTL || review.Lab || review.CK_CK) && (
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {review.BTL && (
                        <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                          <h5 className="font-medium text-purple-800 text-xs mb-1">BTL</h5>
                          <p className="text-xs text-purple-700">{review.BTL}</p>
                        </div>
                      )}
                      {review.Lab && (
                        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                          <h5 className="font-medium text-orange-800 text-xs mb-1">Lab</h5>
                          <p className="text-xs text-orange-700">{review.Lab}</p>
                        </div>
                      )}
                      {review.CK_CK && (
                        <div className="bg-pink-50 border border-pink-200 p-3 rounded-lg">
                          <h5 className="font-medium text-pink-800 text-xs mb-1">CK / GK</h5>
                          <p className="text-xs text-pink-700">{review.CK_CK}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tips */}
                  {review.tips && review.tips.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <div className="flex items-center gap-1 mb-2">
                        <Lightbulb className="h-3 w-3 text-blue-600" />
                        <h4 className="font-medium text-blue-800 text-sm">Tips</h4>
                      </div>
                      <ul className="space-y-1">
                        {review.tips.map((tip, index) => (
                          <li key={index} className="text-xs text-blue-700 flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prerequisites + Followups */}
                  {(review.prerequisites?.length || review.followups?.length) && (
                    <div className="flex flex-wrap gap-4 text-xs">
                      {review.prerequisites?.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Môn tiên quyết:</span>
                          <div className="flex gap-1">
                            {review.prerequisites.map((prereq, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {prereq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {review.followups?.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Nên học sau:</span>
                          <div className="flex gap-1">
                            {review.followups.map((followup, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {followup}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      Review bởi <span className="font-medium">{review.author}</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => goToSchedulePage(review.courseCode)}
                        className="h-7 px-2 text-xs flex items-center gap-1"
                      >
                        <Calendar className="h-3 w-3" />
                        Thời Khóa Biểu
                      </Button>
                      {review.FB && (
                        <a
                          href={review.FB}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Facebook
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Thêm Review Môn Học</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Tính năng đang phát triển. Quay lại sau nhé!
                </p>
                <Button onClick={() => setShowAddForm(false)} className="w-full">Đóng</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CourseReview;

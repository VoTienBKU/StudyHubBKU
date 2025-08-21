import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Search, Plus, BookOpen, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CourseReview {
  id: string;
  courseCode: string;
  courseName: string;
  lecturer: string;
  semester: string;
  rating: number;
  difficulty: number;
  workload: number;
  review: string;
  pros: string[];
  cons: string[];
  tips: string;
  wouldRecommend: boolean;
  createdAt: string;
  author: string;
}

const CourseReview = () => {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const { toast } = useToast();

  // Sample data for demonstration
  useEffect(() => {
    const sampleReviews: CourseReview[] = [
      {
        id: "1",
        courseCode: "CO2003",
        courseName: "Cấu trúc dữ liệu và giải thuật",
        lecturer: "Nguyễn Văn A",
        semester: "HK1 2024-2025",
        rating: 4,
        difficulty: 4,
        workload: 4,
        review: "Môn học rất quan trọng và hữu ích cho ngành KHMT. Giảng viên giảng dạy rất tốt, có nhiều ví dụ thực tế.",
        pros: ["Kiến thức nền tảng quan trọng", "Giảng viên nhiệt tình", "Bài tập thực hành phong phú"],
        cons: ["Khối lượng bài tập nhiều", "Đề thi khó"],
        tips: "Nên làm nhiều bài tập trên LeetCode để rèn luyện thêm",
        wouldRecommend: true,
        createdAt: "2024-01-15",
        author: "Sinh viên K19"
      },
      {
        id: "2",
        courseCode: "CO2012",
        courseName: "Lập trình hướng đối tượng",
        lecturer: "Trần Thị B",
        semester: "HK2 2023-2024",
        rating: 5,
        difficulty: 3,
        workload: 3,
        review: "Môn học rất thú vị, giúp hiểu rõ về OOP. Project cuối kỳ rất bổ ích.",
        pros: ["Kiến thức thực tế", "Project thú vị", "Giảng viên hỗ trợ tốt"],
        cons: ["Cần thời gian để làm quen với Java"],
        tips: "Nên thực hành code nhiều và tham khảo các design pattern",
        wouldRecommend: true,
        createdAt: "2024-01-10",
        author: "Sinh viên K18"
      }
    ];
    setReviews(sampleReviews);
  }, []);

  const filteredReviews = reviews.filter(review =>
    review.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.lecturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ["Rất dễ", "Dễ", "Trung bình", "Khó", "Rất khó"];
    return labels[difficulty - 1] || "Không xác định";
  };

  const getWorkloadLabel = (workload: number) => {
    const labels = ["Rất ít", "Ít", "Trung bình", "Nhiều", "Rất nhiều"];
    return labels[workload - 1] || "Không xác định";
  };

  const handleAddReview = () => {
    setShowAddForm(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Review Môn Học KHMT (Đang update tính năng)
            </h1>
            <p className="text-sm text-muted-foreground">
              Chia sẻ trải nghiệm và đánh giá về các môn học trong chương trình Khoa học máy tính
            </p>
          </div>

          {/* Search and Add Review */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã môn, tên môn hoặc giảng viên..."
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

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">{reviews.length}</h3>
                <p className="text-sm text-muted-foreground">Môn học đã review</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-accent mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">
                  {reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0}
                </h3>
                <p className="text-sm text-muted-foreground">Điểm đánh giá trung bình</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-education-secondary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">
                  {Math.round(reviews.filter(r => r.wouldRecommend).length / reviews.length * 100) || 0}%
                </h3>
                <p className="text-sm text-muted-foreground">Tỷ lệ recommend</p>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Chưa có review nào
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "Không tìm thấy review phù hợp với từ khóa tìm kiếm" : "Hãy là người đầu tiên chia sẻ review về môn học"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleAddReview}>
                      Thêm Review Đầu Tiên
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredReviews.map((review) => (
                <Card key={review.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">
                          {review.courseCode} - {review.courseName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {review.lecturer} • {review.semester}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.wouldRecommend && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Recommend
                          </Badge>
                        )}
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="text-sm font-medium ml-1">{review.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Rating Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Độ khó:</span>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {renderStars(review.difficulty)}
                          </div>
                          <span className="text-sm">{getDifficultyLabel(review.difficulty)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Khối lượng:</span>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {renderStars(review.workload)}
                          </div>
                          <span className="text-sm">{getWorkloadLabel(review.workload)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div>
                      <h4 className="font-semibold mb-2">Đánh giá:</h4>
                      <p className="text-sm text-muted-foreground">{review.review}</p>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-green-600">Ưu điểm:</h4>
                        <ul className="space-y-1">
                          {review.pros.map((pro, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-green-500 mt-1">+</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-red-600">Nhược điểm:</h4>
                        <ul className="space-y-1">
                          {review.cons.map((con, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-red-500 mt-1">-</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Tips */}
                    {review.tips && (
                      <div>
                        <h4 className="font-semibold mb-2">Tips:</h4>
                        <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-md">
                          💡 {review.tips}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-xs text-muted-foreground">
                        Bởi {review.author} • {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Add Review Form Modal Placeholder */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Thêm Review Môn Học</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Tính năng này đang được phát triển. Vui lòng quay lại sau!
                  </p>
                  <Button onClick={() => setShowAddForm(false)} className="w-full">
                    Đóng
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CourseReview;
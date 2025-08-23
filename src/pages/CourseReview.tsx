import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Search, Plus, BookOpen } from "lucide-react";
import coursesReview from "@/data/course_review.json";

interface CourseReview {
  id: string; // = courseCode
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
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const sampleReviews: CourseReview[] = (coursesReview as CourseReview[]) || [];
    setReviews(sampleReviews);
  }, []);

  const filteredReviews = reviews.filter(review =>
    review.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.courseName.toLowerCase().includes(searchQuery.toLowerCase())
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
              Review Môn Học
            </h1>
            <p className="text-sm text-muted-foreground">
              Chia sẻ trải nghiệm và đánh giá về các môn học trong chương trình Khoa học máy tính
            </p>
          </div>

          {/* Search + Add Review */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
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

          {/* Reviews */}
          <div className="space-y-6">
            {filteredReviews.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Chưa có review nào</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "Không tìm thấy review phù hợp với từ khóa" : "Hãy là người đầu tiên chia sẻ review"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleAddReview}>Thêm Review Đầu Tiên</Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredReviews.map((review) => (
                <Card key={review.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {/* Thông tin môn */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <CardTitle className="text-lg">{review.courseCode} - {review.courseName}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          KHMT: {review.semester.KHMT} • KTMT: {review.semester.KTMT}
                        </p>
                      </div>

                      {/* Recommend + Rating */}
                      <div className="flex items-center gap-4">
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

                      {/* Difficulty + Workload */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Độ khó:</span>
                          <div className="flex items-center gap-1">
                            {renderStars(review.difficulty)}
                            <span className="text-sm">{getDifficultyLabel(review.difficulty)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Khối lượng:</span>
                          <div className="flex items-center gap-1">
                            {renderStars(review.workload)}
                            <span className="text-sm">{getWorkloadLabel(review.workload)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Review */}
                    <div>
                      <h4 className="font-semibold mb-2">Đánh giá:</h4>
                      <p className="text-sm text-muted-foreground">{review.review}</p>
                    </div>

                    {/* BTL / Lab / CK */}
                    {(review.BTL || review.Lab || review.CK_CK) && (
                      <div className="space-y-2">
                        {review.BTL && <p className="text-sm bg-purple-50 p-2 rounded-md"><b>BTL:</b> {review.BTL}</p>}
                        {review.Lab && <p className="text-sm bg-orange-50 p-2 rounded-md"><b>Lab:</b> {review.Lab}</p>}
                        {review.CK_CK && <p className="text-sm bg-pink-50 p-2 rounded-md"><b>CK / GK:</b> {review.CK_CK}</p>}
                      </div>
                    )}

                    {/* Tips */}
                    {review.tips && review.tips.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Tips:</h4>
                        <ul className="space-y-1">
                          {review.tips.map((tip, index) => (
                            <li key={index} className="text-sm text-muted-foreground bg-blue-50 p-2 rounded-md flex items-start gap-2">
                              💡 {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prerequisites + Followups */}
                    {(review.prerequisites?.length || review.followups?.length) && (
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {review.prerequisites?.length > 0 && (
                          <span>Môn trước đó: {review.prerequisites.join(", ")}</span>
                        )}
                        {review.followups?.length > 0 && (
                          <span>Nên học sau: {review.followups.join(", ")}</span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-xs text-muted-foreground">
                        Bởi {review.author} •{" "}
                        {review.FB ? (
                          <a href={review.FB} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Facebook
                          </a>
                        ) : "Không có FB"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Add Form Placeholder */}
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
      </div>
    </Layout>
  );
};

export default CourseReview;

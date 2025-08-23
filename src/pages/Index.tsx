import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, TrendingUp, BookOpen, Users, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Chào mừng đến với <span className="text-primary">StudyHubBKU</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Chúng tôi cần sự <span className="font-medium text-foreground">feedback </span>
              và góp ý nhiều hơn để cải thiện tool.
              Tham gia nhóm:{" "}
              <a
                href="https://www.facebook.com/groups/khmt.ktmt.cse.bku"
                target="_blank"
                rel="noopener noreferrer"
                className="text-education-primary hover:underline"
              >
                Thảo luận kiến thức CNTT trường BK về KHMT(CScience), KTMT(CEngineering)
              </a>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/schedule" className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Xem thời khóa biểu</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/grade-prediction" className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Dự đoán điểm TB</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/course-review" className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Review môn học</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/exam-archive" className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Lưu trữ đề thi</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/learningschedule" className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Thời khóa biểu của bạn</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Tính năng chính
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>Quản lý thời khóa biểu</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Theo dõi lịch học, bài tập và các hoạt động học tập một cách có tổ chức.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
                  <CardTitle>Dự đoán điểm số</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Phân tích xu hướng học tập và dự báo kết quả học tập trong tương lai.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <BookOpen className="h-12 w-12 text-education-secondary mx-auto mb-4" />
                  <CardTitle>Theo dõi tiến độ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Giám sát quá trình học tập và đánh giá hiệu suất học tập cá nhân.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>Review môn học</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Chia sẻ và đọc đánh giá về các môn học từ sinh viên khác.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Update Notice */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="py-8">
                <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Đang phát triển
                </h3>
                <p className="text-muted-foreground text-lg">
                  Các tính năng chính của StudyHubBKU đang được hoàn thiện.
                  Chúng tôi sẽ sớm cung cấp trải nghiệm học tập tuyệt vời cho bạn!
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;

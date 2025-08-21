import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Chào mừng đến với <span className="text-primary">StudyHub</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Ứng dụng hỗ trợ học tập toàn diện cho sinh viên. 
              Quản lý thời khóa biểu và dự đoán điểm số một cách thông minh.
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
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Tính năng chính
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  Các tính năng chính của StudyHub đang được hoàn thiện. 
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

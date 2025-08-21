import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart } from "lucide-react";

const GradePrediction = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Dự đoán điểm trung bình
            </h1>
            <p className="text-muted-foreground">
              Phân tích và dự báo kết quả học tập của bạn
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span>Phân tích điểm số</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <BarChart className="h-16 w-16 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Chức năng đang được cập nhật
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Hệ thống dự đoán điểm trung bình đang được phát triển để cung cấp 
                    những phân tích chính xác và hữu ích cho việc học tập của bạn.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default GradePrediction;
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const Schedule = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Thời khóa biểu
            </h1>
            <p className="text-muted-foreground">
              Quản lý lịch học và hoạt động của bạn
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Lịch học tuần này</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <Clock className="h-16 w-16 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Chức năng đang được cập nhật
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Tính năng thời khóa biểu sẽ sớm được hoàn thiện để bạn có thể 
                    quản lý lịch học một cách hiệu quả nhất.
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

export default Schedule;
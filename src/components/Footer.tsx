import { Facebook, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">StudyHubBKU</h3>
            <p className="text-muted-foreground text-sm">
              Ứng dụng hỗ trợ học tập cho sinh viên,
              quản lý thời khóa biểu và dự đoán điểm số hiệu quả.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Liên hệ</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>votien10cham@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Facebook className="h-4 w-4" />
                <a
                  href="https://www.facebook.com/groups/khmt.ktmt.cse.bku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  Thảo luận kiến thức CNTT trường BK
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>TP Hồ Chí Minh, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Theo dõi</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/Shiba.Vo.Tien"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="mailto:votien10cham@gmail.com"
                className="flex items-center justify-center w-10 h-10 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@votien_shiba"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full hover:opacity-90 transition-opacity"
              >
                {/* TikTok SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 48 48"
                  fill="currentColor"
                >
                  <path d="M40.5,17.2c-1,0.4-2,0.6-3.1,0.6c-0.2,0-0.5,0-0.7,0v10.6c0,6.2-5,11.2-11.2,11.2c-5.9,0-10.8-4.7-11.2-10.6h4.2c0.4,3.3,3.2,5.9,6.8,5.9c3.8,0,6.9-3.1,6.9-6.9V15.8h5.3V17.2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 StudyHubBKU. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
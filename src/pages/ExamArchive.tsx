import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Download, Upload, Calendar, BookOpen, User, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ExamFile {
    id: string;
    courseCode: string;
    courseName: string;
    examType: "midterm" | "final" | "quiz" | "assignment";
    semester: string;
    year: string;
    lecturer: string;
    fileName: string;
    fileSize: string;
    uploadDate: string;
    uploader: string;
    downloadCount: number;
    difficulty: number;
    tags: string[];
}

const ExamArchive = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [selectedExamType, setSelectedExamType] = useState("all");
    const [selectedSemester, setSelectedSemester] = useState("all");
    const [showUploadForm, setShowUploadForm] = useState(false);
    const { toast } = useToast();

    // Sample exam data
    const examFiles: ExamFile[] = [
        {
            id: "1",
            courseCode: "CO2003",
            courseName: "Cấu trúc dữ liệu và giải thuật",
            examType: "midterm",
            semester: "HK1",
            year: "2024-2025",
            lecturer: "Nguyễn Văn A",
            fileName: "CO2003_GiuaKy_2024.pdf",
            fileSize: "2.3 MB",
            uploadDate: "2024-01-15",
            uploader: "Sinh viên K19",
            downloadCount: 45,
            difficulty: 4,
            tags: ["Thuật toán", "Cây", "Đồ thị"]
        },
        {
            id: "3",
            courseCode: "CO1027",
            courseName: "Mạng máy tính",
            examType: "quiz",
            semester: "HK1",
            year: "2024-2025",
            lecturer: "Lê Văn C",
            fileName: "CO1027_Quiz_Week5.pdf",
            fileSize: "0.5 MB",
            uploadDate: "2024-01-08",
            uploader: "Sinh viên K20",
            downloadCount: 28,
            difficulty: 2,
            tags: ["TCP/IP", "OSI Model"]
        }
    ];

    const filteredExams = examFiles.filter(exam => {
        const matchesSearch =
            exam.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.lecturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.fileName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCourse = selectedCourse === "all" || exam.courseCode === selectedCourse;
        const matchesType = selectedExamType === "all" || exam.examType === selectedExamType;
        const matchesSemester = selectedSemester === "all" || exam.semester === selectedSemester;

        return matchesSearch && matchesCourse && matchesType && matchesSemester;
    });

    const getExamTypeLabel = (type: string) => {
        const labels = {
            midterm: "Giữa kỳ",
            final: "Cuối kỳ",
            quiz: "Kiểm tra",
            assignment: "Bài tập"
        };
        return labels[type as keyof typeof labels] || type;
    };

    const getDifficultyColor = (difficulty: number) => {
        if (difficulty >= 4) return "bg-red-500";
        if (difficulty >= 3) return "bg-orange-500";
        return "bg-green-500";
    };

    const handleDownload = (exam: ExamFile) => {
        toast({
            title: "Tải xuống",
            description: `Đang tải ${exam.fileName}...`,
        });
        // In a real app, this would trigger the actual download
    };

    const handleUpload = () => {
        setShowUploadForm(true);
    };

    return (
        <Layout>
            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Lưu trữ đề thi môn học (Đang update tính năng)
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Tìm kiếm và chia sẻ đề thi, bài kiểm tra của các môn học
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                data-testid="input-search-exam"
                                placeholder="Tìm theo mã môn, tên môn, giảng viên..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                            <SelectTrigger data-testid="select-course-filter">
                                <SelectValue placeholder="Chọn môn học" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả môn</SelectItem>
                                <SelectItem value="CO2003">CO2003</SelectItem>
                                <SelectItem value="CO2011">CO2011</SelectItem>
                                <SelectItem value="CO1027">CO1027</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                            <SelectTrigger data-testid="select-type-filter">
                                <SelectValue placeholder="Loại đề thi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="midterm">Giữa kỳ</SelectItem>
                                <SelectItem value="final">Cuối kỳ</SelectItem>
                                <SelectItem value="quiz">Kiểm tra</SelectItem>
                                <SelectItem value="assignment">Bài tập</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                            <SelectTrigger data-testid="select-semester-filter">
                                <SelectValue placeholder="Học kỳ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="HK1">Học kỳ 1</SelectItem>
                                <SelectItem value="HK2">Học kỳ 2</SelectItem>
                                <SelectItem value="HK3">Học kỳ hè</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Upload Button */}
                    <div className="flex justify-end mb-6">
                        <Button
                            data-testid="button-upload-exam"
                            onClick={handleUpload}
                            className="flex items-center space-x-2"
                        >
                            <Upload className="h-4 w-4" />
                            <span>Chia sẻ đề thi</span>
                        </Button>
                    </div>

                    {/* Results */}
                    <div className="space-y-4">
                        {filteredExams.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-foreground mb-2">
                                        Không tìm thấy đề thi
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredExams.map((exam) => (
                                <Card key={exam.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="outline" className="font-mono">
                                                        {exam.courseCode}
                                                    </Badge>
                                                    <Badge variant="secondary">
                                                        {getExamTypeLabel(exam.examType)}
                                                    </Badge>
                                                    <div className={`w-3 h-3 rounded-full ${getDifficultyColor(exam.difficulty)}`} title={`Độ khó: ${exam.difficulty}/5`} />
                                                </div>

                                                <h3 className="text-lg font-semibold text-foreground">
                                                    {exam.courseName}
                                                </h3>

                                                <div className="flex flex-wrap items-center text-sm text-muted-foreground space-x-4">
                                                    <div className="flex items-center space-x-1">
                                                        <User className="h-3 w-3" />
                                                        <span>{exam.lecturer}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{exam.semester} {exam.year}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <FileText className="h-3 w-3" />
                                                        <span>{exam.fileSize}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Download className="h-3 w-3" />
                                                        <span>{exam.downloadCount} lượt tải</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {exam.tags.map((tag, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    Chia sẻ bởi {exam.uploader} • {exam.uploadDate}
                                                </div>
                                            </div>

                                            <div className="flex flex-col space-y-2">
                                                <Button
                                                    data-testid={`button-download-${exam.id}`}
                                                    onClick={() => handleDownload(exam)}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    <span>Tải xuống</span>
                                                </Button>
                                                <div className="text-xs text-center text-muted-foreground">
                                                    {exam.fileName}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Upload Form Modal (placeholder) */}
                    {showUploadForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
                                <h2 className="text-xl font-bold text-foreground mb-4">
                                    Chia sẻ đề thi
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    Tính năng upload đang được phát triển. Vui lòng quay lại sau!
                                </p>
                                <Button
                                    data-testid="button-close-upload-form"
                                    onClick={() => setShowUploadForm(false)}
                                    className="w-full"
                                >
                                    Đóng
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ExamArchive;
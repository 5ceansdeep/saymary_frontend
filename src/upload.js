import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UploadIcon } from "lucide-react";

const Home = () => {
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("파일 선택됨:", file.name);

      // 여기서 실제 API 요청은 생략하고, 임시로 페이지 이동
      navigate("/result", {
        state: {
          title: file.name.replace(/\.[^/.]+$/, ""), // 제목은 파일 이름 (확장자 제거)
          date: new Date().toLocaleDateString(),
          text: "이곳에 변환된 텍스트가 표시됩니다. (예시)"
        }
      });
    }
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex justify-center items-center flex-1">
        <div className="bg-gray-200 rounded-xl w-[500px] h-[300px] flex items-center justify-center text-gray-600 text-xl">
          음성파일을 업로드 해주세요
        </div>
      </div>

      <div className="w-full flex items-center px-4 py-3 bg-white shadow-inner border-t">
        <div className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-gray-500 bg-gray-50">
          음성 파일을 업로드하려면 오른쪽 버튼을 클릭하세요
        </div>
        <button
          onClick={handleUploadClick}
          className="ml-3 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          <UploadIcon className="w-5 h-5" />
        </button>
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default Home;

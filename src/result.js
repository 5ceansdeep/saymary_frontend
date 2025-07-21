import { useLocation } from "react-router-dom";

const Result = () => {
  const { state } = useLocation();
  const { title, date, text } = state || {};

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800">{title || "제목 없음"}</h1>
      <p className="text-sm text-gray-500 mb-4">{date || "날짜 없음"}</p>
      <div className="whitespace-pre-wrap text-gray-700 text-base bg-gray-100 p-4 rounded">
        {text || "변환된 텍스트가 없습니다."}
      </div>
    </div>
  );
};

export default Result;

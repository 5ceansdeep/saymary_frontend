import { useState } from "react";
import ArchiveItem from "../components/ArchiveItem";

export default function Archive({ nickname = "사용자" }) {
  const [files, setFiles] = useState([]);
  const [filenameInput, setFilenameInput] = useState("");

  const handleSave = () => {
    if (!filenameInput.trim()) return;

    const today = new Date();
    const dateStr = today.toISOString().slice(2, 10).replace(/-/g, ".");
    const newFile = { name: filenameInput.trim(), date: dateStr };

    setFiles((prev) => [...prev, newFile]);
    setFilenameInput(""); // 입력창 초기화
  };

  return (
    <div className="bg-[#F9F6DC] w-full min-h-screen p-8 rounded-l-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{nickname}의 보관함</h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={filenameInput}
            onChange={(e) => setFilenameInput(e.target.value)}
            placeholder="파일명 입력"
            className="pl-4 pr-4 py-1 border rounded-full shadow-inner"
          />
          <button
            onClick={handleSave}
            className="bg-green-700 text-white px-4 rounded-full hover:bg-green-800"
          >
            저장
          </button>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-gray-500">저장된 파일이 없습니다.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {files.map((file, index) => (
            <ArchiveItem key={index} filename={file.name} date={file.date} />
          ))}
        </div>
      )}
    </div>
  );
}

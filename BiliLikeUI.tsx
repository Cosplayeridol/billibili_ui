// 重新整理後的版本：可直接部署到 GitHub Pages
// 使用 Vite + React + Tailwind（完全適配 GitHub Pages 的 base path）
// 請將本文件命名為 src/App.jsx

import { useState, useRef } from "react";

export default function App() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [likes, setLikes] = useState(128);
  const [follows, setFollows] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: "小明", text: "這個 UI 真像 B 站！" },
    { id: 2, user: "阿宅", text: "請問這是開源的嗎？" }
  ]);
  const [newComment, setNewComment] = useState("");

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const addComment = () => {
    if (newComment.trim() === "") return;
    setComments([
      ...comments,
      { id: Date.now(), user: "你", text: newComment }
    ]);
    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-4">
        <h1 className="text-xl font-bold mb-4">Bilibili 風格影片頁面（可部署 GitHub Pages）</h1>

        <div className="relative">
          <video
            ref={videoRef}
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            className="w-full rounded-xl border"
          ></video>

          <button
            onClick={togglePlay}
            className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg"
          >
            {playing ? "暫停" : "播放"}
          </button>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => setLikes(likes + 1)}
            className="px-4 py-2 bg-pink-500 text-white rounded-xl"
          >
            👍 {likes}
          </button>

          <button
            onClick={() => setFollows(!follows)}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl"
          >
            {follows ? "已關注" : "關注"}
          </button>
        </div>

        {/* 評論區 */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">評論區</h2>

          <div className="space-y-2 mb-4">
            {comments.map((c) => (
              <div key={c.id} className="p-3 bg-gray-50 rounded-xl border">
                <span className="font-bold mr-2">{c.user}：</span>
                {c.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="輸入評論…"
              className="flex-1 border p-2 rounded-xl"
            />
            <button
              onClick={addComment}
              className="px-4 py-2 bg-green-500 text-white rounded-xl"
            >
              發表
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-6 text-gray-500">部署已適配 GitHub Pages</footer>
    </div>
  );
}

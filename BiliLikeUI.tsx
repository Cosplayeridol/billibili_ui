import React, { useState, useRef, useEffect } from "react";

// Bilibili-like front-end single-file React component
// - Tailwind CSS utility classes assumed available
// - Uses shadcn/ui components if available; otherwise simple HTML elements are used
// - Interactive: play/pause, progress scrubbing, volume, like/favorite, follow, comments, sidebar recommended list

export default function BiliLikeUI() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [comments, setComments] = useState<Array<{ id: number; user: string; text: string; ts: string }>>([
    { id: 1, user: "小明", text: "這個片段很讚！", ts: "2025-12-05 12:00" },
    { id: 2, user: "小芳", text: "樓上同意，彈幕在哪裡？", ts: "2025-12-05 12:05" },
  ]);
  const [commentInput, setCommentInput] = useState("");
  const [recommendations] = useState(
    new Array(6).fill(0).map((_, i) => ({ id: i + 1, title: `推薦影片 #${i + 1}`, duration: `${3 + i}:2${i}` }))
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMiniPlayer, setMobileMiniPlayer] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const timeUpdate = () => setTime(v.currentTime);
    const meta = () => setDuration(v.duration || 0);
    v.addEventListener("timeupdate", timeUpdate);
    v.addEventListener("loadedmetadata", meta);
    return () => {
      v.removeEventListener("timeupdate", timeUpdate);
      v.removeEventListener("loadedmetadata", meta);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = Number(e.target.value);
    v.currentTime = val;
    setTime(val);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const addComment = () => {
    if (!commentInput.trim()) return;
    const id = Date.now();
    setComments((c) => [{ id, user: "你", text: commentInput.trim(), ts: new Date().toLocaleString() }, ...c]);
    setCommentInput("");
  };

  const toggleLike = () => setLiked((s) => !s);
  const toggleFav = () => setFavorited((s) => !s);
  const toggleFollow = () => setFollowed((s) => !s);

  // simple keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "m") toggleMute();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white/60 dark:bg-slate-800/60 backdrop-blur sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded flex items-center justify-center text-white font-bold">B</div>
          <div className="hidden sm:block font-bold">BiliClone</div>
        </div>
        <div className="flex-1 px-4 max-w-2xl">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索视频、UP主、番剧..."
              className="w-full rounded-full py-2 px-4 border focus:outline-none focus:ring" />
            <button
              onClick={() => alert(`搜索: ${search || "(空)"}`)}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
              搜索
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("上传影片（示意）")}
            className="px-3 py-1 rounded border">投稿</button>
          <button onClick={() => alert("登录（示意）")} className="px-3 py-1 rounded bg-amber-400">登录</button>
        </div>
      </header>

      {/* Main layout */}
      <main className="px-4 py-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
        {/* Video + details */}
        <section>
          <div className="bg-white dark:bg-slate-800 rounded shadow p-4">
            {/* Video player */}
            <div className="relative bg-black rounded overflow-hidden">
              <video
                ref={videoRef}
                className={`w-full max-h-[60vh] bg-black aspect-video`}
                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                onClick={togglePlay}
                playsInline
                controls={false}
              />

              {/* Overlay controls */}
              <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="px-3 py-1 bg-white/10 rounded">
                    {playing ? "暂停" : "播放"}
                  </button>
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={time}
                      onChange={onSeek}
                      className="w-full"
                    />
                    <div className="text-xs whitespace-nowrap">{formatTime(time)} / {formatTime(duration)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="px-2 py-1 bg-white/10 rounded">{muted ? "静音" : "声音"}</button>
                    <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>

            {/* Title & meta */}
            <div className="mt-4">
              <h1 className="text-xl font-semibold">示例影片标题 — 高完成度前端 UI 演示</h1>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="https://placehold.co/48" alt="up" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-medium">示例UP主</div>
                    <div className="text-sm text-slate-500">12.5万 粉丝 • 2025-12-01</div>
                  </div>
                  <button onClick={toggleFollow} className={`ml-3 px-3 py-1 rounded ${followed ? 'bg-slate-300/60' : 'bg-red-500 text-white'}`}>
                    {followed ? '已关注' : '关注'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={toggleLike} className={`px-3 py-1 rounded ${liked ? 'bg-rose-500 text-white' : 'border'}`}>{liked ? '已赞' : '点赞'}</button>
                  <button onClick={toggleFav} className={`px-3 py-1 rounded ${favorited ? 'bg-yellow-500 text-white' : 'border'}`}>{favorited ? '已收藏' : '收藏'}</button>
                  <button onClick={() => alert('分享功能示意')} className="px-3 py-1 border rounded">分享</button>
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                说明：这段文字模拟视频描述，可以包含时间轴、链接以及番剧/话题标签。UI 已经支持响应式布局、交互控制、评论输入与侧边推荐。
              </div>
            </div>

            {/* Tabs: 简介 / 弹幕 / 评论 */}
            <div className="mt-6">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <button className="py-2 rounded bg-slate-100 dark:bg-slate-700">简介</button>
                <button className="py-2 rounded">弹幕</button>
                <button className="py-2 rounded">评论</button>
              </div>

              {/* Comments area */}
              <div className="mt-4">
                <div className="flex gap-3 items-start">
                  <img src="https://placehold.co/40" alt="me" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <textarea
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      rows={3}
                      className="w-full border rounded p-2"
                      placeholder="写下你的弹幕/评论...（Ctrl+Enter 发送）"
                      onKeyDown={(e) => { if (e.ctrlKey && e.key === 'Enter') addComment(); }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-slate-500">支持Ctrl+Enter快速发送</div>
                      <div className="flex items-center gap-2">
                        <button onClick={addComment} className="px-3 py-1 rounded bg-blue-600 text-white">发送</button>
                      </div>
                    </div>

                    <div className="mt-4">
                      {comments.map((c) => (
                        <div key={c.id} className="py-2 border-b last:border-b-0">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{c.user}</div>
                            <div className="text-xs text-slate-400">{c.ts}</div>
                          </div>
                          <div className="mt-1 text-sm">{c.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className={`${sidebarOpen ? '' : 'hidden'} lg:block`}>
          <div className="space-y-4">
            {/* Mini player for mobile */}
            <div className="bg-white dark:bg-slate-800 rounded p-3 shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-slate-200 rounded overflow-hidden"> 
                    <img src="https://placehold.co/120x80" alt="thumb" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">示例影片</div>
                    <div className="text-xs text-slate-500">示例UP主</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setMobileMiniPlayer((s) => !s)} className="px-2 py-1 border rounded">Mini</button>
                  <button onClick={() => setSidebarOpen(false)} className="px-2 py-1 border rounded">隐藏</button>
                </div>
              </div>
            </div>

            {/* Recommended list */}
            <div className="bg-white dark:bg-slate-800 rounded p-3 shadow">
              <div className="font-semibold mb-2">推荐视频</div>
              <div className="space-y-3">
                {recommendations.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded cursor-pointer" onClick={() => alert(`播放: ${r.title}`)}>
                    <div className="w-20 h-12 bg-slate-200 rounded overflow-hidden">
                      <img src={`https://placehold.co/160x90?text=${encodeURIComponent(r.title)}`} alt={r.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium truncate">{r.title}</div>
                      <div className="text-xs text-slate-500">时长 {r.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About creator card */}
            <div className="bg-white dark:bg-slate-800 rounded p-3 shadow">
              <div className="flex items-center gap-3">
                <img src="https://placehold.co/56" className="w-14 h-14 rounded-full" />
                <div>
                  <div className="font-medium">示例UP主</div>
                  <div className="text-sm text-slate-500">12.5 万粉丝</div>
                  <button onClick={toggleFollow} className={`mt-2 px-3 py-1 rounded ${followed ? 'bg-slate-300' : 'bg-red-500 text-white'}`}>{followed ? '已关注' : '关注'}</button>
                </div>
              </div>
            </div>

          </div>
        </aside>
      </main>

      {/* Mobile mini-player bar (sticky) */}
      {mobileMiniPlayer && (
        <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-slate-800 rounded p-3 shadow-lg flex items-center gap-3">
          <div className="w-20 h-12 bg-slate-200 rounded overflow-hidden"><img src="https://placehold.co/120x80" className="w-full h-full object-cover" /></div>
          <div className="flex-1">
            <div className="font-medium">示例影片（Mini 播放）</div>
            <div className="text-xs text-slate-500">示例UP主</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="px-3 py-1 rounded border">{playing ? '暂停' : '播放'}</button>
            <button onClick={() => setMobileMiniPlayer(false)} className="px-3 py-1 rounded border">关闭</button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(s: number) {
  if (!s || isNaN(s)) return "0:00";
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  const m = Math.floor(s / 60);
  return `${m}:${sec}`;
}

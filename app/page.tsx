"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 收藏项类型
interface Favorite {
  id: number;
  url: string;
  title: string;
  artist: string;
  coverUrl?: string;
  duration?: number;
  createdAt: string;
}

// 模板列表
const templates = [
  {
    id: "poster",
    name: "Poster",
    description: "音乐海报",
    image: "/poster.png",
  },
  {
    id: "phone",
    name: "Phone",
    description: "音乐小卡",
    image: "/phone.png",
  },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("poster");
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [fallbackImages, setFallbackImages] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  // 检测图片加载失败，使用备用方案
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!imagesLoaded) {
        setFallbackImages(true);
      }
    }, 3000); // 3秒后如果图片还未加载，使用备用方案

    return () => clearTimeout(timer);
  }, [imagesLoaded]);

  // 获取收藏列表
  const fetchFavorites = async () => {
    setIsLoadingFavorites(true);
    try {
      const response = await fetch('/api/favorites');
      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error("获取收藏列表失败:", error);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  // 打开收藏列表
  const handleShowFavorites = () => {
    setShowFavorites(true);
    fetchFavorites();
  };

  // 删除收藏
  const handleDeleteFavorite = async (id: number) => {
    try {
      const response = await fetch(`/api/favorites?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.id !== id));
      } else {
        alert("删除收藏失败");
      }
    } catch (error) {
      console.error("删除收藏失败:", error);
      alert("删除收藏失败");
    }
  };

  // 格式化时长
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 relative">
          {/* 我的收藏按钮 - 右上角 */}
          <button
            onClick={handleShowFavorites}
            className="absolute top-0 right-0 flex items-center px-4 py-2 bg-white rounded-md shadow hover:shadow-md transition-shadow text-gray-600 hover:text-gray-900"
          >
            <span className="material-symbols-outlined mr-1 text-sm">favorite</span>
            我的收藏
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Card.Catpng.net
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            选择一个模板，输入网易云音乐链接，自动生成音乐卡片
          </p>

          {/* 音乐链接输入 */}
          <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-12">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  输入音乐链接
                </label>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="请输入网易云音乐链接"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择模板
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              <Link
                href={`/${selectedTemplate}?url=${encodeURIComponent(url)}`}
                className={`w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  !url.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={(e) => {
                  if (!url.trim()) {
                    e.preventDefault();
                  }
                }}
              >
                开始创建
              </Link>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>支持的音乐平台：</p>
              <ul className="list-disc list-inside mt-2">
                <li>网易云音乐 (music.163.com)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {templates.map((template) => (
            <div key={template.id} className="block group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-200 hover:scale-105">
                <div className="relative h-[600px]">
                  {fallbackImages ? (
                    // 备用方案：使用普通img标签
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-contain"
                      onLoad={() => setImagesLoaded(true)}
                    />
                  ) : (
                    // 主要方案：使用picture元素和多个源
                    <picture>
                      <source srcSet={template.image} type="image/webp" />
                      <source srcSet={template.image} type="image/png" />
                      <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-contain"
                        onLoad={() => setImagesLoaded(true)}
                        loading="eager"
                      />
                    </picture>
                  )}
                </div>
                <div className="p-6 relative bg-white">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {template.name}
                  </h2>
                  <p className="text-gray-600">{template.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 收藏列表模态框 */}
        {showFavorites && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
              {/* 模态框标题 */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">我的收藏</h2>
                <button
                  onClick={() => setShowFavorites(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* 收藏列表内容 */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {isLoadingFavorites ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">加载中...</p>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">music_note</span>
                    <p className="text-gray-500">还没有收藏任何歌曲</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {favorites.map((favorite) => (
                      <div
                        key={favorite.id}
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {/* 封面图片 */}
                        <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 mr-4">
                          {favorite.coverUrl ? (
                            <img
                              src={favorite.coverUrl}
                              alt={favorite.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-gray-400">music_note</span>
                            </div>
                          )}
                        </div>
                        
                        {/* 歌曲信息 */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{favorite.title}</h3>
                          <p className="text-sm text-gray-600 truncate">{favorite.artist}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span>{new Date(favorite.createdAt).toLocaleDateString('zh-CN')}</span>
                            {favorite.duration && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{formatDuration(favorite.duration)}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* 操作按钮 */}
                        <div className="flex items-center space-x-2 ml-4">
                          <Link
                            href={`/poster?url=${encodeURIComponent(favorite.url)}`}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                            onClick={() => setShowFavorites(false)}
                          >
                            查看
                          </Link>
                          <button
                            onClick={() => handleDeleteFavorite(favorite.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <div className="space-y-2">
            <p>
              © 2024{" "}
              <a
                href="https://card.catpng.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Card.Catpng.net
              </a>
              . All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}

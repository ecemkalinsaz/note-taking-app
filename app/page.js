"use client";
import { useState } from "react";

export default function Home() {
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#f8f7fd]">
      {/* Note List Section */}
      <div
        className={`${
          isPromptOpen ? "w-[calc(100%-56px)]" : "w-[calc(100%-56px)]"
        } transition-all duration-300 p-6 overflow-y-auto`}
      >
        <div className="mx-auto space-y-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-[#594d8c]">My Notes</h1>
            <button className="px-4 py-2 bg-[#7b6eac] hover:bg-[#6a5d9b] text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow-sm">
              <span>+ New Note</span>
            </button>
          </header>

          {/* Pinned Notes Section */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#e9e8f8]">
            <h2 className="text-[#594d8c] font-medium mb-4 flex items-center space-x-2">
              <span>📌</span>
              <span>Pinned Notes</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Example Pinned Note Card */}
              <div className="bg-[#f8f7fd] p-4 rounded-xl hover:shadow-md transition-all duration-200 border border-[#e9e8f8] group">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-[#594d8c]">Meeting Notes</h3>
                  <button className="text-[#a69ed9] opacity-0 group-hover:opacity-100 transition-opacity">
                    ⋮
                  </button>
                </div>
                <p className="text-sm text-[#7b6eac] mt-2 line-clamp-2">
                  Discussion points for the weekly team sync...
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-[#a69ed9]">2 hours ago</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">📝</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* All Notes Section */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#e9e8f8]">
            <h2 className="text-[#594d8c] font-medium mb-4">All Notes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Note cards will go here */}
            </div>
          </section>
        </div>
      </div>
      {/* Modernized Prompt Panel */}
      <div
        className={`fixed right-0 top-0 h-screen ${
          isPromptOpen ? "w-1/3" : "w-14"
        } transition-all duration-300 bg-white shadow-lg border-l border-[#e9e8f8]`}
      >
        <div className="flex items-center justify-between border-b border-[#e9e8f8]">
          {isPromptOpen && (
            <h3 className="text-[#594d8c] font-medium p-4 flex items-center space-x-2">
              <span className="text-xl">💭</span>
              <span>Writing Prompts</span>
            </h3>
          )}
          <button
            onClick={() => setIsPromptOpen(!isPromptOpen)}
            className="w-14 h-14 flex items-center justify-center hover:bg-[#f8f7fd] text-[#7b6eac] relative group shrink-0"
          >
            {isPromptOpen ? (
              <span className="text-xl">→</span>
            ) : (
              <span className="text-xl">💭</span>
            )}

            {/* Modern Tooltip - only show when panel is closed */}
            {!isPromptOpen && (
              <div className="absolute left-0 transform -translate-x-full top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[#594d8c] text-white px-3 py-1.5 rounded-lg text-sm ml-2 shadow-lg">
                Writing Prompts
              </div>
            )}
          </button>
        </div>

        {isPromptOpen && (
          <div className="p-6 overflow-y-auto h-[calc(100vh-56px)]">
            <div className="space-y-4">
              <div className="bg-[#f8f7fd] p-5 rounded-xl hover:shadow-md transition-all duration-200 border border-[#e9e8f8]">
                <p className="text-[#7b6eac] leading-relaxed">
                  If you could travel anywhere in time, where would you go and
                  why?
                </p>
                <button className="mt-4 w-full px-4 py-2.5 bg-[#7b6eac] hover:bg-[#6a5d9b] text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                  <span>Use Prompt</span>
                  <span>💭</span>
                </button>
              </div>
              <button className="w-full px-4 py-2.5 bg-[#e2e0f4] hover:bg-[#d8d5f2] text-[#7b6eac] rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                <span>Generate New</span>
                <span>✏️</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Head from "next/head";
import { Header } from "@/components/dashboard/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  activeSection?: string;
}

export function DashboardLayout({
  children,
  title = "HiriBot İK Dashboard",
  activeSection = "dashboard",
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sidebar toggle handler
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        :root {
          --hiri-purple: #7c3aed;
          --hiri-purple-dark: #6d28d9;
          --hiri-blue: #3b82f6;
          --hiri-border-color: #cbd5e1;
          --hiri-light-purple: #f3e8ff;
          --hiri-lighter-purple: #e9d5ff;
          --hiri-text-color: #1e293b;
          --hiri-bg-color: #f8fafc;
        }

        body {
          font-family: "Inter", sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: var(--hiri-bg-color);
          color: var(--hiri-text-color);
          margin: 0;
          padding: 0;
        }

        .hiri-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          padding: 0.65rem 1.3rem;
          border-radius: 0.5rem;
          transition: all 0.25s;
          border: 1px solid transparent;
          box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
        }
        .hiri-button-primary {
          background-color: var(--hiri-purple);
          color: white;
        }
        .hiri-button-primary:hover {
          background-color: var(--hiri-purple-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 16px -4px rgba(124, 58, 237, 0.35);
        }
        .hiri-button-secondary {
          background-color: var(--hiri-light-purple);
          color: var(--hiri-purple);
          border: 1px solid #d8b4fe;
        }
        .hiri-button-secondary:hover {
          background-color: var(--hiri-lighter-purple);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        .hiri-card {
          background-color: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 4px 12px -1px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }

        .hiri-input {
          border: 1px solid var(--hiri-border-color);
          border-radius: 0.5rem;
          padding: 0.75rem 0.9rem;
          width: 100%;
          transition: all 0.2s;
          background-color: #f9fafb;
        }
        .hiri-input:focus {
          outline: none;
          border-color: var(--hiri-purple);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 8px;
        }
        th,
        td {
          padding: 12px 16px;
          text-align: left;
        }
        th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #4b5563;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        th:first-child {
          border-top-left-radius: 0.5rem;
        }
        th:last-child {
          border-top-right-radius: 0.5rem;
        }
        td {
          background-color: white;
          border-bottom: 1px solid #e5e7eb;
          font-size: 0.9rem;
          color: #374151;
        }
        tr:last-child td {
          border-bottom: none;
        }
        tr {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border-radius: 0.5rem;
          transition: all 0.2s;
        }
        tr:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }
        tr td:first-child {
          border-top-left-radius: 0.5rem;
          border-bottom-left-radius: 0.5rem;
        }
        tr td:last-child {
          border-top-right-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }

        .tag {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .tag-green {
          background-color: #d1fae5;
          color: #059669;
        }
        .tag-blue {
          background-color: #dbeafe;
          color: #2563eb;
        }
        .tag-orange {
          background-color: #fef3c7;
          color: #d97706;
        }
        .tag-gray {
          background-color: #e5e7eb;
          color: #4b5563;
        }

        .modal {
          display: none;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(4px);
          align-items: center;
          justify-content: center;
        }
        .modal.is-open {
          display: flex;
        }
        .modal-content {
          background-color: #fff;
          margin: auto;
          padding: 2rem;
          border: none;
          width: 90%;
          max-width: 700px;
          border-radius: 0.75rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 1rem;
        }
        .modal-body {
          flex-grow: 1;
          overflow-y: auto;
        }
        .modal-footer {
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        <Header onToggleSidebar={toggleSidebar} />

        <div className="lg:flex">
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`bg-white shadow-xl border-r border-gray-200 transform transition-all duration-300 ease-in-out overflow-hidden z-50
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
              lg:${isSidebarOpen ? "w-64" : "w-0"}
              lg:sticky lg:top-16 lg:translate-x-0
              fixed top-16 left-0 w-64 lg:w-auto
            `}
            style={{ height: "calc(100vh - 4rem)" }}
          >
            <div className="w-64 p-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              </div>
              <nav className="space-y-2">
                <a
                  href="/dashboard"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                    activeSection === "dashboard"
                      ? "bg-purple-100 text-purple-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <i className="fas fa-th-large w-5"></i>
                  <span>Dashboard</span>
                </a>
                <a
                  href="/candidates"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                    activeSection === "candidates"
                      ? "bg-purple-100 text-purple-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <i className="fas fa-users w-5"></i>
                  <span>Adaylar</span>
                </a>
                <a
                  href="/positions"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                    activeSection === "positions"
                      ? "bg-purple-100 text-purple-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <i className="fas fa-briefcase w-5"></i>
                  <span>Pozisyonlar</span>
                </a>
                <a
                  href="/interview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                    activeSection === "interview"
                      ? "bg-purple-100 text-purple-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <i className="fas fa-video w-5"></i>
                  <span>Mülakat</span>
                  <i className="fas fa-external-link-alt text-xs opacity-50 ml-auto"></i>
                </a>
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <main className="w-full lg:flex-1 overflow-hidden">
            <div
              className="overflow-y-auto p-6"
              style={{ height: "calc(100vh - 4rem)" }}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

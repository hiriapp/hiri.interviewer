"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import { cn } from "@/lib/utils";

interface UnassignedInterview {
  id: string;
  date: string;
  duration: string;
}

interface InviteHiriBotProps {
  onInvite?: (link: string) => void;
  onAssignCandidate?: (interviewId: string) => void;
  unassignedInterviews?: UnassignedInterview[];
  className?: string;
}

export function InviteHiriBot({
  onInvite,
  onAssignCandidate,
  unassignedInterviews = [],
  className,
}: InviteHiriBotProps) {
  const [inviteLink, setInviteLink] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInvite = () => {
    if (!inviteLink.includes("http")) {
      console.warn("Invalid link provided:", inviteLink);
      // You can replace this with your notification system
      return;
    }

    onInvite?.(inviteLink);
    setInviteLink("");
    console.log("HiriBot invited successfully with link:", inviteLink);
  };

  const handleAssign = (interviewId: string) => {
    onAssignCandidate?.(interviewId);
    setShowDropdown(false);
    console.log("Assigning candidate to interview:", interviewId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInvite();
    }
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="text-base lg:text-lg">HiriBot Davet</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-4">
          {/* Invite Link Section */}
          <div className="w-full">
            <label htmlFor="inviteLink" className="sr-only">
              Hızlı Davet Linki
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Input
                  id="inviteLink"
                  type="url"
                  value={inviteLink}
                  onChange={(e) => setInviteLink(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="HiriBot'u davet etmek için toplantı linkini yapıştırın..."
                  className="text-sm"
                  leftIcon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  }
                />
              </div>
              <Button
                onClick={handleInvite}
                size="md"
                className="flex-shrink-0 text-sm"
                leftIcon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                }
              >
                Davet Et
              </Button>
            </div>
          </div>

          {/* Unassigned Records Section - Moved to bottom */}
          <div className="relative w-full mt-3 pt-3 border-t border-slate-200">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full text-sm"
              leftIcon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1 1H7a1 1 0 00-1 1v1m8 0V4.5"
                  />
                </svg>
              }
              rightIcon={
                unassignedInterviews.length > 0 && (
                  <span className="ml-2 bg-pink-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {unassignedInterviews.length}
                  </span>
                )
              }
            >
              Atanmamış Kayıtlar
            </Button>

            {/* Dropdown */}
            {showDropdown && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />

                {/* Dropdown Content */}
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-md shadow-xl z-20 border">
                  <div className="p-3 border-b">
                    <h3 className="font-semibold text-sm">Bekleyen Kayıtlar</h3>
                  </div>
                  <div className="p-1 max-h-64 overflow-y-auto">
                    {unassignedInterviews.length === 0 ? (
                      <p className="text-center text-slate-500 italic p-4 text-sm">
                        Atanmamış kayıt yok.
                      </p>
                    ) : (
                      unassignedInterviews.map((interview) => (
                        <div
                          key={interview.id}
                          className="block p-2 hover:bg-slate-100 rounded-md"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-sm text-slate-700">
                                Kayıt: {interview.date}
                              </p>
                              <p className="text-xs text-slate-500">
                                Süre: {interview.duration}
                              </p>
                            </div>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleAssign(interview.id)}
                              className="bg-green-100 text-green-800 hover:bg-green-200 text-xs py-1 px-2"
                            >
                              Ata
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

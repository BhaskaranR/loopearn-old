"use client";

import { Button } from "@loopearn/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@loopearn/ui/collapsible";
import { Switch } from "@loopearn/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@loopearn/ui/tabs";
import {
  ArrowLeft,
  Copy,
  Expand,
  List,
  MessageSquare,
  MoreHorizontal,
  Palette,
  RefreshCwIcon as Refresh,
  Settings,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { QuestionTypeList } from "./components/question-type-list";

export default function SurveyBuilder() {
  const [activeTab, setActiveTab] = useState("questions");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [addQuestionExpanded, setAddQuestionExpanded] = useState(false);

  const toggleQuestion = (id: string) => {
    if (expandedQuestion === id) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(id);
    }
  };

  const toggleAddQuestion = () => {
    setAddQuestionExpanded(!addQuestionExpanded);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Development environment banner */}
      <div className="bg-[#993300] text-white text-center py-2 px-4">
        You&apos;re in a development environment. Set it up to test surveys,
        actions and attributes.
      </div>

      {/* Top navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">test /</span>
            <div className="border rounded-md px-3 py-1.5 text-sm">
              Start from scratch
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Save
          </Button>
          <Button size="sm" className="bg-black hover:bg-gray-800 gap-1">
            Continue to Settings
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="border-b">
        <TabsList className="h-12 px-4 w-full justify-start bg-transparent border-b-0">
          <TabsTrigger
            value="questions"
            className={`data-[state=active]:border-b-2 data-[state=active]:border-[#10b981] data-[state=active]:shadow-none rounded-none px-4 h-12 ${activeTab === "questions" ? "border-b-2 border-[#10b981]" : ""}`}
          >
            <List className="h-4 w-4 mr-2" />
            Questions
          </TabsTrigger>
          <TabsTrigger
            value="styling"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#10b981] data-[state=active]:shadow-none rounded-none px-4 h-12"
          >
            <Palette className="h-4 w-4 mr-2" />
            Styling
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#10b981] data-[state=active]:shadow-none rounded-none px-4 h-12"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger
            value="followups"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#10b981] data-[state=active]:shadow-none rounded-none px-4 h-12"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Follow-ups
          </TabsTrigger>
          <div className="ml-2 flex items-center">
            <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded">
              PRO
            </span>
          </div>
        </TabsList>
      </Tabs>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Questions panel */}
        <div className="w-3/5 overflow-y-auto p-4 space-y-4">
          {/* Welcome card */}
          <Collapsible>
            <div className="border rounded-md">
              <CollapsibleTrigger className="w-full text-left">
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <div className="w-[70px] bg-white flex flex-col items-center justify-between py-4 rounded-l-md">
                      <div className="text-gray-500">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11 14.9861C11 14.9861 14.5 12.5 15.5 11.5C16.5 10.5 16.5 9.5 15.5 8.5C14.5 7.5 13.5 7.5 12.5 8.5C11.5 9.5 11 14.9861 11 14.9861Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M11 14.9861C11 14.9861 8.39 12.8 7.5 11.5C6.5 10 7 8.5 8.5 7.5C10 6.5 11 14.9861 11 14.9861Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 15.9998H13.5C15.5 15.9998 16 17.9998 16 17.9998"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-gray-300"
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">Welcome card</h3>
                      <p className="text-sm text-gray-500">Hidden</p>
                    </div>
                  </div>
                  <div className="flex items-center pr-4">
                    <span className="mr-2 text-sm">Off</span>
                    <Switch />
                  </div>
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="border-x border-b rounded-b-md p-4">
                <p>Welcome card content goes here...</p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Question 1 - Free text */}
          <Collapsible>
            <div className="border rounded-md">
              <CollapsibleTrigger className="w-full text-left">
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <div className="w-[70px] bg-[#455571] flex flex-col items-center justify-between py-4 rounded-l-md">
                      <div className="text-white">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 12H16"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 16H16"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 8H16"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            stroke="white"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-white/70"
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">
                        Do you have 2 minutes to help us improve?
                      </h3>
                      <p className="text-sm text-gray-500">Optional</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 pr-4">
                    <Button variant="ghost" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Upload className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="border-x border-b rounded-b-md p-4">
                <p>Question 1 content goes here...</p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Question 2 - Single select */}
          <Collapsible>
            <div className="border rounded-md">
              <CollapsibleTrigger className="w-full text-left">
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <div className="w-[70px] bg-[#8896AB] flex flex-col items-center justify-between py-4 rounded-l-md">
                      <div className="text-white">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3"
                            y="6"
                            width="18"
                            height="4"
                            rx="1"
                            stroke="white"
                            strokeWidth="1.5"
                          />
                          <rect
                            x="3"
                            y="14"
                            width="18"
                            height="4"
                            rx="1"
                            stroke="white"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-white/70"
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">
                        What was the primary reason you didn&apos;t complete
                        your purchase?
                      </h3>
                      <p className="text-sm text-gray-500">Required</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 pr-4">
                    <Button variant="ghost" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Upload className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="border-x border-b rounded-b-md p-4">
                <p>Question 2 content goes here...</p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Question 3 - Free text */}
          <Collapsible>
            <div className="border rounded-md">
              <CollapsibleTrigger className="w-full text-left">
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <div className="w-[70px] bg-[#455571] flex flex-col items-center justify-between py-4 rounded-l-md">
                      <div className="text-white">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 12H16"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 16H16"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 8H16"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            stroke="white"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-white/70"
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">
                        Please elaborate on your reason for not completing the
                        purchase:
                      </h3>
                      <p className="text-sm text-gray-500">Optional</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 pr-4">
                    <Button variant="ghost" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Upload className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="border-x border-b rounded-b-md p-4">
                <p>Question 3 content goes here...</p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Question 4 - Rating */}
          <Collapsible>
            <div className="border rounded-md">
              <CollapsibleTrigger className="w-full text-left">
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <div className="w-[70px] bg-[#8896AB] flex flex-col items-center justify-between py-4 rounded-l-md">
                      <div className="text-white">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 3L14.5 8.5L21 9.5L16.5 14L17.5 20.5L12 17.5L6.5 20.5L7.5 14L3 9.5L9.5 8.5L12 3Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-white/70"
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">
                        How would you rate your overall shopping experience?
                      </h3>
                      <p className="text-sm text-gray-500">Required</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 pr-4">
                    <Button variant="ghost" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Upload className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="border-x border-b rounded-b-md p-4">
                <p>Question 4 content goes here...</p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Question 5 - Multi-select */}
          <Collapsible>
            <div className="border rounded-md">
              <CollapsibleTrigger className="w-full text-left">
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <div className="w-[70px] bg-[#8896AB] flex flex-col items-center justify-between py-4 rounded-l-md">
                      <div className="text-white">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3"
                            y="6"
                            width="18"
                            height="4"
                            rx="1"
                            stroke="white"
                            strokeWidth="1.5"
                          />
                          <rect
                            x="3"
                            y="14"
                            width="18"
                            height="4"
                            rx="1"
                            stroke="white"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M7 8H8"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M7 16H8"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-white/70"
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">
                        What factors would encourage you to complete your
                        purchase in the future?
                      </h3>
                      <p className="text-sm text-gray-500">Required</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 pr-4">
                    <Button variant="ghost" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Upload className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="border-x border-b rounded-b-md p-4">
                <p>Question 5 content goes here...</p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Add a new question - Consent */}
          <Collapsible>
            <div className="border rounded-md">
              <CollapsibleTrigger className="w-full text-left">
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <div className="w-[70px] bg-[#8896AB] flex flex-col items-center justify-between py-4 rounded-l-md">
                      <div className="text-white">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 12L10 17L19 8"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-white/70"
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">
                        Would you like to receive a discount code via email?
                      </h3>
                      <p className="text-sm text-gray-500">Optional</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 pr-4">
                    <Button variant="ghost" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Upload className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="border-x border-b rounded-b-md p-4">
                <p>Question 6 content goes here...</p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Add Question Card */}
          <Collapsible
            open={addQuestionExpanded}
            onOpenChange={setAddQuestionExpanded}
          >
            <div className="border rounded-md">
              <CollapsibleTrigger className="w-full text-left">
                <div className="flex items-center">
                  <div className="w-[70px] bg-[#4ECDC4] flex flex-col items-center justify-between py-4 rounded-l-md">
                    <div className="text-white">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5V19"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 12H19"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-white/70"
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Add question</h3>
                    <p className="text-sm text-gray-500">
                      Add a new question to your survey
                    </p>
                  </div>
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="border-x border-b rounded-b-md">
                <QuestionTypeList />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Preview panel */}
        <div className="w-2/5 bg-gray-100 p-6 flex flex-col">
          <div className="bg-white rounded-md shadow-md flex-1 overflow-hidden flex flex-col">
            {/* Browser mockup header */}
            <div className="flex items-center justify-between bg-gray-100 p-2 border-b">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-xs text-gray-500">Your web app</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Expand className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Refresh className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Survey preview */}
            <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-end mb-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    What factors would encourage you to complete your purchase
                    in the future?
                  </h2>
                  <p className="text-gray-600">Please select all that apply:</p>
                </div>

                <div className="space-y-3">
                  <div className="border rounded-md p-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 mr-3" />
                      <span>Lower shipping costs</span>
                    </label>
                  </div>
                  <div className="border rounded-md p-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 mr-3" />
                      <span>Discounts or promotions</span>
                    </label>
                  </div>
                  <div className="border rounded-md p-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 mr-3" />
                      <span>More payment options</span>
                    </label>
                  </div>
                  <div className="border rounded-md p-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 mr-3" />
                      <span>Better product descriptions</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline">Back</Button>
                  <Button className="bg-gray-600 hover:bg-gray-700">
                    Next
                  </Button>
                </div>

                <div className="text-center text-xs text-gray-500 mt-4">
                  Powered by Formbricks
                </div>
              </div>
            </div>

            {/* Device toggle */}
            <div className="flex justify-center p-3 border-t">
              <div className="bg-gray-200 rounded-full p-1 flex">
                <button
                  className={`rounded-full p-1 ${previewMode === "mobile" ? "bg-white shadow" : ""}`}
                  onClick={() => setPreviewMode("mobile")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button
                  className={`rounded-full p-1 ${previewMode === "desktop" ? "bg-white shadow" : ""}`}
                  onClick={() => setPreviewMode("desktop")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { FileText, Play, ListTodo, Globe, Calendar } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Define the project type
interface Project {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  imageSrc: string
}

// Sample project data
const projects: Project[] = [
  {
    id: "text-editor",
    title: "Supper",
    description: "A collaborative document editing platform with real-time updates",
    icon: <FileText className="h-5 w-5" />,
    imageSrc: "/supper.jpg",
  },
  {
    id: "media-player",
    title: "Sensible",
    description: "Streaming service with personalized content recommendations",
    icon: <Play className="h-5 w-5" />,
    imageSrc: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "task-manager",
    title: "Workmate",
    description: "Project management tool with kanban boards and task tracking",
    icon: <ListTodo className="h-5 w-5" />,
    imageSrc: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "web-browser",
    title: "Ritual Dental",
    description: "Privacy-focused browser with built-in ad blocking",
    icon: <Globe className="h-5 w-5" />,
    imageSrc: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "calendar-app",
    title: "Waffle",
    description: "Smart scheduling assistant with AI-powered suggestions",
    icon: <Calendar className="h-5 w-5" />,
    imageSrc: "/placeholder.svg?height=400&width=600",
  },
]

interface ProjectShowcaseProps {
  initialTab?: string
  className?: string
}

export default function ProjectShowcase({ initialTab = "text-editor", className }: ProjectShowcaseProps) {
  const [activeTab, setActiveTab] = useState(initialTab)

  return (
    <div className="w-full lg:w-[680px] mx-auto">
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden border-y-[1px]">
        {/* Browser-like header */}
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-muted" />
            <div className="h-3 w-3 rounded-full bg-muted" />
            <div className="h-3 w-3 rounded-full bg-muted" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-1.5 rounded-md bg-background px-3 py-1 text-sm text-muted-foreground">
              supper.co
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="relative">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-0">
            {/* Project content */}
            <div className="w-full">
              {projects.map((project) => (
                <TabsContent
                  key={project.id}
                  value={project.id}
                  className="m-0"
                >
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <Image
                      src={project.imageSrc || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 896px) 100vw, 896px"
                      quality={95}
                    />
                  </div>
                </TabsContent>
              ))}
            </div>

            {/* Tab navigation */}
            <div className="flex h-[56px] w-full shrink-0 items-center justify-center border-t-[1px] bg-neutral-50">
              <TabsList className="w-full max-w-md h-auto bg-transparent justify-center p-1 space-x-2">
                {projects.map((project) => {
                  const isActive = activeTab === project.id
                  return (
                    <TabsTrigger
                      key={project.id}
                      value={project.id}
                      className={cn(
                        "group flex cursor-pointer items-center",
                        "border border-gray-400 bg-white",
                        "transition-all duration-200 ease-out",
                        "hover:bg-gray-200 dark:hover:bg-gray-200",
                        isActive 
                          ? "h-[36px] w-auto px-3 justify-start" 
                          : "h-[36px] w-[36px] rounded-full justify-center"
                      )}
                    >
                      <div className="flex items-center justify-center">
                        <div className={cn(
                          "transition-all duration-200",
                          "text-gray-1200"
                        )}>
                          {project.icon}
                        </div>
                      </div>
                      <span
                        className={cn(
                          "ml-2 transition-all duration-200",
                          "opacity-0 max-w-0 overflow-hidden",
                          isActive && "opacity-100 max-w-[100px]"
                        )}
                      >
                        {project.title}
                      </span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


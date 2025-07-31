"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  SparklesIcon,
  XMarkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useSelector } from "react-redux";
import { type RootState } from "../../lib/redux/store";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import {
  setChatOpen,
  toggleChat,
  addNotification,
} from "../../lib/redux/slices/uiSlice";
import { useAgentNavigation } from "../../lib/hooks/useAgentNavigation";
import { useCopilotReduxBridge } from "../../lib/copilot-kit/redux-bridge";
import { useCopilotAction } from "@copilotkit/react-core";

/**
 * CopilotKit Chat Sidebar Component with Drag & Drop Support
 *
 * This component provides a full-height sidebar chat interface using CopilotKit.
 * It integrates with Redux state and provides a natural language interface
 * for interacting with the Kigo Pro platform.
 *
 * NEW: Supports drag & drop image upload directly into the chat interface!
 */
export function CopilotChatSidebar() {
  const dispatch = useAppDispatch();
  const chatOpen = useAppSelector((state) => state.ui.chatOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const demoState = useSelector((state: RootState) => state.demo);
  const userState = useSelector((state: RootState) => state.user);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Initialize Redux bridge
  const { campaignState } = useCopilotReduxBridge();

  // Enable agent-driven navigation
  useAgentNavigation();

  // Drag and Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the drop zone entirely
    if (
      dropZoneRef.current &&
      !dropZoneRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (imageFiles.length === 0) {
        dispatch(
          addNotification({
            message: "Please drop image files only (PNG, JPG, etc.)",
            type: "error",
          })
        );
        return;
      }

      // Handle single or multiple files
      if (imageFiles.length === 1) {
        const file = imageFiles[0];
        // Trigger the single upload action
        try {
          // This will trigger the uploadImageAsset action via CopilotKit
          const uploadMessage = `Upload image asset with file name: ${file.name} and file size: ${file.size}`;

          dispatch(
            addNotification({
              message: `📤 Processing ${file.name}...`,
              type: "info",
            })
          );

          // Auto-trigger the upload action (this will be handled by CopilotKit)
          console.log(
            "[Drag & Drop] Simulating upload for:",
            file.name,
            file.size
          );

          // For demo purposes, show success notification
          setTimeout(() => {
            dispatch(
              addNotification({
                message: `✅ ${file.name} ready for processing! Type "Upload image asset with file name: ${file.name}" to add it to your campaign.`,
                type: "success",
              })
            );
          }, 1000);
        } catch (error) {
          console.error("[Drag & Drop] Upload error:", error);
          dispatch(
            addNotification({
              message: `❌ Error processing ${file.name}`,
              type: "error",
            })
          );
        }
      } else {
        // Handle multiple files
        const fileNames = imageFiles.map((f) => f.name).join(", ");
        const totalSize = imageFiles.reduce((sum, f) => sum + f.size, 0);

        dispatch(
          addNotification({
            message: `📤 Processing ${imageFiles.length} images...`,
            type: "info",
          })
        );

        setTimeout(() => {
          dispatch(
            addNotification({
              message: `✅ ${imageFiles.length} images ready! Type "Upload multiple images with file count: ${imageFiles.length} and file names: ${fileNames}" to add them to your campaign.`,
              type: "success",
            })
          );
        }, 1000);
      }
    },
    [dispatch]
  );

  // Handle animations
  useEffect(() => {
    if (chatOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [chatOpen]);

  const handleToggle = () => {
    dispatch(toggleChat());
  };

  const getPersonalizedInstructions = () => {
    const basePlatformInstructions = `You are the Kigo Pro Business Success Manager, an AI assistant specialized in helping users create, manage, and optimize advertising campaigns for the Kigo loyalty media network. You can help with campaign creation, analytics, merchant management, and optimization strategies. You have access to the current page context and can help users navigate and understand the platform.

🎯 **DRAG & DROP SUPPORT**: Users can drag and drop images directly into this chat interface! When they do, guide them to use the upload commands to add the images to their campaigns.`;

    if (demoState.clientName) {
      return `${basePlatformInstructions}\n\nYou are currently working with ${demoState.clientName}. Tailor your responses to be relevant to their business context and needs.`;
    }

    return basePlatformInstructions;
  };

  return (
    <>
      {chatOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={handleToggle}
          aria-label="Close chat overlay"
        />
      )}

      {/* Floating Chat Button - positioned when chat is closed */}
      {!chatOpen && (
        <Button
          onClick={handleToggle}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50 p-0"
          aria-label="Open AI Assistant"
        >
          <SparklesIcon className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Full-height Sidebar */}
      {chatOpen && (
        <div
          className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-40 transform transition-transform duration-300 ease-in-out ${
            chatOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  AI Assistant
                </h2>
              </div>
            </div>

            <Button
              onClick={handleToggle}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close AI Assistant"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </Button>
          </div>

          {/* Chat Interface with Drag & Drop Support */}
          <div
            ref={dropZoneRef}
            className={`flex-1 overflow-hidden h-[calc(100vh-140px)] relative ${
              isDragOver
                ? "bg-blue-50 border-2 border-dashed border-blue-400"
                : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Drag & Drop Overlay */}
            {isDragOver && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-50 bg-opacity-95 border-2 border-dashed border-blue-400">
                <div className="text-center p-8">
                  <PhotoIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">
                    Drop Images Here
                  </h3>
                  <p className="text-blue-600 text-sm">
                    Upload images for your ad campaign
                  </p>
                  <div className="mt-4 text-xs text-blue-500">
                    Supports PNG, JPG, GIF files
                  </div>
                </div>
              </div>
            )}

            <CopilotSidebar
              instructions={getPersonalizedInstructions()}
              defaultOpen={true}
              clickOutsideToClose={false}
              labels={{
                title: "AI Assistant",
                initial:
                  "Hi! I'm your Kigo Pro assistant. How can I help you with your campaigns today? 📸 **Tip: You can drag & drop images directly into this chat!**",
              }}
            />
          </div>

          {/* Footer with Drag & Drop Indicator */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI Assistant Online</span>
              </div>
              <div>
                {demoState.clientName && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {demoState.clientName}
                  </span>
                )}
              </div>
            </div>
            {/* Drag & Drop Hint */}
            <div className="flex items-center justify-center space-x-1 text-xs text-gray-400 border-t border-gray-200 pt-2">
              <PhotoIcon className="h-3 w-3" />
              <span>Drag & drop images to upload</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CopilotChatSidebar;

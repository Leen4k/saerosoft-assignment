import React, { useState, useEffect, useCallback, useRef } from "react";
import { Queue } from "../../utils/queue/Queue";
import { AI_RESPONSES } from "../../utils/constants/AiConstant";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: number;
}

const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const aiQueue = useRef(new Queue<Message>());
  const [isProcessing, setIsProcessing] = useState(false);
  const [queueLength, setQueueLength] = useState(0);

  const getRandomAiResponse = (): string => {
    const randomIndex = Math.floor(Math.random() * AI_RESPONSES.length);
    return AI_RESPONSES[randomIndex];
  };

  const processNextAiResponse = useCallback(async () => {
    if (aiQueue.current.isEmpty() || isProcessing) return;

    setIsProcessing(true);
    const nextResponse = aiQueue.current.peek();

    const delayAi = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;

    await new Promise((resolve) => setTimeout(resolve, delayAi));

    if (nextResponse) {
      aiQueue.current.dequeue();
      setQueueLength(aiQueue.current.size());
      setMessages((prev) => [...prev, nextResponse]);
    }

    setIsProcessing(false);
  }, [isProcessing]);

  useEffect(() => {
    const processQueue = async () => {
      if (!isProcessing && queueLength > 0) {
        await processNextAiResponse();
      }
    };
    processQueue();
  }, [isProcessing, processNextAiResponse, queueLength]);

  const sendMessage = (userMessage: string) => {
    if (!userMessage.trim()) return;
    const userMessageObj: Message = {
      text: userMessage,
      isUser: true,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessageObj]);

    const aiMessageObj: Message = {
      text: getRandomAiResponse(),
      isUser: false,
      timestamp: Date.now(),
    };
    aiQueue.current.enqueue(aiMessageObj);
    setQueueLength(aiQueue.current.size());
    setInputMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  message.isUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => sendMessage(inputMessage)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;

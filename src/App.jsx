import { useEffect, useRef, useState } from "react";
import { FaRobot } from "react-icons/fa";
import Form from "./components/Form";
import Messages from "./components/Messages";

function App() {
  const [messages, setMessages] = useState([]);

  const generateBotResponse = async (message) => {
    // helper function to update chat messages
    const updateMessage = (text, isError = false) => {
      setMessages((prev) => [...prev.filter((msg) => msg.text !== "Typing..."), { role: "model", text, isError }]);
    };

    const formattedMessages = message.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    // format chat api request

    const requestHeader = {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY },
      body: JSON.stringify({ contents: formattedMessages }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_GEMINI_API_URL, requestHeader);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || "Something went wrong");
      console.log("Gemini response", data);

      const botResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1");

      updateMessage(botResponse);
    } catch (error) {
      updateMessage(error.message, true);
    }
  };

  // scrollbar to new messages
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-[#1A1A1E]">
        <div className="shadow-lg w-full max-w-6xl h-[calc(100vh-9rem)] px-14 xl:px-0">
          {/* Header */}
          <div className="bg-[#2e2ea5] text-white px-4 py-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-2xl">Mini Chatbot</h1>
              <div className="rounded-full bg-white w-8 h-8 flex items-center justify-center">
                <FaRobot className="text-[#2e2ea5]" />
              </div>
            </div>
            {/* <button className="flex items-center gap-2">
              <FaAngleDown className="cursor-pointer w-5 h-5" />
            </button> */}
          </div>

          {/* Messages */}
          <div className="p-4 h-[calc(75vh-5rem)] overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100 ">
            <div className="flex flex-col gap-2 ">
              <div className="flex flex-row gap-2 items-center">
                <div className="rounded-full bg-[#2e2ea5] w-8 h-8 flex items-center justify-center">
                  <FaRobot className="text-white" />
                </div>
                <div className="bg-[#dfe9ff] text-[#1a1a4c] rounded-lg px-3 py-2 text-sm max-w-xs  ">
                  <p>Hey there 👋</p>
                  <p>How can I help you today?</p>
                </div>
              </div>
              {messages.map((message, index) => (
                <Messages key={index} message={message} />
              ))}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className=" px-3 pb-3 bg-white rounded-b-md">
            <Form messages={messages} setMessages={setMessages} botResponse={generateBotResponse} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

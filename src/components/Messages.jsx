import { FaRobot } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Messages = ({ index, message }) => {
  return (
    <div key={index} className={`flex flex-col gap-3  ${message.role === "user" ? "items-end" : "items-start"} }`}>
      <div className="flex flex-row items-center gap-2">
        {message.role !== "user" && (
          <div className="rounded-full bg-[#2e2ea5] w-8 h-8 flex items-center justify-center">
            <FaRobot className="text-white" />
          </div>
        )}

        <div
          className={`whitespace-pre-wrap break-words overflow-hidden  ${
            message.role === "user" ? "bg-[#4343e8] text-white" : "bg-[#dfe9ff] text-[#1a1a4c]"
          }  rounded-lg px-3 py-2 text-sm max-w-xs ${message.isError ? "text-red-500 font-semibold" : ""}`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => {
                const childArray = Array.isArray(children) ? children : [children];
                const hasPre = childArray.some((child) => child?.type === "pre");
                return hasPre ? <>{children}</> : <p className="mb-2">{children}</p>;
              },

              pre: ({ children }) => <pre className="overflow-auto max-w-sm bg-gray-100 rounded text-xs p-2">{children}</pre>,
              code: ({ inline, children, ...props }) => {
                return inline ? (
                  <code className="bg-gray-100 px-1 rounded text-xs break-words whitespace-pre-wrap">{children}</code>
                ) : (
                  <code className="break-words whitespace-pre-wrap" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Messages;

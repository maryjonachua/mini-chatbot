import { TextInput } from "flowbite-react";
import { useRef } from "react";

const Form = ({ messages, setMessages, botResponse }) => {
  const inputRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();

    const userMessage = inputRef.current.value.trim();

    if (!userMessage) return;
    inputRef.current.value = "";

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    // typing bot response
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "model", text: "Typing..." }]);

      // generate bot response
      botResponse([...messages, { role: "user", text: userMessage }]);
    }, 600);
  };
  return (
    <form className="flex items-center gap-2 " onSubmit={handleSubmit}>
      <TextInput ref={inputRef} type="text" placeholder="Message..." sizing="sm" className="flex-1 rounded-full" />
      <button className="bg-[#2e2ea5] text-white rounded-full px-4 py-2">Send</button>
    </form>
  );
};

export default Form;

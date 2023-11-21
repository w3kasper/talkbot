"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useChat, Message } from "ai/react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function ChatComponent() {
  // Vercel AI SDK (ai package) useChat()
  // useChat -> handles messages for us, user input, handling user submits, etc.
  const { input, handleInputChange, handleSubmit, isLoading, messages } =
    useChat();
  // messages -> [user asks a question, gpt-4 response, user asks again, gpt-4 responds]

  //console.log(messages);
  //console.log(input);

  const [speechInput, setSpeechInput] = useState(""); // New state variable to pass transcript from SPEECH to input for GPT

  //speech
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Update speechInput when transcript changes or input changes via keyboard
  useEffect(() => {
    if (transcript !== undefined) {
      setSpeechInput(transcript);
    }
  }, [transcript, input]); // Include input as a dependency

  // // Update input when speechInput changes
  useEffect(() => {
    const event = {
      target: {
        value: speechInput,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(event);
  }, [speechInput]);

  //does it support speech?
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  //scrollbar at bottom
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the messages container whenever new messages are added
  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current?.scrollHeight,
      behavior: "smooth", // optional, for smooth scrolling
    });
  }, [messages]); // Assuming messages is the array of messages you're mapping over

  return (
    <>
      <div className="flex flex-col h-screen">
        {/* TOP */}
        <div className="fixed h-[8%] top-0 w-full flex justify-center rounded-none bg-gray-600">
          <Image
            src="/images/logo.svg"
            alt="translate ai logo"
            width={212}
            height={45}
          />
        </div>

        {/*MIDDLE */}
        <div className="flex justify-center">
          <div
            className="fixed top-[8%] flex-1 overflow-y-auto w-full sm:w-[632px] h-[62%] bg-gray-200 p-4 rounded-md"
            ref={messagesContainerRef}
          >
            {/* GPT */}
            {messages.map((message: Message) => (
              <div key={message.id} className="bg-gray-300 rounded-md">
                {/* Name of person talking */}
                <h3 className="pl-4 text-md font-semibold mt-2">
                  {message.role === "assistant" ? "GPT" : "User"}
                </h3>

                {/* Formatting the message */}
                {message.content
                  .split("\n")
                  .map((currentTextBlock: string, index: number) => {
                    if (currentTextBlock === "") {
                      return (
                        <p
                          className="pl-4 text-sm font-normal whitespace-pre-line mb-2"
                          key={message.id + index}
                        >
                          &nbsp;
                        </p>
                      ); // " "
                    } else {
                      return (
                        <p
                          className="pl-4 text-sm font-normal whitespace-pre-line mb-2"
                          key={message.id + index}
                        >
                          {currentTextBlock}
                        </p>
                      );
                    }
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="fixed bottom-0 w-full bg-gray-600 h-[30%] rounded-none">
        <form onSubmit={handleSubmit}>
          <div
            className="flex flex-col justify-evenly"
            style={{ height: "30vh" }}
          >
            {/* TEXTBOX */}
            <div className="flex justify-center align-middle px-4 ">
              <textarea
                className="text-center w-full bg-gray-200 rounded-md p-4 sm:w-[632px] border border-1 border-gray-600"
                placeholder={"Press record and ask me anything."}
                value={input}
                onChange={handleInputChange}
              />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-center items-center space-x-4">
              <button
                type="button"
                className="bg-yellow-500 px-4 w-[50px] h-[50px] rounded-full hover:opacity-80"
                onClick={() =>
                  handleInputChange({
                    target: { value: "" },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              >
                <Image
                  src="/images/reset.svg" // path to the image in the public folder
                  alt="Your Image Alt Text"
                  width={50} // specify the width of the image
                  height={50} // specify the height of the image
                />
              </button>
              <button
                className=" bg-red-500 w-[65px] h-[65px] rounded-full hover:opacity-80 px-4"
                onClick={() => SpeechRecognition.startListening()}
              >
                <Image
                  src="/images/rec.svg" // path to the image in the public folder
                  alt="Your Image Alt Text"
                  width={50} // specify the width of the image
                  height={50} // specify the height of the image
                />
              </button>

              <button className="bg-blue-500 px-4 w-[50px] h-[50px] rounded-full hover:opacity-80">
                <Image
                  src="/images/send.svg" // path to the image in the public folder
                  alt="send"
                  width={50} // specify the width of the image
                  height={50} // specify the height of the image
                />
              </button>
            </div>
            {/* MIC STATUS */}
            <div className="flex justify-center space-x-10 text-md font-normal text-white px-20">
              <div className="border border-1 border-slate-200 py-2 px-4 rounded-full">
                Mic: {listening ? "Listing to your voice.." : "Off"}
              </div>
              <div className="border border-1 border-slate-200 py-2 px-4 rounded-full">
                {" "}
                <a
                  target="_blank"
                  href="https://twitter.com/W3Kasper"
                  rel="noopener noreferrer"
                >
                  Follow For Updates
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div></div>
    </>
  );
}

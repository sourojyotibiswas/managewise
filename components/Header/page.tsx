"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/Images/Logo.png";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useTaskStore } from "@/store/TaskStore";
import fetchSuggestion from "@/lib/fetchSuggestion";

const Header = () => {
  const [taskBoard, searchString, setSearchString] = useTaskStore((state) => [
    state.taskBoard,
    state.searchString,
    state.setSearchString,
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    if (taskBoard.columns.size === 0) return;
    setLoading(true);
    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(taskBoard);
      setSuggestion(suggestion);
      setLoading(false);
    };

    fetchSuggestionFunc();
  }, [taskBoard]);

  return (
    <header>
      <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 filter blur-3xl opacity-50 -z-50 " />
      <div className="shadow-xl rounded-bl-2xl rounded-br-2xl px-4 py-10 flex flex-col gap-10 md:flex-row items-center justify-between border-b-2 border-b-slate-100/20">
        <div className="flex justify-center items-end ">
          <Image src={Logo} alt="logo image" width={50} />
          <span className="text-3xl font-bold drop-shadow-xl text-yellow-50">
            anage Wise
          </span>
        </div>
        <form className="border rounded flex justify-center items-center md: flex-initial bg-white">
          <input
            type="text"
            className="rounded pl-4 py-1.5 focus:outline-none flex-1 focus:border-purple-400"
            placeholder="Search your job here"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <button type="submit">
            <MagnifyingGlassIcon className="h-8 w-8 fill-gray-300" />
          </button>
        </form>
      </div>

      <div className="my-3">
        <p className="flex items-center justify-center text-sm font-mono text-red-500 italic gap-1 p-5">
          <UserCircleIcon
            className={`h-7 w-7 text-black fill-purple-400 ${
              loading && "animate-spin"
            }`}
          />
          {suggestion && !loading
            ? suggestion
            : "AI Summarizing Feature May not Work..."}
        </p>
      </div>
    </header>
  );
};

export default Header;

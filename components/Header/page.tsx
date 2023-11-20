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
      <div className="bg-slate-500/10 shadow-xl rounded-bl-2xl rounded-br-2xl px-4 py-10 flex flex-col gap-10 md:flex-row items-center justify-between">
        <div className="flex justify-center items-end ">
          <Image src={Logo} alt="logo image" width={50} />
          <span className="text-3xl font-bold drop-shadow-xl">anage Wise</span>
        </div>
        <form className="flex justify-center items-center gap-1 md: flex-initial">
          <input
            type="text"
            className="border rounded px-4 py-1.5 focus:outline-none focus:border-green-500 flex-1"
            placeholder="Search your job here"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <button type="submit">
            <MagnifyingGlassIcon className="h-8 w-8" />
          </button>
        </form>
      </div>
      <div className="my-3">
        <p className="flex items-center justify-center text-sm font-light text-black-200 italic gap-1 p-5">
          <UserCircleIcon
            className={`h-7 w-7 fill-blue-400 ${loading && "animate-spin"}`}
          />
          {suggestion && !loading
            ? suggestion
            : "AI is summarizing your job for the day...s"}
        </p>
      </div>
    </header>
  );
};

export default Header;

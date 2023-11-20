import formatTodosForAI from "./formatTodosForAI";

const fetchSuggestion = async (board: TaskBoard) => {
  const todos = formatTodosForAI(board);
  // console.log("Formatted todos to send >>", todos);
  const resp = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });
  // console.log("Response:", resp);

  const GPTdata = await resp.json();
  const { content } = GPTdata;
  return content;
};

export default fetchSuggestion;

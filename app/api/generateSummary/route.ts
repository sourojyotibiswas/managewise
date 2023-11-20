import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // todos in the post req body
  const { todos } = await request.json();
  // console.log(todos);

  //   open AI GPT integration
  const resp = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content: `When responding, welcome the user always as Mr.Souro and say welcome to manage wise app. Limit the response to 150 charecters`,
      },
      {
        role: "user",
        content: `Hello, provide a summary of the following todos. Count how many todos are in each category such as to do, in progress and done, then tell the user to have a productive day! Here's the data: ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });
  const data = resp;
  // console.log("DATA IS: ", data);
  // console.log(data.choices[0].message);
  return NextResponse.json(data.choices[0].message);
}

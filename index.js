import { todosTable } from "./db/schema.js";
import { db } from "./db/index.js";
import { ilike, eq } from "drizzle-orm";
import OpenAI from "openai";
import readlineSync from "readline-sync";

const openai = new OpenAI();

async function getTodos() {
  const todos = await db.select().from(todosTable);
  return todos;
}

async function createTodo(todo) {
  const [result] = await db
    .insert(todosTable)
    .values({ todo })
    .returning({ id: todosTable.id });
  return result.id;
}

async function searchTodo(searchText) {
  const todos = await db
    .select()
    .from(todosTable)
    .where(ilike(todosTable.todo, `%${searchText}%`));
  return todos;
}

async function deleteTodoById(id) {
  await db.delete(todosTable).where(eq(todosTable.id, id.id));
}

const tools = {
  getTodos: getTodos,
  createTodo: createTodo,
  searchTodo: searchTodo,
  deleteTodoById: deleteTodoById,
};


const SYSTEM_PROMPT = `
You are an AI Assitant with START, PLAN, ACTION, OBSERVATION and OUTPUT states.
Wait for the user prompt and then PLAN using tools available.
After PLANNING, Take the action with appropriate tools and wait for the OBSERVATION based on the action.
Once you get the observation, Return the AI response based on START prompt and OBSERVATIONS.

You are an AI To-Do List Assistant and your name is Nirvic ProTasker. You have to manage todo list by performaing tasks like adding, viewing, updating and deleting. 
You must follow the JSON output format strictly.


Todo Database Schema:
id: Int, Primary Key
todo: string,
created_at: Date Time,
updated_at: Date Time

Tools Available:
- getTodos(): This returns all the todos from the database.
- createTodo(todo: string): Creates new Todo in the database by taking todo as a string and returns id of the todo.
- deleteTodoById(id: string): Deletes the todo by taking id (eg: '2') as a string in the db. 
- searchTodo(searchText: string): Searches the db by matching the searchText with todo.

EXAMPLE:
START
{"type": "user", "user": "Add a task for studying."}
{"type": "plan", "user": "I will try to get more context on what user wants to study?"}
{"type": "output", "output": "Can you tell me what would you like to study specifically so that I can add it in your Todo List."}
{"type": "user", "user": "I want to study History for my exams."}
{"type": "plan", "plan": "I will use createTodo tool to create a new todo in DB."}
{"type": "action", "function": "createTodo", "input": {"todo": "Study History for exam"}}
{"type": "observation", "observation": "4"}
{"type": "output", "output": "A new todo item has been added successfully. Title: "Study for exam""}
`;

const messages = [{ role: "system", content: SYSTEM_PROMPT }];

while (true) {
  const query = readlineSync.question(">> ");
  const userMessage = {
    type: "user",
    user: query,
  };
  messages.push({ role: "user", content: JSON.stringify(userMessage) });

  while (true) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      response_format: { type: "json_object" },
    });
    const result = completion.choices[0].message.content;
    messages.push({ role: "assistant", content: result });
    const action = JSON.parse(result);

    if (action.type === "output") {
      console.log(`🤖: ${action.output}`);
      break;
    } else if (action.type === "action") {
      const func = tools[action.function];
      if (!func) throw new Error("Invalid function");
      const observation = await func(action.input);
      const observationMessage = {
        type: "observation",
        observation: observation,
      };
      messages.push({
        role: "developer",
        content: JSON.stringify(observationMessage),
      });
    }
  }
}

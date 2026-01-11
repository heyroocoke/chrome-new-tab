import type { Env, Todo, NotionQueryResponse, NotionPage } from './types';

const NOTION_API_VERSION = '2022-06-28';
const NOTION_BASE_URL = 'https://api.notion.com/v1';

function getTodayKST(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  return kstDate.toISOString().split('T')[0];
}

function pageToTodo(page: NotionPage): Todo {
  return {
    id: page.id,
    title: page.properties.Title.title[0]?.plain_text || '',
    done: page.properties.Done.checkbox,
    date: page.properties.Date.date?.start || '',
  };
}

export async function getTodos(env: Env): Promise<Todo[]> {
  const today = getTodayKST();

  const response = await fetch(
    `${NOTION_BASE_URL}/databases/${env.NOTION_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.NOTION_TOKEN}`,
        'Notion-Version': NOTION_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'Date',
          date: {
            equals: today,
          },
        },
        sorts: [
          {
            property: 'Done',
            direction: 'ascending',
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Notion API error: ${response.status} - ${error}`);
  }

  const data = (await response.json()) as NotionQueryResponse;
  return data.results.map(pageToTodo);
}

export async function updateTodo(
  env: Env,
  pageId: string,
  done: boolean
): Promise<void> {
  const response = await fetch(`${NOTION_BASE_URL}/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${env.NOTION_TOKEN}`,
      'Notion-Version': NOTION_API_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        Done: {
          checkbox: done,
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Notion API error: ${response.status} - ${error}`);
  }
}

export async function createTodo(env: Env, title: string): Promise<Todo> {
  const today = getTodayKST();

  const response = await fetch(`${NOTION_BASE_URL}/pages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.NOTION_TOKEN}`,
      'Notion-Version': NOTION_API_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: {
        database_id: env.NOTION_DATABASE_ID,
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        Date: {
          date: {
            start: today,
          },
        },
        Done: {
          checkbox: false,
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Notion API error: ${response.status} - ${error}`);
  }

  const page = (await response.json()) as NotionPage;
  return pageToTodo(page);
}

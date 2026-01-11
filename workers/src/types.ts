export interface Env {
  NOTION_TOKEN: string;
  NOTION_DATABASE_ID: string;
  API_KEY: string;
}

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  date: string;
}

export interface NotionPage {
  id: string;
  properties: {
    Title: {
      title: Array<{ plain_text: string }>;
    };
    Date: {
      date: { start: string } | null;
    };
    Done: {
      checkbox: boolean;
    };
  };
}

export interface NotionQueryResponse {
  results: NotionPage[];
  has_more: boolean;
  next_cursor: string | null;
}

import type { Env } from './types';
import { getTodos, updateTodo, createTodo } from './notion';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

function error(message: string, status = 400): Response {
  return json({ error: message }, status);
}

function authenticate(request: Request, env: Env): boolean {
  const apiKey = request.headers.get('X-API-Key');
  return apiKey === env.API_KEY;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check (no auth required)
    if (path === '/health' && method === 'GET') {
      return json({ status: 'ok', timestamp: new Date().toISOString() });
    }

    // All other routes require authentication
    if (!authenticate(request, env)) {
      return error('Unauthorized', 401);
    }

    try {
      // GET /todos - 오늘 할 일 목록 조회
      if (path === '/todos' && method === 'GET') {
        const todos = await getTodos(env);
        return json({ todos });
      }

      // POST /todos - 새 할 일 생성
      if (path === '/todos' && method === 'POST') {
        const body = (await request.json()) as { title?: string };
        if (!body.title || typeof body.title !== 'string') {
          return error('title is required');
        }
        const todo = await createTodo(env, body.title.trim());
        return json(todo, 201);
      }

      // PATCH /todos/:id - 할 일 상태 업데이트
      const patchMatch = path.match(/^\/todos\/([a-f0-9-]+)$/);
      if (patchMatch && method === 'PATCH') {
        const pageId = patchMatch[1];
        const body = (await request.json()) as { done?: boolean };
        if (typeof body.done !== 'boolean') {
          return error('done (boolean) is required');
        }
        await updateTodo(env, pageId, body.done);
        return json({ success: true });
      }

      return error('Not Found', 404);
    } catch (err) {
      console.error('Error:', err);
      const message = err instanceof Error ? err.message : 'Internal Server Error';
      return error(message, 500);
    }
  },
};

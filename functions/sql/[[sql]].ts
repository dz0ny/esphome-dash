interface Env {
    KV: KVNamespace;
    DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const topic = context.params.sql as string;
    const url = new URL(context.request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    if (from === undefined || to === undefined) {
        return new Response('From and to not specified', { status: 400 });
    }

    if (topic === undefined) {
        return new Response('Topic not specified', { status: 400 });
    }
    if (topic.length > 256) {
        return new Response('Topic too long', { status: 400 });
    }
    if (context.request.method === 'GET') {
        const { results } = await context.env.DB.prepare(`
            select ts, value from podatki where topic = ? and ts >= ? and ts <= ? order by ts;
        `).bind(`${topic}`, `${from}`, `${to}`).all();
        const data = results.map((row) => {
            return {
                ts: row.ts,
                value: JSON.parse(row.value),
            };
        });

        return Response.json(data);
    }

    return new Response('Method not allowed', { status: 405 });
}
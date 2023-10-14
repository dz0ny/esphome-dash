interface Env {
    KV: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const topic = context.params.topic as string;
    if (topic === undefined) {
        return new Response('Topic not specified', { status: 400 });
    }
    if (topic.search(/[^a-zA-Z0-9.-]/) !== -1) {
        return new Response('Invalid topic name', { status: 400 });
    }
    if (context.request.method === 'POST') {
        const requestBody = await context.request.text();
        context.env.KV.put(topic, requestBody);
        return new Response("OK");
    }
    if (context.request.method === 'GET') {
        const value = await context.env.KV.get(topic);
        return new Response(value);
    }

    return new Response('Method not allowed', { status: 405 });
}
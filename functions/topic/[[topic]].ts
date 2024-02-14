interface Env {
    KV: KVNamespace;
    DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const topic = context.params.topic as string;
    if (topic === undefined) {
        return new Response('Topic not specified', { status: 400 });
    }
    if (topic.length > 256) {
        return new Response('Topic too long', { status: 400 });
    }
    if (context.request.method === 'POST') {
        const reports = await context.request.json();
        const requestBody = JSON.stringify({
            reports,
            status: true,
            updatedAt: new Date().toISOString(),
        });
        await context.env.KV.put(topic, requestBody);
        console.log(`Updated topic ${topic}`, requestBody);
        var ts = new Date();
        //ts.setSeconds(0);
        //ts.setMilliseconds(0);
        // strip out seconds and milliseconds
        const values = JSON.stringify(reports.map((report) => {
            return {
                value: Number(report.value.replace(/[^0-9.]/g, '')),
                name: report.name,
            };
        }));
        await context.env.DB
            .prepare('INSERT INTO podatki (ts, topic, value) VALUES (?, ?, ?)')
            .bind(`${ts.toISOString()}`, `${topic}`, `${values}`)
            .run();
        return new Response("OK");
    }
    if (context.request.method === 'GET') {
        const value = await context.env.KV.get(topic);
        return new Response(value);
    }

    return new Response('Method not allowed', { status: 405 });
}
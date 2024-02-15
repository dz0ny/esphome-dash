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
        const reports = await context.request.json() as Array<{ name: string, value: string, icon: string }>;
        const requestBody = JSON.stringify({
            reports,
            status: true,
            updatedAt: new Date().toISOString(),
        });
        await context.env.KV.put(topic, requestBody);
        console.log(`Updated topic ${topic}`, requestBody);

        // if topic contains - also store it in db
        if (String(topic).indexOf('-') > 0) {
            //if report with same topic was already stored in db in the last 45s ignore it
            const lastReport = await context.env.DB
                .prepare('SELECT * FROM podatki WHERE topic = ? and ts >= ?')
                .bind(`${topic}`, `${new Date(new Date().getTime() - 60 * 1000 * 5).toISOString()}`)
                .all();
            if (lastReport.length > 0) {
                console.log('Ignoring report');
                return new Response("Ignoring duplicte report");
            }

            const values = JSON.stringify(reports.map((report) => {
                return {
                    value: Number(report.value.replace(/[^0-9.-]/g, '')),
                    name: report.name,
                };
            }));
            await context.env.DB
                .prepare('INSERT INTO podatki (ts, topic, value) VALUES (?, ?, ?)')
                .bind(`${new Date().toISOString()}`, `${topic}`, `${values}`)
                .run();
            console.log(`Inserted topic ${topic} to db`, values);
        }

        return new Response("OK");
    }
    if (context.request.method === 'GET') {
        const value = await context.env.KV.get(topic);
        return new Response(value);
    }

    return new Response('Method not allowed', { status: 405 });
}
import { showList } from './broswer';
import { validateAuthorization } from './login';

export default {

    async fetch(request, env, ctx) {

        const url = new URL(request.url);
        const path = url.pathname;
        const uri = decodeURIComponent(url.pathname.slice(1));
        const fname = uri.substring(uri.lastIndexOf('/') + 1);
        const r2 = env.MY_BUCKET;

        // 需要通过 HTTP Basic Auth，用户名和密码保存在 wrangler.toml
        // 获取 header 验证信息
        const authorization = request.headers.get('Authorization');
        // 用户名和密码验证
        if (!authorization || !validateAuthorization(authorization, env)) {
            return new Response("You need to login.", {
                status: 401,
                headers: {
                    // Prompts the user for credentials.
                    "WWW-Authenticate": 'Basic realm="my scope", charset="UTF-8"',
                },
            });
        }

        // GET操作的两种情况
        // - URL结尾无 "/"，单个文件对象下载
        // - URL结尾有 "/"，显示当前目录的列表视图
        if (request.method === 'GET') {

            const originResponse = await fetch(request);

            if ((originResponse.status !== 404) || (originResponse.url.slice(-1) !== '/')) {

                // 下载文件
                const object = await r2.get(uri);

                if (object === null) {
                    return new Response('Object Not Found', { status: 404 });
                }

                const headers = new Headers();
                object.writeHttpMetadata(headers);
                headers.set('etag', object.httpEtag);
                headers.set('Content-Disposition', 'attachment;filename='+fname)

                return new Response(object.body, {
                    headers,
                });

            } else {

                // 获取当前 prefix 目录列表。
                // R2ListOptions ：https://developers.cloudflare.com/r2/api/workers/workers-api-reference/#r2listoptions
                const index = await r2.list({
                    prefix: uri,  //URI是当前路径
                    delimiter: '/',
                    include: ['httpMetadata', 'customMetadata']
                })

                return new Response(
                    // 显示目录列表视图
                    showList(index.objects, index.delimitedPrefixes, path, env),
                    {
                        headers: {
                            'Content-Type': 'text/html; charset=utf-8',
                        },
                        status: 200,
                    }
                )
            }
        };

        // 文件对象上传
        if (request.method === 'PUT') {
            const key = uri;
            await r2.put(key, request.body, {
                httpMetadata: request.headers,
            });
            return new Response(`Put ${key} successfully!`);
        };

        // 文件对象删除
        if (request.method === 'DELETE') {

            // const api_key = request.headers.get('API_KEY');
            // if (api_key === env.KEY) {
            const key = decodeURIComponent(path.substring(1));
            await r2.delete((key));
            return new Response(`DELETE ${key} successfully!`)
            
        };

    }
};

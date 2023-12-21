import { showList } from './ui';

export default {

    async fetch(request, env, ctx) {

        const originResponse = await fetch(request)
        // if status is not 404 or request path not end with '/', return origin response
        if ((originResponse.status !== 404) || (originResponse.url.slice(-1) !== '/')) {
            return originResponse;
        }
        const url = new URL(request.url);
        const path = url.pathname;
		    const uri = decodeURIComponent(url.pathname.slice(1));
        const r2 = env.MY_BUCKET;

        const index = await r2.list({
            prefix: uri,  //URI是当前路径
            delimiter: '/',
            include: ['httpMetadata', 'customMetadata']
        });

        if (index.objects.length === 0 && index.delimitedPrefixes.length === 0) {
            return originResponse;
        };

        return new Response(
            // 显示列表视图
            showList(index.objects, index.delimitedPrefixes, path),
            {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                status: 200,
            }
        );
    }
};

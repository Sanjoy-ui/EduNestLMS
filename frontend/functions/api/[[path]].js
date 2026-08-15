// Cloudflare Pages Function: Reverse Proxy /api/* requests to AWS ALB
const ALB_BACKEND_URL = 'http://edunest-dev-alb-325997037.us-east-1.elb.amazonaws.com';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const destinationUrl = `${ALB_BACKEND_URL}${url.pathname}${url.search}`;

  // Clone headers and remove host header so ALB accepts request
  const headers = new Headers(context.request.headers);
  headers.set('Host', 'edunest-dev-alb-325997037.us-east-1.elb.amazonaws.com');

  const proxyRequest = new Request(destinationUrl, {
    method: context.request.method,
    headers: headers,
    body: ['GET', 'HEAD'].includes(context.request.method) ? null : context.request.body,
    redirect: 'follow'
  });

  try {
    const response = await fetch(proxyRequest);
    return response;
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Backend proxy failure', details: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

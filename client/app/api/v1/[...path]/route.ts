import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const getBackendUrl = () => {
  const port = process.env.SERVER_PORT || process.env.EXPRESS_PORT || "5005";
  return `http://127.0.0.1:${port}`;
};

async function handleProxy(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const pathSegment = Array.isArray(params.path) ? params.path.join("/") : params.path;
  const search = req.nextUrl.search;
  const targetUrl = `${getBackendUrl()}/api/v1/${pathSegment}${search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    // Avoid passing host to prevent host mismatches on internal reverse proxy
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  });
  headers.set("x-forwarded-host", req.headers.get("host") || "");

  try {
    const init: RequestInit = {
      method: req.method,
      headers,
      redirect: "manual",
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      init.body = await req.arrayBuffer();
    }

    const response = await fetch(targetUrl, init);
    const body = await response.arrayBuffer();

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Pass all response headers except content-encoding to avoid double decompression
      if (key.toLowerCase() !== "content-encoding") {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error(`[Next.js API Proxy] Error forwarding to ${targetUrl}:`, err?.message || err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal proxy connection error. Please try again.",
      },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
export const OPTIONS = handleProxy;

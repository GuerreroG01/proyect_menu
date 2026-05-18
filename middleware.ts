import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/.well-known")) {
        return new NextResponse(null, { status: 204 });
    }

    return NextResponse.next();
}
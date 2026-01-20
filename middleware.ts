import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/:path*'], // すべてのページに制限をかける
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // ★ここでIDとパスワードを設定
    // ユーザー名: admin, パスワード: ultla
    if (user === 'admin' && pwd === 'ultla') {
      return NextResponse.next();
    }
  }

  return new NextResponse('Auth Required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/models/AdminUser';
import { comparePassword, signToken } from '@/lib/auth';
import { validate, loginSchema, ValidationError } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const data = validate(loginSchema, body);

    const user = await AdminUser.findOne({ email: data.email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }
    if (!user.isActive) {
      return NextResponse.json({ success: false, message: 'Account is disabled' }, { status: 403 });
    }

    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken(user._id.toString(), user.email, user.role);

    user.lastLogin = new Date();
    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.fullName,
          role: user.role,
        },
      },
      message: 'Login successful',
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    console.error('Admin login error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

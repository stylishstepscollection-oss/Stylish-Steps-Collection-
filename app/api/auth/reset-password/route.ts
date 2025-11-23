import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Hash the received token to match database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    console.log('🔍 Password Reset Attempt:');
    console.log('Received token:', token);
    console.log('Hashed token:', hashedToken);

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      // Enhanced debugging
      const userWithToken = await User.findOne({
        resetPasswordToken: hashedToken,
      });
      
      if (userWithToken) {
        console.log('❌ Token found but expired');
        console.log('Token expired at:', userWithToken.resetPasswordExpires);
        console.log('Current time:', new Date());
        return NextResponse.json(
          { error: 'Reset link has expired. Please request a new one.' },
          { status: 400 }
        );
      } else {
        console.log('❌ No user found with this token');
        // Check if any user has a reset token
        const anyUserWithReset = await User.findOne({
          resetPasswordToken: { $exists: true, $ne: null }
        });
        if (anyUserWithReset) {
          console.log('Found user with different token:', anyUserWithReset.resetPasswordToken);
        }
        return NextResponse.json(
          { error: 'Invalid reset link. Please request a new one.' },
          { status: 400 }
        );
      }
    }

    console.log('✅ Valid token found for user:', user.email);

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('✅ Password reset successful for:', user.email);

    return NextResponse.json({
      message: 'Password reset successful. You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
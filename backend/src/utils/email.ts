// Simple email verification utility
// For MVP, we'll use a simple token-based system
// In production, integrate with a service like SendGrid, AWS SES, etc.

export const generateVerificationToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const sendVerificationEmail = async (email: string, token: string): Promise<boolean> => {
  // For MVP, we'll just log the verification link
  // In production, send actual email
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  console.log(`Verification email for ${email}: ${verificationUrl}`);
  
  // TODO: Integrate with email service
  return true;
};


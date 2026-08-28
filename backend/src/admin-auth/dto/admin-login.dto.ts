export interface AdminLoginDto {
  email: string;
  password: string;
}

export function validateAdminLoginDto(body: any): { isValid: boolean; data?: AdminLoginDto; error?: string } {
  if (!body || !body.email || typeof body.email !== 'string') {
    return { isValid: false, error: 'Admin email is required' };
  }
  if (!body.password || typeof body.password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }

  const emailClean = body.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
    return { isValid: false, error: 'Invalid email address format' };
  }

  return {
    isValid: true,
    data: {
      email: emailClean,
      password: body.password,
    },
  };
}

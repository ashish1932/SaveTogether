export const seedRolesAndPermissions = async (prisma: any) => {
  console.log('  └─ Seeding Admin Roles & Permissions...');

  const permissions = [
    { name: 'users.read', desc: 'Read user profiles' },
    { name: 'users.create', desc: 'Create user accounts' },
    { name: 'users.update', desc: 'Update user status' },
    { name: 'users.block', desc: 'Block/unblock users' },

    { name: 'societies.read', desc: 'Read societies' },
    { name: 'societies.create', desc: 'Create societies' },
    { name: 'societies.update', desc: 'Update societies' },

    { name: 'services.read', desc: 'Read services' },
    { name: 'services.create', desc: 'Create services' },
    { name: 'services.update', desc: 'Update services' },

    { name: 'pricing.read', desc: 'Read pricing tiers' },
    { name: 'pricing.create', desc: 'Create pricing tiers' },
    { name: 'pricing.update', desc: 'Update pricing tiers' },

    { name: 'demand.read', desc: 'Read demand campaigns' },
    { name: 'demand.manage', desc: 'Manage demand campaigns' },

    { name: 'vendors.read', desc: 'Read vendors' },
    { name: 'vendors.create', desc: 'Create vendors' },
    { name: 'vendors.update', desc: 'Update vendors' },
    { name: 'vendors.assign', desc: 'Assign vendors to campaigns' },

    { name: 'bookings.read', desc: 'Read bookings' },
    { name: 'bookings.update', desc: 'Update booking status' },

    { name: 'payments.read', desc: 'Read payments' },
    { name: 'refunds.manage', desc: 'Approve & process refunds' },

    { name: 'referrals.read', desc: 'Read referral logs' },
    { name: 'rewards.manage', desc: 'Manage reward wallet holds' },

    { name: 'complaints.read', desc: 'Read complaints' },
    { name: 'complaints.manage', desc: 'Resolve complaints' },

    { name: 'notifications.create', desc: 'Create notifications' },
    { name: 'notifications.send', desc: 'Dispatch notifications' },

    { name: 'reports.read', desc: 'Read executive reports' },
    { name: 'analytics.read', desc: 'Read analytics' },

    { name: 'settings.read', desc: 'Read settings' },
    { name: 'settings.update', desc: 'Update settings' },

    { name: 'audit.read', desc: 'Read audit logs' },
  ];

  for (const p of permissions) {
    if (prisma.permission?.upsert) {
      await prisma.permission.upsert({
        where: { name: p.name },
        update: {},
        create: { name: p.name, description: p.desc },
      });
    }
  }

  const roles = [
    { name: 'SUPER_ADMIN', desc: 'Full administrative control' },
    { name: 'OPERATIONS_ADMIN', desc: 'Demand & vendor operations' },
    { name: 'SUPPORT_ADMIN', desc: 'Customer support tickets' },
    { name: 'FINANCE_ADMIN', desc: 'Payments, refunds & payouts' },
    { name: 'MARKETING_ADMIN', desc: 'Referral growth & campaigns' },
  ];

  for (const r of roles) {
    if (prisma.role?.upsert) {
      await prisma.role.upsert({
        where: { name: r.name },
        update: {},
        create: { name: r.name, description: r.desc },
      });
    }
  }

  if (prisma.adminUser?.upsert) {
    await prisma.adminUser.upsert({
      where: { email: 'ashish.admin@savetogether.in' },
      update: {},
      create: {
        id: 'ADM1001',
        name: 'Ashish Kumar',
        email: 'ashish.admin@savetogether.in',
        passwordHash: '$2b$10$e7b5q2k4...hashedpassword',
        roleType: 'SUPER_ADMIN',
        twoFactorEnabled: true,
        status: 'ACTIVE',
      },
    });
  }
};

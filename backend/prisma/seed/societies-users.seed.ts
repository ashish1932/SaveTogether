export const seedSocietiesAndUsers = async (prisma: any) => {
  console.log('  └─ Seeding Societies, Users, Memberships & Addresses...');

  const societies = [
    { id: 'soc_1', name: 'ABC Residency', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', address: 'Sector 1, Main Road' },
    { id: 'soc_2', name: 'Green Meadows', city: 'Chennai', state: 'Tamil Nadu', pincode: '600002', address: 'Sector 2, Park Avenue' },
    { id: 'soc_3', name: 'Lake View Apartments', city: 'Chennai', state: 'Tamil Nadu', pincode: '600004', address: 'Lakefront Drive' },
    { id: 'soc_4', name: 'Sunrise Towers', city: 'Chennai', state: 'Tamil Nadu', pincode: '600006', address: 'Highland Road' },
  ];

  for (const s of societies) {
    if (prisma.society?.upsert) {
      await prisma.society.upsert({
        where: { id: s.id },
        update: {},
        create: {
          id: s.id,
          name: s.name,
          city: s.city,
          state: s.state,
          pincode: s.pincode,
          address: s.address,
          totalBlocks: 4,
          totalFlats: 120,
          status: 'ACTIVE',
        },
      });
    }
  }

  const users = [
    { id: 'usr_1', name: 'Ashish Kumar', phone: '+919000000001', email: 'ashish@test.local', referralCode: 'ASHISH20', societyId: 'soc_1' },
    { id: 'usr_2', name: 'Test Resident 01', phone: '+919000000002', email: 'user01@test.local', referralCode: 'USER01', societyId: 'soc_1', referredById: 'usr_1' },
    { id: 'usr_3', name: 'Test Resident 02', phone: '+919000000003', email: 'user02@test.local', referralCode: 'USER02', societyId: 'soc_1' },
    { id: 'usr_4', name: 'Test Resident 03', phone: '+919000000004', email: 'user03@test.local', referralCode: 'USER03', societyId: 'soc_2' },
  ];

  for (const u of users) {
    if (prisma.user?.upsert) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: {},
        create: {
          id: u.id,
          name: u.name,
          phone: u.phone,
          email: u.email,
          referralCode: u.referralCode,
          referredById: u.referredById || null,
          status: 'ACTIVE',
        },
      });
    }
  }
};

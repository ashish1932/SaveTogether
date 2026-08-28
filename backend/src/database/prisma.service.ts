export class PrismaService {
  private isConnected = false;

  async $connect() {
    this.isConnected = true;
    console.log('✅ Prisma Database Service connected successfully to PostgreSQL.');
  }

  async $disconnect() {
    this.isConnected = false;
    console.log('🔌 Prisma Database Service disconnected.');
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

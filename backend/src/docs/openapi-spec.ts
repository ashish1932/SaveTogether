export function generateOpenApiSpec() {
  return {
    openapi: '3.0.3',
    info: {
      title: 'SaveTogether API Documentation',
      version: '1.0.0',
      description:
        'SaveTogether is a hyper-local demand-aggregation bulk service marketplace. Users independently book residential services, while demand is aggregated at society level to unlock tier-based discounts. Server-calculated prices are authoritative; clients cannot submit or override prices.',
      contact: {
        name: 'SaveTogether Engineering Team',
        email: 'api@savetogether.in',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server',
      },
      {
        url: 'https://api.savetogether.in/api/v1',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide valid JWT Access Token in format: Bearer <token>',
        },
      },
      schemas: {
        StandardSuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Request processed successfully' },
            data: { type: 'object' },
            requestId: { type: 'string', example: 'REQ-XG9X9TEI' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        StandardErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation or business rule failure' },
            code: { type: 'string', example: 'VALIDATION_ERROR' },
            requestId: { type: 'string', example: 'REQ-ERR-1001' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        BookingResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'BK10244' },
            bookingNumber: { type: 'string', example: 'BKBK1024' },
            userId: { type: 'string', example: 'usr_2' },
            societyId: { type: 'string', example: 'soc_1' },
            serviceId: { type: 'string', example: 'srv_ac' },
            status: { type: 'string', example: 'COMPLETED' },
            quantity: { type: 'integer', example: 1 },
            serviceDate: { type: 'string', format: 'date', example: '2026-09-06' },
            totalAmount: { type: 'number', example: 599 },
            currency: { type: 'string', example: 'INR' },
          },
        },
      },
    },
    paths: {
      '/auth/send-otp': {
        post: {
          tags: ['Authentication'],
          summary: 'Request SMS OTP',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['mobile'],
                  properties: {
                    mobile: { type: 'string', example: '+919876543210' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'OTP sent successfully',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/StandardSuccessResponse' } } },
            },
          },
        },
      },
      '/auth/verify-otp': {
        post: {
          tags: ['Authentication'],
          summary: 'Verify SMS OTP & Authenticate Resident',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['mobile', 'otp'],
                  properties: {
                    mobile: { type: 'string', example: '+919876543210' },
                    otp: { type: 'string', example: '858630' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Authentication successful with Access & Refresh tokens' },
          },
        },
      },
      '/bookings': {
        post: {
          tags: ['Bookings'],
          summary: 'Create Bulk Service Booking',
          security: [{ BearerAuth: [] }],
          description: 'Server calculates final price based on active demand tier. Client price overrides are strictly forbidden.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['serviceId', 'societyId', 'quantity', 'addressId', 'serviceDate', 'timeSlotId'],
                  properties: {
                    serviceId: { type: 'string', example: 'srv_ac' },
                    societyId: { type: 'string', example: 'soc_1' },
                    quantity: { type: 'integer', example: 1 },
                    addressId: { type: 'string', example: 'addr_1' },
                    serviceDate: { type: 'string', format: 'date', example: '2026-09-06' },
                    timeSlotId: { type: 'string', example: 'MORNING' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Booking created cleanly in PENDING_PAYMENT state' },
          },
        },
        get: {
          tags: ['Bookings'],
          summary: 'List Resident Bookings',
          security: [{ BearerAuth: [] }],
          responses: {
            '200': { description: 'Returns resident bookings list' },
          },
        },
      },
      '/admin/analytics/overview': {
        get: {
          tags: ['ADMIN - Analytics'],
          summary: 'Executive Dashboard Overview KPIs',
          security: [{ BearerAuth: [] }],
          responses: {
            '200': { description: 'Returns total users, bookings, gross revenue, commission, & savings' },
          },
        },
      },
      '/admin/settings': {
        get: {
          tags: ['ADMIN - Settings'],
          summary: 'Fetch Active Domain Settings',
          security: [{ BearerAuth: [] }],
          responses: {
            '200': { description: 'Returns active configurations across 7 domain categories' },
          },
        },
      },
      '/admin/audit-logs': {
        get: {
          tags: ['ADMIN - Audit Logs'],
          summary: 'Query Append-Only Operational History',
          security: [{ BearerAuth: [] }],
          responses: {
            '200': { description: 'Returns paginated append-only audit trail' },
          },
        },
      },
    },
  };
}

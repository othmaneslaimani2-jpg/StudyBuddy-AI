export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'StudyBuddy AI API',
    version: '1.0.0',
    description: `## StudyBuddy AI Backend Documentation
Interactive API reference powered by **Scalar Docs**.

### Features:
- 🔐 **Authentication**: JWT-based user sign-up & log-in
- 📚 **Subjects & Tasks**: Homework and subject management
- 📝 **Vector Notes**: RAG-ready notes indexed with Google Gemini (\`text-embedding-004\`) and Pinecone
- 🤖 **AI Tutor**: Real-time tutoring and automated task scheduling with Gemini 2.5 Flash
`,
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from `/api/auth/login`',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Subject: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', example: 'Biology' },
          color: { type: 'string', example: '#4F46E5' },
          userId: { type: 'string', format: 'uuid' },
        },
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', example: 'Review Chapter 3 Flashcards' },
          dueDate: { type: 'string', format: 'date-time' },
          subjectId: { type: 'string', format: 'uuid' },
        },
      },
      Note: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', example: 'Photosynthesis Overview' },
          content: { type: 'string', example: 'Light-dependent reactions occur in the thylakoid membranes...' },
          subjectId: { type: 'string', format: 'uuid' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Something went wrong' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Server Health Check',
        description: 'Returns the health status and current timestamp of the API.',
        responses: {
          '200': {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'student@studybuddy.ai' },
                  password: { type: 'string', format: 'password', example: 'SecretP@ssword123' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
          },
          '400': {
            description: 'Invalid input or email already exists',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in and obtain JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'student@studybuddy.ai' },
                  password: { type: 'string', format: 'password', example: 'SecretP@ssword123' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful with token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Login successful!' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid credentials',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },
    '/api/subjects': {
      get: {
        tags: ['Subjects'],
        summary: 'List all subjects for authenticated user',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of subjects',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Subject' },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Subjects'],
        summary: 'Create a new subject',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'History' },
                  color: { type: 'string', example: '#10B981' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Subject created',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Subject' } },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List all scheduled study tasks',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of tasks',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Task' },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create a new study task',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'dueDate', 'subjectId'],
                properties: {
                  title: { type: 'string', example: 'Read Chapter 4' },
                  dueDate: { type: 'string', format: 'date', example: '2026-10-15' },
                  subjectId: { type: 'string', format: 'uuid' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Task created',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Task' } },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/notes': {
      post: {
        tags: ['Notes'],
        summary: 'Upload and vectorize a study note',
        description: 'Saves note to PostgreSQL, generates embeddings via Gemini (text-embedding-004), and indexes into Pinecone for RAG.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'content', 'subjectId'],
                properties: {
                  title: { type: 'string', example: 'Photosynthesis Notes' },
                  content: { type: 'string', example: 'Plants absorb sunlight through chlorophyll...' },
                  subjectId: { type: 'string', format: 'uuid' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Note saved and indexed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Note saved and indexed using Gemini successfully!' },
                    note: { $ref: '#/components/schemas/Note' },
                  },
                },
              },
            },
          },
          '400': { description: 'Missing required fields' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/ai/chat': {
      post: {
        tags: ['AI'],
        summary: 'Chat with AI Tutor (Gemini 2.5 Flash + Pinecone RAG)',
        description: 'Queries relevant student notes from Pinecone, executes function calls for task scheduling if needed, and answers queries.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['message'],
                properties: {
                  message: { type: 'string', example: 'Explain the light-dependent reactions in photosynthesis' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'AI response reply and optional executed action details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    reply: { type: 'string', example: 'The light-dependent reactions occur in the thylakoid membranes...' },
                    actionExecuted: { type: 'boolean', example: false },
                    task: { $ref: '#/components/schemas/Task' },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
  },
};

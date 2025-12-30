# Backend Structure

This backend folder contains multiple projects organized by client/brand.

## Structure

```
backend/
├── Raavito/
│   └── HomieBites/          # HomieBites tiffin service backend
│       ├── config/          # Database configuration
│       ├── models/          # Mongoose models
│       ├── routes/          # API routes
│       ├── middleware/      # Auth middleware
│       ├── scripts/         # Utility scripts (seed, verify)
│       ├── server.js        # Express server
│       └── README.md        # HomieBites documentation
├── package.json             # Backend dependencies
└── .env                     # Environment variables
```

````markdown
# Backend Structure

This backend folder contains the HomieBites backend project.

## Structure

```
backend/
├── HomieBites/          # HomieBites tiffin service backend
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── scripts/         # Utility scripts (seed, verify)
│   ├── server.js        # Express server
│   └── README.md        # HomieBites documentation
├── package.json         # Backend dependencies and scripts
└── .env                 # Environment variables
```

## HomieBites Backend

See [HomieBites/README.md](./HomieBites/README.md) for complete documentation.

### Quick Start

```bash
# Install dependencies
npm install

# Start server
npm start

# Seed test data
npm run seed

# Verify data
npm run verify
```

## Environment Variables

Create `.env` file in `backend/` directory:

```env
MONGOURI=mongodb://remoteUser:95OztwADZCCVeFzy@sql.infodatixhosting.com:27017/HomieBites?authSource=admin
JWT_SECRET=YBIocj5v7exl45cb
PORT=3001
NODE_ENV=development
```

**Note:** Database name in connection string is `/HomieBites`.
````

import app from './app';
import configuration from './config/configuration';

const config = configuration();
const PORT = config.app.port;

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 SaveTogether Backend API running at http://localhost:${PORT}/${config.app.apiPrefix} [${config.app.environment.toUpperCase()}]`);
});

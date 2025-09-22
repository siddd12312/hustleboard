const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const opportunitiesRoutes = require('./routes/opportunities');
const resourcesRoutes = require('./routes/resources');
const earningsRoutes = require('./routes/earnings');
const hustlesRoutes = require('./routes/hustles');
const app = express();
let port1 = process.env.PORT || 3001;
app.use(helmet());
app.use(cors({
origin : process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}
));
app.use(express.json({
limit: '10mb' }
));
app.use(express.urlencoded({
extended : true }
));
app.use(morgan('combined'));
app.get('/api/health',
 (req,
 res) => {
res.status(200).json(
    {
success: true,
      message: 'HustleBoard API is running!',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
);
}
);
app.use('/api/auth',
   authRoutes);
app.use('/api/dashboard',
dashboardRoutes);
app.use('/api/opportunities',
 opportunitiesRoutes);
app.use('/api/resources',
   resourcesRoutes);
app.use('/api/earnings',
 earningsRoutes);
app.use('/api/hustles',
 hustlesRoutes);
app.use('*',
 (req,
 res) => {
res.status(404).json({
success: false,
    message: 'Route not found'
  }
);
}
);
app.use((err,
 req,
 res,
 next) => {
console.error('Error:',
 err);
res.status(500).json(
    {
success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    }
);
}
);
app.listen(port1,
 () => {
console.log('api run port',
 port1);
console.log('health at',
'http://localhost:' + port1 + '/api/health');
console.log('cors for',
 process.env.CORS_ORIGIN || 'http://localhost:3000');
}
);
module.exports = app;

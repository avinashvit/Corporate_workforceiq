import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-json-db-sync',
      configureServer(server) {
        server.middlewares.use('/api/save-user', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', () => {
              try {
                const newUser = JSON.parse(body);
                const dataPath = path.resolve(__dirname, 'data/users.json');
                const publicPath = path.resolve(__dirname, 'public/data/users.json');
                const distPath = path.resolve(__dirname, 'dist/data/users.json');

                const currentUsers = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
                const idx = currentUsers.findIndex(
                  (u) => u.email.toLowerCase() === (newUser.email || '').toLowerCase()
                );

                if (idx >= 0) {
                  currentUsers[idx] = { ...currentUsers[idx], ...newUser };
                } else {
                  currentUsers.push(newUser);
                }

                const jsonStr = JSON.stringify(currentUsers, null, 2);
                fs.writeFileSync(dataPath, jsonStr, 'utf8');
                if (fs.existsSync(path.dirname(publicPath))) {
                  fs.writeFileSync(publicPath, jsonStr, 'utf8');
                }
                if (fs.existsSync(distPath)) {
                  fs.writeFileSync(distPath, jsonStr, 'utf8');
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, count: currentUsers.length }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          } else {
            res.statusCode = 405;
            res.end();
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});


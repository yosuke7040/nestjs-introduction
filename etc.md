nvm use v17.9.0

npm run start:dev

npx typeorm migration:generate -n AddUserIdColumn
### migrationする前はビルドが必要そう
npx typeorm migration:run

### postmanで実行するとjwtが手に入るからそれをヘッダーにつける
http://localhost:3000/auth/signup
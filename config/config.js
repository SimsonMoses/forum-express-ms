import 'dotenv/config';

export default{
  development: {
    username:  "root",
    password:  "orOGJLhWedbGDTfOSTamjuRAsxnZAozs",
    database: "forum",
    host:  "junction.proxy.rlwy.net",
    port: 48655,
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql"
  }
}
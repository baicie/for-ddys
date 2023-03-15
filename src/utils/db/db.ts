import { DataSource } from 'typeorm';
import { Infor, Movice, Play, User } from '../../entity';

const connection = new DataSource({
  type: 'mysql',
  database: 'ddtv',
  host: '81.70.58.141',
  port: 3306,
  username: 'zsw',
  password: 'a123456',
  logging: false,
  entities: [User, Movice, Play, Infor],
  synchronize: true,
});

export default connection;
// connection.getRepository

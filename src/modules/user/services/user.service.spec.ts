import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createConnection, getConnection, getRepository, Repository } from 'typeorm';
import { UserEntity } from '../models/User.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  const testConnectionName = 'testConnection';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: getRepositoryToken(UserEntity), useClass: Repository }],
    }).compile();

    let connection = await createConnection({
      type: "mysql",
      database: ":memory:",
      dropSchema: true,
      entities: [UserEntity],
      synchronize: true,
      logging: false,
      name: testConnectionName
    });
    
    repository = getRepository(UserEntity, testConnectionName);
    service = module.get<UserService>(UserService);

    return connection;
  });

  afterEach(async () => {
    await getConnection(testConnectionName).close()
  }); 

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

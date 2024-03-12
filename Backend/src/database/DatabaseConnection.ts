import { DataSource, ObjectLiteral, EntityTarget, Repository } from 'typeorm';
import Character from '../models/entities/Character';
import Movie from '../models/entities/Movie';
import User from '../models/entities/User';

export default class DatabaseConnection {
    private dataSource: DataSource;

    private static instance: DatabaseConnection;

    private constructor() {
        this.dataSource = new DataSource({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'YOUR_MYSQL_USER',
            password: 'YOUR_MYSQL_PASSWORD',
            database: 'ucm_plus',
            synchronize: true,
            entities: [User, Movie, Character],
            ssl: {
                rejectUnauthorized: false
            }
        });
    }

    private get isConnected(): boolean {
        return this.dataSource.isInitialized;
    }

    public getRepository<Entity extends ObjectLiteral>(
        entityTarget: EntityTarget<Entity>
    ): Repository<Entity> {
        return this.dataSource.getRepository(entityTarget);
    }

    private async connect(): Promise<void> {
        try {
            await this.dataSource.initialize();
            console.log('Conexión a la base de datos establecida correctamente.');
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error);
        }
    }


    public static async getConnectedInstance(): Promise<DatabaseConnection> {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }

        if (!DatabaseConnection.instance.isConnected) {
            console.log("Conectando...")
            await DatabaseConnection.instance.connect();
            console.log("Conectado")
        }

        return DatabaseConnection.instance;
    }
}

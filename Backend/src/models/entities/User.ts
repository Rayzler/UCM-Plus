import { Entity, PrimaryGeneratedColumn, Column, Repository, QueryFailedError } from 'typeorm';
import DatabaseConnection from '../../database/DatabaseConnection';

@Entity({ name: 'users' })
export default class User {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    public id: number;

    @Column({ type: 'varchar', length: 20, nullable: false, unique: true })
    public username: string;

    @Column({ type: 'varchar', length: 32, nullable: false })
    public password: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    public fullname: string;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    public email: string;

    @Column({ type: 'datetime', nullable: false })
    public createdAt: Date;

    @Column({ type: 'datetime', nullable: false })
    public updatedAt: Date;

    private constructor(
        id: number | undefined,
        username: string,
        password: string,
        fullname: string,
        email: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = <number>id;
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static async register(username: string, password: string, fullname: string, email: string): Promise<User> {
        const usersRespository = await this.getUsersRepository();

        const createdAt = new Date();

        const user = new User(
            undefined,
            username,
            password,
            fullname,
            email,
            createdAt,
            createdAt
        );

        try {
            await usersRespository.save(user);
        }
        catch (e: any) {
            if (e instanceof QueryFailedError && e.message.includes('ER_DUP_ENTRY')) {
                if (e.message.includes("@"))
                    throw new Error('DUPLICATE_EMAIL_ENTRIES');
                else
                    throw new Error('DUPLICATE_USER_ENTRIES');
            }

            throw e;
        }

        return user;
    }

    public static async searchByUser(username: string, password: string): Promise<User> {
        const usersRespository = await this.getUsersRepository();

        const user = await usersRespository.findOneBy({ username });

        if (!user) 
            throw new Error('USER_NOT_FOUND');
        else if (user.password !== password)
            throw new Error('UNAUTHORIZED');

        return user;
    }

    private static async getUsersRepository(): Promise<Repository<User>> {
        const databaseConnection = await DatabaseConnection.getConnectedInstance();
        return databaseConnection.getRepository(User);
    }
}

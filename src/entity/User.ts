import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne,
    BeforeInsert, BeforeUpdate, JoinColumn
} from "typeorm";

import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, MaxLength, MinLength} from "class-validator";

/**
 * User Entity
 */
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: "uuid",
        type: "varchar",
        length: 150,
        unique: true
    })
    uuid: string;

    @Column({
        name: "email",
        type: "varchar",
        length: 180,
        unique: true
    })
    @IsEmail()
    @MaxLength(180, {
        message: "Email is too long"
    })
    email: string;

    @Column({
        name: "username",
        type: "varchar",
        length: 50,
        unique: true
    })
    @MinLength(3, {
        message: "Username is too short"
    })
    @MaxLength(50, {
        message: "Username is too long"
    })
    username: string;

    @Column({
        name: "password",
        type: "varchar",
        length: 150
    })
    password: string;

    @Column({
        name: "salt",
        type: "varchar",
        length: 150
    })
    salt: string;

    @Column({
        name: "display_name",
        type: "varchar",
        length: 150
    })
    @MaxLength(150, {
        message: "Display name is too long"
    })
    displayName: string;

    @Column({
        name: "activation_code",
        type: "varchar",
        length: 150
    })
    activationCode: string;

    @Column({
        name: "roles",
        type: "json"
    })
    roles: string[];

    @Column({
        name: "created_at",
        type: "timestamp"
    })
    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(type => User)
    @JoinColumn({ name: "created_by_id" })
    createdBy: User;

    @Column({
        name: "updated_at",
        type: "timestamp"
    })
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(type => User)
    @JoinColumn({ name: "updated_by_id" })
    updatedBy: User;

    @Column({
        name: "is_active",
        type: "boolean"
    })
    isActive: number;

    /**
     *
     * @param {string} email
     * @param {string} username
     * @param {string} password
     * @param {string} salt
     * @param {string} displayName
     * @param {string} activationCode
     * @param {string[]} roles
     * @param {number} isActive
     */
    constructor(displayName?: string, email?: string, username?: string, password?: string, salt?: string, activationCode?: string, roles?: string[], isActive?: number) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.displayName = displayName;
        this.activationCode = activationCode;
        this.roles = roles;
        this.isActive = isActive;
    }

    @BeforeInsert()
    beforeCreate() {
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
    }

    @BeforeUpdate()
    beforeUpdate() {
        this.updatedAt = new Date();
    }

}

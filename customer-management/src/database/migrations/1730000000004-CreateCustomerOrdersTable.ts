import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCustomerOrdersTable1730000000004
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'customer_orders',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'customer_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'order_id',
            type: 'uuid',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'total_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'order_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create foreign key for customer_id
    await queryRunner.createForeignKey(
      'customer_orders',
      new TableForeignKey({
        name: 'FK_customer_orders_customer',
        columnNames: ['customer_id'],
        referencedTableName: 'customers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Create index on customer_id for faster queries
    await queryRunner.query(
      `CREATE INDEX "IDX_customer_orders_customer_id" ON "customer_orders" ("customer_id")`,
    );

    // Create unique index on order_id
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_customer_orders_order_id" ON "customer_orders" ("order_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_customer_orders_order_id"`);
    await queryRunner.query(`DROP INDEX "IDX_customer_orders_customer_id"`);
    await queryRunner.dropForeignKey(
      'customer_orders',
      'FK_customer_orders_customer',
    );
    await queryRunner.dropTable('customer_orders', true);
  }
}

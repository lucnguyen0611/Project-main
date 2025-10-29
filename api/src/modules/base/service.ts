import { BaseEntity } from '@/modules/base/entity';
import {
  Repository,
  SelectQueryBuilder,
  InsertQueryBuilder,
  UpdateQueryBuilder,
  InsertResult,
  UpdateResult,
  FindOptionsWhere,
} from 'typeorm';
import { BaseServiceI, Role, UserI } from '@/shares';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {
  InternalServerErrorException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export abstract class BaseService<
  Entity extends BaseEntity,
  RequestI,
  ResponseI,
> implements BaseServiceI<RequestI, ResponseI>
{
  protected constructor(
    protected repository: Repository<Entity>,
    protected readonly cls: ClsService,
  ) {}

  async find(condition = {}) {
    let query: SelectQueryBuilder<Entity> = this.handleSelect();
    query = this.handleWhere(query, { ...condition, active: true } as Partial<
      Record<keyof Entity, any>
    >);
    const results = await query.getRawMany<ResponseI>();
    return results.map((result) => ({
      ...result,
      // @ts-ignore
      id: parseInt(String(result.id), 10),
    }));
  }

  async findOne(id: number) {
    let query: SelectQueryBuilder<Entity> = this.handleSelect();
    query = this.handleWhere(query, { id, active: true } as Partial<
      Record<keyof Entity, any>
    >);
    const response = await query.getRawOne<ResponseI>();
    if (!response) {
      throw new NotFoundException('Record not found');
    }
    return {
      ...response,
      // @ts-ignore
      id: parseInt(String(response.id), 10),
    };
  }

  async findOneBy(condition = {}) {
    let query: SelectQueryBuilder<Entity> = this.handleSelect();
    query = this.handleWhere(query, { ...condition, active: true } as Partial<
      Record<keyof Entity, any>
    >);

    const response = await query.getRawOne<ResponseI>();
    if (!response) return null;
    return response;
  }

  async create(data: RequestI) {
    const userId: number | null = this.getAuthenticatedUserId();
    const dataWithUserId = { ...data, created_by: userId };

    const query: InsertQueryBuilder<Entity> = this.repository
      .createQueryBuilder(this.getTableName())
      .insert()
      .values(dataWithUserId as QueryDeepPartialEntity<Entity>)
      .returning(this.getPublicColumns());
    const response: InsertResult = await query.execute();
    if (
      !response ||
      !Array.isArray(response.raw) ||
      response.raw.length === 0
    ) {
      throw new InternalServerErrorException('Failed to create new record');
    }
    return response.raw[0] as ResponseI;
  }

  async updateOne(id: number, data: Partial<RequestI>) {
    const userId: number | null = this.getAuthenticatedUserId();
    const dataWithUserId = { ...data, updated_by: userId };

    const query: UpdateQueryBuilder<Entity> = this.repository
      .createQueryBuilder(this.getTableName())
      .update()
      .set(dataWithUserId as QueryDeepPartialEntity<Entity>)
      .where('id = :id and active = :active', { id, active: true })
      .returning(this.getPublicColumns());

    const response: UpdateResult = await query.execute();
    if (
      !response ||
      !Array.isArray(response.raw) ||
      response.raw.length === 0
    ) {
      throw new InternalServerErrorException('Failed to update record');
    }
    return response.raw[0] as ResponseI;
  }

  async softDelete(id: number) {
    // QueryBuilder cannot help with calling subscribers => use repository pattern
    // need to call subscribers for the need of "soft-delete cascade"

    const entity: Entity | null = await this.repository.findOne({
      where: { id, active: true } as FindOptionsWhere<Entity>,
    });
    if (!entity) {
      throw new NotFoundException(
        'Record not found or has already been deleted',
      );
    }

    const userId: number | null = this.getAuthenticatedUserId();
    const now = new Date();

    entity.deleted_at = now;
    entity.deleted_by = userId;
    entity.active = false;
    entity.updated_at = now;
    entity.updated_by = userId;

    await this.repository.save(entity); // calling save will trigger subscribers

    return {
      msg: 'Successfully deleted',
    };
  }

  protected getAuthenticatedUserId(): number | null {
    const user = this.cls.get<UserI>('user');
    return user ? user.id : null;
  }

  protected getAuthenticatedRole(): Role | null {
    const user = this.cls.get<UserI>('user');
    return user ? user.role : null;
  }

  protected getPublicColumns() {
    const privateColumns: string[] = [
      'created_at',
      'created_by',
      'updated_at',
      'updated_by',
      'deleted_at',
      'deleted_by',
      'active',
    ];
    const columns: string[] = this.repository.metadata.columns.map(
      (column) => column.propertyName,
    );
    return columns.filter((column) => !privateColumns.includes(column));
  }

  protected getTableName() {
    return this.repository.metadata.tableName;
  }

  protected handleSelect(): SelectQueryBuilder<Entity> {
    return this.repository
      .createQueryBuilder(this.getTableName())
      .select(this.getPublicColumns());
  }

  protected handleWhere(
    query: SelectQueryBuilder<Entity>,
    condition: Partial<Record<keyof Entity, any>>,
  ): SelectQueryBuilder<Entity> {
    Object.entries(condition).forEach(([key, value], index: number) => {
      const paramName = `param_${index}`;
      if (index === 0) {
        query.where(`${query.alias}.${key} = :${paramName}`, {
          [paramName]: value,
        });
      } else {
        query.andWhere(`${query.alias}.${key} = :${paramName}`, {
          [paramName]: value,
        });
      }
    });
    return query;
  }
}

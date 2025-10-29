import {
    EntityManager,
    EntitySubscriberInterface,
    UpdateEvent,
} from "typeorm";
import {BaseEntity} from "@/modules/base/entity";

export abstract class BaseCascadeSubscriber<T extends BaseEntity>
    implements EntitySubscriberInterface<T> {

    protected constructor(
        private readonly cascades: { childEntity: any; foreignKey: string }[]
    ) {
    }


    /**
     * Before update ensures cascades happen in the same transaction
     */
    async beforeUpdate(event: UpdateEvent<T>): Promise<void> {
        if (!event.entity || !event.databaseEntity) return;

        // check if this update is soft-delete
        const entity = event.entity as T;   // "after" value
        const dbEntity = event.databaseEntity as T; // "before" value
        // compare "before" and "after" values of deleted_at and active
        if (!dbEntity.deleted_at && entity.deleted_at && dbEntity.active && !entity.active) {

            const deleted_by: number | null = entity.deleted_by ?? null;
            await this.cascadeSoftDelete(deleted_by, entity, event.manager);
        }
    }

    /**
     * Run soft-delete on child entities
     */
    private async cascadeSoftDelete(deleted_by: number | null, parent: T, manager: EntityManager) {
        const now = new Date();

        for (const cascade of this.cascades) {
            // const repo = BaseCascadeSubscriber.dataSource.getRepository(cascade.childEntity);
            // const children = await repo.find({
            //     where: { [cascade.foreignKey]: parent.id },
            // });
            //
            // if (!children.length) continue;
            //
            // for (const child of children) {
            //     child.deleted_by = deleted_by;
            //     child.deleted_at = now;
            //     child.active = false;
            // }
            //
            // // Use save to trigger subscribers of child entities
            // await repo.save(children);

            const repo = manager.getRepository(cascade.childEntity);

            // find active children
            const children = await repo.find({
                where: {
                    [cascade.foreignKey]: parent.id,
                    active: true,
                    deleted_at: null,
                },
            })
            if (!children.length) continue;

            // update each child and save to trigger their subscribers (for deep cascade)
            for (const child of children) {
                child.deleted_by = deleted_by;
                child.deleted_at = now;
                child.active = false;
                child.updated_by = deleted_by;
                child.updated_at = now;
            }
            await repo.save(children);
        }
    }
}

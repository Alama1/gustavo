import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('watch_list')
export class WatchListEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'text', nullable: false })
  user_id: string;

  @Column({ type: 'text', nullable: false })
  avatar: string;
}

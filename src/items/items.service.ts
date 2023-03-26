import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemStatus } from './item-status.enum';
import { Item } from '../entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemRepository } from './item.repository';
import { User } from '../entities/user.entity';


@Injectable()
export class ItemsService {
  constructor(private readonly itemRepository: ItemRepository) {}
  private items: Item[] = [];

  async findAll(): Promise<Item[]> {
    return await this.itemRepository.find();
  }

  async findById(id: string): Promise<Item> {
    const found = await this.itemRepository.findOne(id);
    // const found = this.items.find((item) => item.id === id);
    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  async create(createItemDto: CreateItemDto, user: User): Promise<Item> {
    // const item: Item = {
    //   id: uuid(),
    //   ...createItemDto,
    //   status: ItemStatus.ON_SALE,
    // }
    // this.items.push(item);
    // return item;
    return await this.itemRepository.createItem(createItemDto, user);
  }

  async updateStatus(id: string, user: User): Promise<Item> {
    const item = await this.findById(id);
    if (item.userId === user.id) {
      throw new BadRequestException('自身の商品を購入することは出来ません。')
    }

    item.status = ItemStatus.SOLD_OUT;
    item.updatedAt = new Date().toISOString();
    await this.itemRepository.save(item);
    return item;
  }

  async delete(id: string, user: User): Promise<void> {
    // this.items = this.items.filter((item) => item.id !== id);

    const item = await this.findById(id);
    if (item.userId !== user.id) {
      throw new BadRequestException('他人の商品は削除できません')
    }
    // await this.itemRepository.delete(item);

    await this.itemRepository.delete({ id });
  }
}
